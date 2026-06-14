from collections import defaultdict
from datetime import date
from calendar import monthrange
from services.budget_service import build_budget_status, generate_budget_alerts, get_budget_for_month

from models import ExpenseModel


def generate_alerts(total_spending, category_breakdown):
    alerts = []

    if total_spending > 20000:
        alerts.append("Your monthly spending is quite high. Review major categories carefully.")
    elif total_spending > 10000:
        alerts.append("Your monthly spending crossed ₹10,000. Keep an eye on non-essential expenses.")

    for item in category_breakdown:
        category = item["category"]
        amount = item["amount"]

        if category.lower() in ["food", "shopping", "entertainment"] and amount > 5000:
            alerts.append(
                f"{category} spending is above ₹5,000 this month. Consider checking if this aligns with your budget."
            )

    return alerts


def get_financial_health_score(total_spending, total_expenses, category_breakdown, alerts):
    score = 100

    if total_spending == 0:
        return 100

    if alerts:
        score -= len(alerts) * 8

    if total_expenses > 20:
        score -= 8

    if category_breakdown:
        highest_category = max(category_breakdown, key=lambda item: item["amount"])
        highest_category_ratio = highest_category["amount"] / total_spending

        if highest_category_ratio > 0.5:
            score -= 15
        elif highest_category_ratio > 0.35:
            score -= 8

    if total_spending > 20000:
        score -= 12
    elif total_spending > 10000:
        score -= 6

    return max(0, min(100, score))


def generate_insights(total_spending, total_expenses, category_breakdown, daily_breakdown):
    insights = []

    if total_spending == 0:
        insights.append("No spending recorded for this month yet.")
        return insights

    if category_breakdown:
        highest_category = max(category_breakdown, key=lambda item: item["amount"])
        insights.append(
            f"Your highest spending category is {highest_category['category']} with ₹{highest_category['amount']:.2f} spent."
        )

    if total_expenses > 0:
        average_expense = total_spending / total_expenses
        insights.append(
            f"Your average expense value this month is ₹{average_expense:.2f}."
        )

    high_spending_days = [
        item for item in daily_breakdown
        if item["amount"] > (total_spending / max(len(daily_breakdown), 1)) * 1.5
    ]

    if high_spending_days:
        insights.append(
            f"You had {len(high_spending_days)} high-spending day(s) this month."
        )

    if total_expenses >= 10:
        insights.append(
            "You are actively recording expenses, which improves the accuracy of your financial insights."
        )

    return insights


def build_monthly_analytics(year: int, month: int, db, user_id: int):
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

    category_totals = defaultdict(float)
    daily_totals = defaultdict(float)

    for expense in expenses:
        category_totals[expense.category] += expense.amount
        daily_totals[str(expense.expense_date)] += expense.amount

    category_breakdown = [
        {"category": category, "amount": amount}
        for category, amount in category_totals.items()
    ]

    daily_breakdown = [
        {"date": expense_date, "amount": amount}
        for expense_date, amount in sorted(daily_totals.items())
    ]

    highest_category = None
    if category_breakdown:
        highest_category = max(category_breakdown, key=lambda item: item["amount"])
    
    budget = get_budget_for_month(db, user_id, year, month)
    budget_status = build_budget_status(total_spending, category_breakdown, budget)

    alerts = generate_alerts(total_spending, category_breakdown)
    alerts.extend(generate_budget_alerts(budget_status))
    insights = generate_insights(
        total_spending,
        total_expenses,
        category_breakdown,
        daily_breakdown
    )

    financial_health_score = get_financial_health_score(
        total_spending,
        total_expenses,
        category_breakdown,
        alerts
    )

    return {
        "year": year,
        "month": month,
        "total_spending": total_spending,
        "total_expenses": total_expenses,
        "category_breakdown": category_breakdown,
        "daily_breakdown": daily_breakdown,
        "highest_category": highest_category,
        "insights": insights,
        "alerts": alerts,
        "financial_health_score": financial_health_score,
        "budget_status": budget_status
    }