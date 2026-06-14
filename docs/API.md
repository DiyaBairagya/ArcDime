# ArcDime API Documentation

ArcDime backend is built using FastAPI. Most routes are protected using JWT authentication and work with user-specific data.

---

## Base URL

Local backend URL:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Authentication

Most ArcDime routes require a JWT access token.

Use this header:

```http
Authorization: Bearer <access_token>
```

---

# Auth Routes

## POST `/auth/signup`

Creates a new user account.

### Request Body

```json
{
  "name": "Diya Bairagy",
  "email": "diya@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Diya Bairagy",
    "email": "diya@example.com"
  }
}
```

---

## POST `/auth/login`

Logs in an existing user.

### Request Body

```json
{
  "email": "diya@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "Diya Bairagy",
    "email": "diya@example.com"
  }
}
```

---

## GET `/auth/me`

Returns the currently authenticated user.

### Headers

```http
Authorization: Bearer <access_token>
```

### Response

```json
{
  "id": 1,
  "name": "Diya Bairagy",
  "email": "diya@example.com",
  "dob": "2004-05-21"
}
```

---

## PUT `/auth/profile`

Updates user profile details.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "name": "Diya Bairagy",
  "dob": "2004-05-21"
}
```

### Response

```json
{
  "id": 1,
  "name": "Diya Bairagy",
  "email": "diya@example.com",
  "dob": "2004-05-21"
}
```

---

## PUT `/auth/change-password`

Changes the authenticated user's password.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

### Response

```json
{
  "message": "Password updated successfully"
}
```

---

# Expense Routes

## GET `/expenses`

Returns all expenses for the authenticated user.

### Headers

```http
Authorization: Bearer <access_token>
```

### Response

```json
[
  {
    "id": 1,
    "amount": 450,
    "category": "Food",
    "merchant": "Swiggy",
    "description": "Dinner order",
    "expense_date": "2026-05-21",
    "source_type": "manual"
  }
]
```

---

## POST `/expenses`

Creates a new expense.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "amount": 450,
  "category": "Food",
  "merchant": "Swiggy",
  "description": "Dinner order",
  "expense_date": "2026-05-21",
  "source_type": "manual"
}
```

### Response

```json
{
  "id": 1,
  "amount": 450,
  "category": "Food",
  "merchant": "Swiggy",
  "description": "Dinner order",
  "expense_date": "2026-05-21",
  "source_type": "manual"
}
```

---

## PUT `/expenses/{expense_id}`

Updates an existing expense.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "amount": 500,
  "category": "Food",
  "merchant": "Swiggy",
  "description": "Updated dinner order",
  "expense_date": "2026-05-21",
  "source_type": "manual"
}
```

---

## DELETE `/expenses/{expense_id}`

Deletes an expense belonging to the authenticated user.

### Headers

```http
Authorization: Bearer <access_token>
```

---

# Analytics Routes

## GET `/analytics/monthly`

Returns monthly analytics for the authenticated user.

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Parameters

```text
year=2026
month=5
```

### Example URL

```text
/analytics/monthly?year=2026&month=5
```

### Response Includes

```text
total_spending
total_expenses
category_breakdown
daily_breakdown
highest_category
insights
alerts
financial_health_score
budget_status
```

### Example Response

```json
{
  "year": 2026,
  "month": 5,
  "total_spending": 2100,
  "total_expenses": 3,
  "category_breakdown": [
    {
      "category": "Food",
      "amount": 1200
    }
  ],
  "daily_breakdown": [],
  "highest_category": {
    "category": "Food",
    "amount": 1200
  },
  "insights": [],
  "alerts": [],
  "financial_health_score": 85,
  "budget_status": {
    "has_budget": true,
    "monthly_limit": 10000,
    "monthly_spent": 2100,
    "monthly_remaining": 7900,
    "monthly_used_percentage": 21,
    "is_monthly_over_budget": false,
    "category_status": []
  }
}
```

---

# Budget Routes

## GET `/budgets/monthly`

Returns the monthly budget for the authenticated user.

### Headers

```http
Authorization: Bearer <access_token>
```

### Query Parameters

```text
year=2026
month=5
```

### Example URL

```text
/budgets/monthly?year=2026&month=5
```

---

## PUT `/budgets/monthly`

Creates or updates a monthly budget.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "year": 2026,
  "month": 5,
  "monthly_limit": 10000,
  "category_limits": {
    "Food": 3000,
    "Travel": 2000,
    "Shopping": 1500
  }
}
```

### Response

```json
{
  "id": 1,
  "year": 2026,
  "month": 5,
  "monthly_limit": 10000,
  "category_limits": {
    "Food": 3000,
    "Travel": 2000,
    "Shopping": 1500
  }
}
```

---

# AI Category Route

## POST `/ai/suggest-category`

Suggests an expense category based on merchant or description text.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "text": "Swiggy dinner order"
}
```

### Response

```json
{
  "suggested_category": "Food",
  "confidence": "high",
  "matched_keywords": ["swiggy", "dinner"]
}
```

---

# OCR Routes

## POST `/ocr/extract-text`

Accepts a bill image and extracts text using OCR.

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Form Data

```text
file: bill image
```

### Response

```json
{
  "filename": "bill.jpg",
  "extracted_text": "Bill text here",
  "line_count": 12,
  "parsed_expense": {
    "amount": 450,
    "merchant": "Swiggy",
    "expense_date": "2026-05-21",
    "category": "Food",
    "description": "Extracted from bill image",
    "source_type": "ocr"
  }
}
```

---

## POST `/ocr/parse-expense`

Parses raw OCR text into structured expense data.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "text": "Swiggy Total 450 Food 21/05/2026"
}
```

---

# Voice Route

## POST `/voice/parse-expense`

Parses a voice transcript into structured expense data.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "text": "Spent 450 rupees on groceries today"
}
```

### Response

```json
{
  "amount": 450,
  "category": "Groceries",
  "merchant": null,
  "description": "Spent 450 rupees on groceries today",
  "expense_date": "2026-05-21",
  "confidence": "medium",
  "matched_keywords": ["groceries"],
  "source_type": "voice"
}
```

---

# Assistant Route

## POST `/assistant/ask`

Answers user questions using authenticated monthly expense context.

### Headers

```http
Authorization: Bearer <access_token>
```

### Request Body

```json
{
  "question": "Where did I spend the most this month?",
  "year": 2026,
  "month": 5
}
```

### Example Questions

```text
Give me a summary of this month.
Where did I spend the most?
Can I stay under ₹10000 this month?
What if I spend ₹2000 more this month?
What if I reduce Food spending by ₹100?
How much should I save to spend 15% less than last month?
Tell me a wise plan to save budget.
```

### Response

```json
{
  "answer": "Your highest spending category this month is Food.",
  "intent": "llm_sql_rag"
}
```

---

# Health Routes

## GET `/`

Returns backend status message.

## GET `/health`

Returns health check response.

```json
{
  "status": "healthy",
  "service": "ArcDime Backend"
}
```