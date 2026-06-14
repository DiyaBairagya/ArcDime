# ArcDime Deployment Checklist

This document explains how to prepare ArcDime for deployment.

---

## Recommended Deployment Stack

```text
Frontend: Vercel or Netlify
Backend: Render or Railway
Database: Neon or Supabase PostgreSQL
```

---

## Pre-Deployment Checklist

Before deploying, confirm:

```text
.env is not committed
venv/ is not committed
node_modules/ is not committed
uploads/ is not committed
requirements.txt is updated
README.md is complete
.env.example files exist
frontend API URL is environment-based
backend CORS allows production frontend URL
```

---

## Backend Environment Variables

Create environment variables on the backend hosting platform.

```env
DATABASE_URL=postgresql://username:password@host:port/database

SECRET_KEY=replace_with_a_strong_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

GEMINI_API_KEY=your_gemini_api_key_here
```

Important:

```text
Never commit the real .env file to GitHub.
Use a strong SECRET_KEY in production.
```

---

## Frontend Environment Variables

Create environment variable on frontend hosting platform.

```env
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

Example:

```env
REACT_APP_API_BASE_URL=https://arcdime-backend.onrender.com
```

---

## Backend Deployment Steps

### 1. Push code to GitHub

```bash
git status
git add .
git commit -m "Finalize ArcDime project"
git push
```

---

### 2. Create hosted PostgreSQL database

Recommended options:

```text
Neon
Supabase PostgreSQL
Railway PostgreSQL
Render PostgreSQL
```

Copy the production database URL and add it as:

```env
DATABASE_URL=
```

---

### 3. Deploy FastAPI backend

Recommended services:

```text
Render
Railway
```

Backend root directory:

```text
backend
```

Install command:

```bash
pip install -r requirements.txt
```

Start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

### 4. Add backend environment variables

Add:

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=
```

---

### 5. Update backend CORS

In `backend/main.py`, update allowed origins:

```python
origins = [
    "http://localhost:3000",
    "https://your-frontend-url.com"
]
```

After deploying frontend, replace:

```text
https://your-frontend-url.com
```

with your real frontend URL.

---

## Frontend Deployment Steps

### 1. Deploy frontend

Recommended services:

```text
Vercel
Netlify
```

Frontend root directory:

```text
frontend
```

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

Output folder:

```text
build
```

---

### 2. Add frontend environment variable

```env
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

---

### 3. Rebuild frontend

After setting environment variables, rebuild and redeploy.

---

## Database Setup Notes

ArcDime uses these main tables:

```text
users
expenses
budgets
```

The backend uses SQLAlchemy models. In local development, tables can be created using:

```python
Base.metadata.create_all(bind=engine)
```

For production-level systems, a migration tool like Alembic is recommended.

---

## Manual SQL Migration Notes

If needed, run these SQL commands in production database.

### Add user ID to expenses

```sql
ALTER TABLE expenses
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);
```

### Add date of birth to users

```sql
ALTER TABLE users
ADD COLUMN IF NOT EXISTS dob VARCHAR;
```

### Create budgets table

```sql
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    monthly_limit FLOAT NOT NULL DEFAULT 0,
    category_limits JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_user_budget_month
ON budgets(user_id, year, month);
```

---

## Production Testing Checklist

After deployment, test:

```text
signup
login
auth/me
add expense
edit expense
delete expense
category suggestion
OCR scan
voice expense entry
monthly analytics
budget save
budget alerts
assistant
profile update
password change
CSV export
monthly report download
logout
```

---

## Common Deployment Issues

### CORS Error

Cause:

```text
Frontend URL is not added in backend CORS origins.
```

Fix:

```python
origins = [
    "http://localhost:3000",
    "https://your-frontend-url.com"
]
```

---

### 401 Unauthorized

Possible causes:

```text
JWT token missing
JWT expired
Authorization header not sent
SECRET_KEY changed after token was generated
```

Fix:

```text
Login again.
Check frontend API interceptor.
Check backend SECRET_KEY.
```

---

### Database Connection Error

Possible causes:

```text
Wrong DATABASE_URL
Database not publicly accessible
SSL requirement issue
```

Fix:

```text
Check hosted database URL.
Check platform database settings.
```

---

### Gemini Quota Error

Possible cause:

```text
Gemini API free quota exhausted.
```

Expected behavior:

```text
ArcDime falls back to built-in rule-based analysis.
```

---

### OCR Slow on Server

Cause:

```text
EasyOCR is CPU-heavy.
```

Expected behavior:

```text
OCR may be slower on free hosting plans.
```

Possible improvement:

```text
Move OCR to a separate service or use a lighter OCR API.
```

---

## Final Deployment Notes

Before sharing the deployed app:

```text
Use demo credentials if needed.
Do not expose private keys.
Avoid uploading sensitive real bills.
Test the assistant fallback.
Check mobile responsiveness.
```