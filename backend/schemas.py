from datetime import date
from typing import List, Optional, Dict
from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    amount: float
    category: str
    merchant: Optional[str] = None
    description: Optional[str] = None
    expense_date: date
    source_type: str = "manual"


class ExpenseResponse(ExpenseCreate):
    id: int

    class Config:
        from_attributes = True


class CategorySuggestionRequest(BaseModel):
    text: str


class CategorySuggestionResponse(BaseModel):
    suggested_category: str
    confidence: str
    matched_keywords: List[str]


class OCRParseRequest(BaseModel):
    text: str


class VoiceExpenseRequest(BaseModel):
    text: str


class VoiceExpenseResponse(BaseModel):
    amount: Optional[float]
    category: str
    merchant: Optional[str] = None
    description: str
    expense_date: str
    confidence: str
    matched_keywords: List[str]
    source_type: str = "voice"


class AssistantQuestionRequest(BaseModel):
    question: str
    year: int
    month: int


class AssistantAnswerResponse(BaseModel):
    answer: str
    intent: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    
class BudgetUpsertRequest(BaseModel):
    year: int
    month: int
    monthly_limit: float
    category_limits: Dict[str, float] = {}


class BudgetResponse(BaseModel):
    id: int
    year: int
    month: int
    monthly_limit: float
    category_limits: Dict[str, float] = {}

    class Config:
        from_attributes = True
        
class UserProfileUpdateRequest(BaseModel):
    name: str
    dob: str | None = None


class PasswordUpdateRequest(BaseModel):
    current_password: str
    new_password: str