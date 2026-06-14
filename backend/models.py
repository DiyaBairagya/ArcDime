from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    dob = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    expenses = relationship("ExpenseModel", back_populates="user")


class ExpenseModel(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    merchant = Column(String, nullable=True)
    description = Column(String, nullable=True)
    expense_date = Column(Date, nullable=False)
    source_type = Column(String, default="manual")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("UserModel", back_populates="expenses")
    
class BudgetModel(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)

    monthly_limit = Column(Float, nullable=False, default=0)
    category_limits = Column(JSON, nullable=True, default={})

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)