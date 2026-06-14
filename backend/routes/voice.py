from fastapi import APIRouter, HTTPException

from schemas import VoiceExpenseRequest, VoiceExpenseResponse
from services.voice_service import parse_voice_expense_text

router = APIRouter(prefix="/voice", tags=["Voice"])


@router.post("/parse-expense", response_model=VoiceExpenseResponse)
def parse_voice_expense(request: VoiceExpenseRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Voice text cannot be empty")

    return parse_voice_expense_text(request.text)