from datetime import datetime

from models import BudgetModel


def get_budget_for_month(db, user_id: int, year: int, month: int):
    return (
        db.query(BudgetModel)
        .filter(BudgetModel.user_id == user_id)
        .filter(BudgetModel.year == year)
        .filter(BudgetModel.month == month)
        .first()
    )


def upsert_budget(db, user_id: int, year: int, month: int, monthly_limit: float, category_limits: dict):
    budget = get_budget_for_month(db, user_id, year, month)

    if budget:
        budget.monthly_limit = monthly_limit
        budget.category_limits = category_limits
        budget.updated_at = datetime.utcnow()
    else:
        budget = BudgetModel(
            user_id=user_id,
            year=year,
            month=month,
            monthly_limit=monthly_limit,
            category_limits=category_limits,
        )

        db.add(budget)

    db.commit()
    db.refresh(budget)

    return budget


def build_budget_status(total_spending: float, category_breakdown: list, budget):
    if not budget:
        return {
            "has_budget": False,
            "monthly_limit": 0,
            "monthly_spent": total_spending,
            "monthly_remaining": None,
            "monthly_used_percentage": None,
            "is_monthly_over_budget": False,
            "category_status": [],
        }

    monthly_limit = budget.monthly_limit or 0
    monthly_remaining = monthly_limit - total_spending

    monthly_used_percentage = None
    if monthly_limit > 0:
        monthly_used_percentage = round((total_spending / monthly_limit) * 100, 2)

    category_limits = budget.category_limits or {}

    category_status = []

    for item in category_breakdown:
        category = item["category"]
        spent = item["amount"]
        limit = float(category_limits.get(category, 0) or 0)

        if limit > 0:
            remaining = limit - spent
            used_percentage = round((spent / limit) * 100, 2)

            category_status.append({
                "category": category,
                "limit": limit,
                "spent": spent,
                "remaining": remaining,
                "used_percentage": used_percentage,
                "is_over_budget": spent > limit,
            })

    return {
        "has_budget": True,
        "monthly_limit": monthly_limit,
        "monthly_spent": total_spending,
        "monthly_remaining": monthly_remaining,
        "monthly_used_percentage": monthly_used_percentage,
        "is_monthly_over_budget": monthly_limit > 0 and total_spending > monthly_limit,
        "category_status": category_status,
    }


def generate_budget_alerts(budget_status):
    alerts = []

    if not budget_status or not budget_status.get("has_budget"):
        return alerts

    used_percentage = budget_status.get("monthly_used_percentage")

    if used_percentage is not None:
        if used_percentage >= 100:
            alerts.append("You have crossed your monthly budget.")
        elif used_percentage >= 80:
            alerts.append("You have used more than 80% of your monthly budget.")

    for item in budget_status.get("category_status", []):
        if item["is_over_budget"]:
            alerts.append(f"{item['category']} is over its category budget.")
        elif item["used_percentage"] >= 80:
            alerts.append(f"{item['category']} has used more than 80% of its budget.")

    return alerts