import re
from calendar import monthrange
from datetime import date

from models import ExpenseModel
from services.analytics_service import build_monthly_analytics
from services.llm_service import generate_llm_answer


def detect_scenario_intent(question: str):
    cleaned = question.lower()

    # 1. Reduction should be checked first
    if any(word in cleaned for word in ["reduce", "cut", "decrease", "lower"]):
        return "reduce_category"

    # 2. Saving target compared to previous month
    if (
        "save" in cleaned
        and ("%" in cleaned or "percent" in cleaned)
        and (
            "last month" in cleaned
            or "previous month" in cleaned
            or "earlier month" in cleaned
        )
    ):
        return "save_percentage_vs_previous_month"

    if "less than last month" in cleaned or "less than previous month" in cleaned:
        return "save_percentage_vs_previous_month"

    # 3. Budget limit
    if "stay under" in cleaned or "under budget" in cleaned or "within budget" in cleaned:
        return "stay_under_budget"

    # 4. Extra spending should be checked after reduction
    if "what if" in cleaned and any(
        phrase in cleaned
        for phrase in [
            "spend more",
            "spent more",
            "extra",
            "additional",
            "add",
            "spend ₹",
            "spend rs",
            "spend rupees",
        ]
    ):
        return "extra_spending"

    return None


def extract_amount(question: str):
    patterns = [
        r"₹\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"rs\.?\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"rupees\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"\b([0-9]+(?:\.[0-9]{1,2})?)\b",
    ]

    for pattern in patterns:
        match = re.search(pattern, question.lower())
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                continue

    return None


def extract_percentage(question: str):
    match = re.search(r"([0-9]+(?:\.[0-9]{1,2})?)\s*%", question)

    if match:
        try:
            return float(match.group(1))
        except ValueError:
            return None

    return None


def extract_category(question: str):
    categories = [
        "Food",
        "Travel",
        "Shopping",
        "Groceries",
        "Bills",
        "Entertainment",
        "Healthcare",
        "Other",
    ]

    cleaned = question.lower()

    for category in categories:
        if category.lower() in cleaned:
            return category

    return None


def get_previous_month(year: int, month: int):
    if month == 1:
        return year - 1, 12

    return year, month - 1


def calculate_extra_spending_scenario(question: str, year: int, month: int, db, user_id: int):
    amount = extract_amount(question)

    if amount is None:
        return {
            "intent": "extra_spending",
            "answer": "Please mention the extra amount you are planning to spend, like: What if I spend ₹2000 more this month?"
        }

    current_analytics = build_monthly_analytics(year, month, db, user_id)

    current_total = current_analytics["total_spending"]
    projected_total = current_total + amount

    scenario_result = {
        "scenario_type": "extra_spending",
        "year": year,
        "month": month,
        "current_total": current_total,
        "extra_amount": amount,
        "projected_total": projected_total,
        "increase_percentage": round((amount / current_total) * 100, 2) if current_total > 0 else None,
        "current_health_score": current_analytics["financial_health_score"],
        "highest_category": current_analytics["highest_category"],
        "category_breakdown": current_analytics["category_breakdown"],
    }

    return explain_scenario_with_llm_or_fallback(question, scenario_result)


def calculate_reduce_category_scenario(question: str, year: int, month: int, db, user_id: int):
    amount = extract_amount(question)
    category = extract_category(question)

    if amount is None:
        return {
            "intent": "reduce_category",
            "answer": "Please mention how much you want to reduce, like: What if I reduce Food spending by ₹1000?"
        }

    current_analytics = build_monthly_analytics(year, month, db, user_id)
    current_total = current_analytics["total_spending"]

    category_breakdown = current_analytics["category_breakdown"]

    if not category and category_breakdown:
        highest_category = current_analytics["highest_category"]
        category = highest_category["category"] if highest_category else None

    category_current_amount = 0

    for item in category_breakdown:
        if item["category"] == category:
            category_current_amount = item["amount"]
            break

    actual_reduction = min(amount, category_current_amount) if category_current_amount > 0 else amount
    projected_total = max(0, current_total - actual_reduction)

    scenario_result = {
        "scenario_type": "reduce_category",
        "year": year,
        "month": month,
        "category": category,
        "category_current_amount": category_current_amount,
        "requested_reduction": amount,
        "actual_reduction_used": actual_reduction,
        "current_total": current_total,
        "projected_total": projected_total,
        "estimated_savings": actual_reduction,
        "current_health_score": current_analytics["financial_health_score"],
    }

    return explain_scenario_with_llm_or_fallback(question, scenario_result)


def calculate_savings_target_scenario(question: str, year: int, month: int, db, user_id: int):
    percentage = extract_percentage(question)

    if percentage is None:
        percentage = 15.0

    previous_year, previous_month = get_previous_month(year, month)

    current_analytics = build_monthly_analytics(year, month, db, user_id)
    previous_analytics = build_monthly_analytics(previous_year, previous_month, db, user_id)

    previous_total = previous_analytics["total_spending"]
    current_total = current_analytics["total_spending"]

    if previous_total == 0:
        return {
            "intent": "save_percentage_vs_previous_month",
            "answer": "I do not have spending data for the previous month, so I cannot calculate a percentage-based saving target yet."
        }

    target_total = previous_total * (1 - percentage / 100)
    remaining_allowed = target_total - current_total
    amount_to_reduce_from_current = max(0, current_total - target_total)

    scenario_result = {
        "scenario_type": "save_percentage_vs_previous_month",
        "year": year,
        "month": month,
        "previous_year": previous_year,
        "previous_month": previous_month,
        "previous_total": previous_total,
        "current_total": current_total,
        "target_reduction_percentage": percentage,
        "target_total": round(target_total, 2),
        "remaining_allowed_spending": round(remaining_allowed, 2),
        "amount_to_reduce_from_current": round(amount_to_reduce_from_current, 2),
        "current_health_score": current_analytics["financial_health_score"],
    }

    return explain_scenario_with_llm_or_fallback(question, scenario_result)


def calculate_stay_under_budget_scenario(question: str, year: int, month: int, db, user_id: int):
    budget_amount = extract_amount(question)

    if budget_amount is None:
        return {
            "intent": "stay_under_budget",
            "answer": "Please mention a budget amount, like: Can I stay under ₹10000 this month?"
        }

    current_analytics = build_monthly_analytics(year, month, db, user_id)
    current_total = current_analytics["total_spending"]

    last_day = monthrange(year, month)[1]
    today = date.today()

    if today.year == year and today.month == month:
        remaining_days = last_day - today.day
    else:
        remaining_days = last_day

    remaining_budget = budget_amount - current_total
    safe_daily_spending = remaining_budget / remaining_days if remaining_days > 0 else remaining_budget

    scenario_result = {
        "scenario_type": "stay_under_budget",
        "year": year,
        "month": month,
        "budget_amount": budget_amount,
        "current_total": current_total,
        "remaining_budget": round(remaining_budget, 2),
        "remaining_days": remaining_days,
        "safe_daily_spending": round(safe_daily_spending, 2),
        "is_currently_under_budget": current_total <= budget_amount,
        "current_health_score": current_analytics["financial_health_score"],
    }

    return explain_scenario_with_llm_or_fallback(question, scenario_result)


def explain_scenario_with_llm_or_fallback(question: str, scenario_result: dict):
    try:
        llm_answer = generate_llm_answer(
            question,
            {
                "mode": "what_if_scenario",
                "calculated_result": scenario_result,
                "instruction": "Explain the calculated result. Do not redo or invent calculations."
            }
        )

        if llm_answer:
            return {
                "intent": f"scenario_{scenario_result['scenario_type']}",
                "answer": llm_answer
            }

    except Exception as error:
        error_text = str(error)
        print("Scenario LLM failed, using fallback explanation:", error_text)

    return {
        "intent": f"scenario_{scenario_result['scenario_type']}_fallback",
        "answer": build_scenario_fallback_answer(scenario_result)
    }


def build_scenario_fallback_answer(result: dict):
    scenario_type = result["scenario_type"]

    if scenario_type == "extra_spending":
        return (
            f"If you spend ₹{result['extra_amount']:.2f} more this month, "
            f"your projected total will become ₹{result['projected_total']:.2f}. "
            f"Your current total is ₹{result['current_total']:.2f}."
        )

    if scenario_type == "reduce_category":
        category = result.get("category") or "selected category"
        return (
            f"If you reduce {category} spending by ₹{result['actual_reduction_used']:.2f}, "
            f"your projected monthly total will become ₹{result['projected_total']:.2f}. "
            f"That means estimated savings of ₹{result['estimated_savings']:.2f}."
        )

    if scenario_type == "save_percentage_vs_previous_month":
        if result["remaining_allowed_spending"] >= 0:
            return (
                f"To spend {result['target_reduction_percentage']}% less than last month, "
                f"your target this month is ₹{result['target_total']:.2f}. "
                f"You have spent ₹{result['current_total']:.2f}, so you can still spend about "
                f"₹{result['remaining_allowed_spending']:.2f}."
            )

        return (
            f"To spend {result['target_reduction_percentage']}% less than last month, "
            f"your target this month is ₹{result['target_total']:.2f}. "
            f"You have already spent ₹{result['current_total']:.2f}, so you are above the target by "
            f"₹{result['amount_to_reduce_from_current']:.2f}."
        )

    if scenario_type == "stay_under_budget":
        if result["is_currently_under_budget"]:
            return (
                f"Yes, you are currently under the ₹{result['budget_amount']:.2f} budget. "
                f"You have ₹{result['remaining_budget']:.2f} left. "
                f"That allows around ₹{result['safe_daily_spending']:.2f} per remaining day."
            )

        return (
            f"You are currently above the ₹{result['budget_amount']:.2f} budget by "
            f"₹{abs(result['remaining_budget']):.2f}."
        )

    return "I calculated the scenario, but could not generate a detailed explanation."