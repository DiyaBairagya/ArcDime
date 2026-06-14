from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import UserModel
from schemas import AssistantAnswerResponse, AssistantQuestionRequest
from routes.auth import get_current_user
from services.assistant_service import generate_expense_answer

router = APIRouter(prefix="/assistant", tags=["Assistant"])


@router.post("/ask", response_model=AssistantAnswerResponse)
def ask_expense_assistant(
    request: AssistantQuestionRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    if request.month < 1 or request.month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    return generate_expense_answer(
        request.question,
        request.year,
        request.month,
        db,
        current_user.id
    )