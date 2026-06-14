from fastapi import APIRouter, HTTPException

from schemas import CategorySuggestionRequest, CategorySuggestionResponse
from services.category_service import suggest_expense_category

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/suggest-category", response_model=CategorySuggestionResponse)
def suggest_category(request: CategorySuggestionRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    return suggest_expense_category(request.text)