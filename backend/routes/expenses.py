from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import ExpenseModel, UserModel
from schemas import ExpenseCreate, ExpenseResponse
from routes.auth import get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("", response_model=ExpenseResponse)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    new_expense = ExpenseModel(
        amount=expense.amount,
        category=expense.category,
        merchant=expense.merchant,
        description=expense.description,
        expense_date=expense.expense_date,
        source_type=expense.source_type,
        user_id=current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


@router.get("", response_model=List[ExpenseResponse])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    return (
        db.query(ExpenseModel)
        .filter(ExpenseModel.user_id == current_user.id)
        .order_by(ExpenseModel.id.desc())
        .all()
    )


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    updated_expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    expense = (
        db.query(ExpenseModel)
        .filter(ExpenseModel.id == expense_id)
        .filter(ExpenseModel.user_id == current_user.id)
        .first()
    )

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.amount = updated_expense.amount
    expense.category = updated_expense.category
    expense.merchant = updated_expense.merchant
    expense.description = updated_expense.description
    expense.expense_date = updated_expense.expense_date
    expense.source_type = updated_expense.source_type

    db.commit()
    db.refresh(expense)

    return expense


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    expense = (
        db.query(ExpenseModel)
        .filter(ExpenseModel.id == expense_id)
        .filter(ExpenseModel.user_id == current_user.id)
        .first()
    )

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted successfully"}