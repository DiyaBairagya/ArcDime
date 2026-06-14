from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database import get_db
from models import UserModel
from schemas import UserCreate, UserLogin, UserResponse, TokenResponse, UserProfileUpdateRequest, PasswordUpdateRequest
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
)

router = APIRouter(prefix="/auth", tags=["Auth"])

security = HTTPBearer()


@router.post("/signup", response_model=TokenResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(UserModel)
        .filter(UserModel.email == user_data.email.lower())
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if len(user_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    if len(user_data.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password is too long"
        )

    new_user = UserModel(
        name=user_data.name.strip(),
        email=user_data.email.lower().strip(),
        hashed_password=hash_password(user_data.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(
        data={"sub": str(new_user.id), "email": new_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = (
        db.query(UserModel)
        .filter(UserModel.email == login_data.email.lower())
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if len(login_data.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    user = db.query(UserModel).filter(UserModel.id == int(user_id)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


@router.get("/me", response_model=UserResponse)
def get_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.put("/profile")
def update_profile(
    request: UserProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if not request.name.strip():
        raise HTTPException(status_code=400, detail="Name cannot be empty")

    current_user.name = request.name.strip()
    current_user.dob = request.dob

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "dob": current_user.dob,
    }


@router.put("/change-password")
def change_password(
    request: PasswordUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 8 characters long"
        )

    if len(request.new_password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="New password is too long"
        )

    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    current_user.hashed_password = hash_password(request.new_password)

    db.commit()

    return {
        "message": "Password updated successfully"
    }