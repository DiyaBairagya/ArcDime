from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ExpenseModel, UserModel
from routes.auth import get_current_user
from services.analytics_service import build_monthly_analytics

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary")
def get_expense_summary(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    expenses = (
        db.query(ExpenseModel)
        .filter(ExpenseModel.user_id == current_user.id)
        .all()
    )

    total_spending = sum(expense.amount for expense in expenses)
    total_expenses = len(expenses)

    category_summary = defaultdict(float)

    for expense in expenses:
        category_summary[expense.category] += expense.amount

    category_breakdown = [
        {"category": category, "amount": amount}
        for category, amount in category_summary.items()
    ]

    highest_category = None

    if category_breakdown:
        highest_category = max(category_breakdown, key=lambda item: item["amount"])

    return {
        "total_spending": total_spending,
        "total_expenses": total_expenses,
        "category_breakdown": category_breakdown,
        "highest_category": highest_category
    }


@router.get("/monthly")
def get_monthly_analytics(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    return build_monthly_analytics(year, month, db, current_user.id)