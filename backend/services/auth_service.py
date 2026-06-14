import os
from datetime import datetime, timedelta

from dotenv import load_dotenv
from jose import jwt, JWTError
from passlib.context import CryptContext

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return password_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return password_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    token_data = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data.update({"exp": expire})

    encoded_token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_token


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None