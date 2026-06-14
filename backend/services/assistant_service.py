from calendar import monthrange
from collections import defaultdict
from datetime import date
from services.scenario_service import detect_scenario_intent
from services.scenario_service import calculate_extra_spending_scenario
from services.scenario_service import calculate_reduce_category_scenario
from services.scenario_service import calculate_savings_target_scenario
from services.scenario_service import calculate_stay_under_budget_scenario
from models import ExpenseModel
from services.analytics_service import generate_alerts, get_financial_health_score
from services.analytics_service import build_monthly_analytics
from services.llm_service import generate_llm_answer

def build_assistant_context(year: int, month: int, db, user_id: int):
    monthly_analytics = build_monthly_analytics(year, month, db, user_id)

    return {
        "year": year,
        "month": month,
        "total_spending": monthly_analytics["total_spending"],
        "total_expenses": monthly_analytics["total_expenses"],
        "category_breakdown": monthly_analytics["category_breakdown"],
        "daily_breakdown": monthly_analytics["daily_breakdown"],
        "highest_category": monthly_analytics["highest_category"],
        "alerts": monthly_analytics["alerts"],
        "insights": monthly_analytics["insights"],
        "financial_health_score": monthly_analytics["financial_health_score"],
        "budget_status": monthly_analytics["budget_status"],
    }

def generate_expense_answer(question: str, year: int, month: int, db, user_id: int):
    cleaned_question = question.lower()

    start_date = date(year, month, 1)
    last_day = monthrange(year, month)[1]
    end_date = date(year, month, last_day)

    expenses = (
        db.query(ExpenseModel)
        .filter(ExpenseModel.user_id == user_id)
        .filter(ExpenseModel.expense_date >= start_date)
        .filter(ExpenseModel.expense_date <= end_date)
        .all()
    )

    total_spending = sum(expense.amount for expense in expenses)
    total_expenses = len(expenses)
    
    if total_expenses == 0:
        return {
            "intent": "no_data",
            "answer": "I do not see any expenses recorded for this month yet. Add a few expenses first, and I can explain your spending patterns."
        }
        
    scenario_intent = detect_scenario_intent(question)

    if scenario_intent == "extra_spending":
        return calculate_extra_spending_scenario(question, year, month, db, user_id)

    if scenario_intent == "reduce_category":
        return calculate_reduce_category_scenario(question, year, month, db, user_id)

    if scenario_intent == "save_percentage_vs_previous_month":
        return calculate_savings_target_scenario(question, year, month, db, user_id)

    if scenario_intent == "stay_under_budget":
        return calculate_stay_under_budget_scenario(question, year, month, db, user_id)
    
    context = build_assistant_context(year, month, db, user_id)

    try:
        llm_answer = generate_llm_answer(question, context)

        if llm_answer:
            return {
                "intent": "llm_sql_rag",
                "answer": llm_answer
            }
    except Exception as error:
        error_text = str(error)
        print("LLM failed, falling back to rule-based assistant:", error_text)

        if "429" in error_text or "RESOURCE_EXHAUSTED" in error_text:
            if any(word in cleaned_question for word in ["save", "saving", "budget", "wise plan", "plan"]):
                highest_category_name = "your top category"
                highest_category_amount = 0

                if highest_category:
                    highest_category_name = highest_category.get("category", "your top category")
                    highest_category_amount = highest_category.get("amount", 0)

                saving_target = total_spending * 0.15
                suggested_limit = total_spending - saving_target

                return {
                    "intent": "budget_saving_plan_fallback",
                    "answer": (
                        "The AI assistant is temporarily rate-limited, so I used the built-in analysis instead. "
                        f"You have spent ₹{total_spending:.2f} this month across {total_expenses} expenses. "
                        f"A wise plan is to first reduce spending in {highest_category_name}, because it is your highest category"
                        f"{f' at ₹{highest_category_amount:.2f}' if highest_category_amount else ''}. "
                        f"Try saving around 15% of your current spending, which is about ₹{saving_target:.2f}. "
                        f"That means keeping your monthly spending near ₹{suggested_limit:.2f}. "
                        "For now, avoid non-essential purchases, set a category limit, and review expenses every 2–3 days."
                    )
                }

            return {
                "intent": "llm_quota_fallback",
                "answer": (
                "The AI assistant is temporarily rate-limited, so I used the built-in analysis instead. "
                f"You spent ₹{total_spending:.2f} this month across {total_expenses} expense entries."
                )
            }

    category_totals = defaultdict(float)

    for expense in expenses:
        category_totals[expense.category] += expense.amount

    category_breakdown = [
        {"category": category, "amount": amount}
        for category, amount in category_totals.items()
    ]

    if "total" in cleaned_question or "how much" in cleaned_question or "spend" in cleaned_question:
        return {
            "intent": "total_spending",
            "answer": f"You spent a total of ₹{total_spending:.2f} this month across {total_expenses} expense entries."
        }

    if "most" in cleaned_question or "highest" in cleaned_question or "top" in cleaned_question:
        highest_category = max(category_breakdown, key=lambda item: item["amount"])
        return {
            "intent": "highest_category",
            "answer": f"Your highest spending category this month is {highest_category['category']} with ₹{highest_category['amount']:.2f} spent."
        }

    if "category" in cleaned_question or "breakdown" in cleaned_question:
        breakdown_text = ", ".join(
            [f"{item['category']}: ₹{item['amount']:.2f}" for item in category_breakdown]
        )
        return {
            "intent": "category_breakdown",
            "answer": f"Here is your category-wise spending for this month: {breakdown_text}."
        }

    if "summary" in cleaned_question or "overview" in cleaned_question:
        highest_category = max(category_breakdown, key=lambda item: item["amount"])
        return {
            "intent": "summary",
            "answer": (
                f"This month, you spent ₹{total_spending:.2f} across {total_expenses} expenses. "
                f"Your highest spending category was {highest_category['category']} with ₹{highest_category['amount']:.2f}. "
                "You can review this category first if you want to control your spending better."
            )
        }

    if "average" in cleaned_question:
        average_expense = total_spending / total_expenses
        return {
            "intent": "average_expense",
            "answer": f"Your average expense value this month is ₹{average_expense:.2f}."
        }

    if "alert" in cleaned_question or "warning" in cleaned_question:
        alerts = generate_alerts(total_spending, category_breakdown)

        if not alerts:
            return {
                "intent": "alerts",
                "answer": "There are no major spending alerts for this month. Your spending looks reasonably controlled based on the current rules."
            }

        return {
            "intent": "alerts",
            "answer": "Here are your alerts: " + " ".join(alerts)
        }

    if "health" in cleaned_question or "score" in cleaned_question:
        alerts = generate_alerts(total_spending, category_breakdown)
        score = get_financial_health_score(
            total_spending,
            total_expenses,
            category_breakdown,
            alerts
        )

        return {
            "intent": "financial_health_score",
            "answer": f"Your financial health score for this month is {score}/100. This score is based on spending consistency, category balance, total spending, and alert count."
        }

    return {
        "intent": "fallback",
        "answer": (
            "I can currently answer questions like: total spending, highest category, category breakdown, "
            "monthly summary, average expense, alerts, and financial health score."
        )
    }