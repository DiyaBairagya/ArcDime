from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import UserModel
from routes.auth import get_current_user
from schemas import BudgetResponse, BudgetUpsertRequest
from services.budget_service import get_budget_for_month, upsert_budget

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("/monthly", response_model=BudgetResponse)
def get_monthly_budget(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    budget = get_budget_for_month(db, current_user.id, year, month)

    if not budget:
        raise HTTPException(status_code=404, detail="Budget not set for this month")

    return budget


@router.put("/monthly", response_model=BudgetResponse)
def save_monthly_budget(
    request: BudgetUpsertRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if request.month < 1 or request.month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    if request.monthly_limit < 0:
        raise HTTPException(status_code=400, detail="Monthly budget cannot be negative")

    for category, limit in request.category_limits.items():
        if limit < 0:
            raise HTTPException(
                status_code=400,
                detail=f"{category} budget cannot be negative"
            )

    return upsert_budget(
        db=db,
        user_id=current_user.id,
        year=request.year,
        month=request.month,
        monthly_limit=request.monthly_limit,
        category_limits=request.category_limits,
    )