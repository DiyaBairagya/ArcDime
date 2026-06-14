# ArcDime — Because Every Dime Matters

ArcDime is an AI-powered expense intelligence web application that helps users track expenses, scan bills, add expenses using voice, set budgets, generate insights, export reports, and ask financial questions through an AI assistant.

---

## Overview

ArcDime is designed as a full-stack personal finance assistant.

It allows users to manage daily expenses, understand monthly spending patterns, monitor budgets, and get AI-powered explanations using authenticated user-specific data.

The project combines traditional expense tracking with AI features such as OCR-based bill scanning, voice expense entry, smart category suggestion, SQL-grounded assistant responses, and deterministic what-if financial planning.

---

## Key Features

- User authentication with JWT
- User-specific expense tracking
- Manual expense entry
- Smart category suggestion
- OCR bill scanning
- Voice-based expense entry
- Monthly analytics dashboard
- Category-wise spending breakdown
- Daily spending timeline
- Financial health score
- Monthly and category-wise budgets
- Budget alerts and progress tracking
- AI assistant using SQL-grounded expense context
- What-if scenario planner
- CSV export
- Monthly report download
- Editable profile details
- Password change
- Toast notifications and empty states
- Responsive dashboard UI

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- CSS
- Browser Speech Recognition API

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic
- EasyOCR
- Gemini API

### Database

- PostgreSQL

---

## AI Features

ArcDime includes multiple AI-assisted workflows.

### Smart Category Suggestion

The backend suggests expense categories based on merchant and description text.

Example:

```text
Swiggy dinner order → Food
Uber ride → Travel
Electricity bill → Bills
```

### OCR Bill Scanner

Users can upload a bill image. The backend extracts text using OCR and parses:

- amount
- merchant
- date
- category
- description

The extracted result can be used to auto-fill the expense form.

### Voice Expense Entry

Users can speak an expense, and the app parses the voice transcript into structured expense data.

Example:

```text
Spent 450 rupees on groceries today
```

Output:

```json
{
  "amount": 450,
  "category": "Groceries",
  "description": "Spent 450 rupees on groceries today"
}
```

### AI Assistant

The assistant answers questions using the user's authenticated monthly expense data.

Example questions:

```text
Where did I spend the most this month?
Give me a summary of this month.
Can I stay under ₹10000 this month?
Tell me a wise plan to save budget.
```

### What-if Scenario Planner

ArcDime supports financial scenario questions like:

```text
What if I spend ₹2000 more this month?
What if I reduce Food spending by ₹1000?
Can I stay under ₹10000 this month?
How much should I save to spend 15% less than last month?
```

The calculations are performed deterministically in Python. The LLM is only used to explain the calculated result, reducing the risk of incorrect financial math.

---

## Project Architecture

```text
ArcDime
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── utils
│   │   ├── api.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
│
├── backend
│   ├── routes
│   ├── services
│   ├── uploads
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── .env.example
│
├── docs
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── PROJECT_SUMMARY.md
│   └── ARCHITECTURE.md
│
├── README.md
└── .gitignore
```

---

## Backend Structure

```text
backend/
├── main.py
├── database.py
├── models.py
├── schemas.py
├── routes/
│   ├── auth.py
│   ├── expenses.py
│   ├── analytics.py
│   ├── ai.py
│   ├── ocr.py
│   ├── voice.py
│   ├── assistant.py
│   └── budgets.py
└── services/
    ├── auth_service.py
    ├── category_service.py
    ├── analytics_service.py
    ├── ocr_service.py
    ├── voice_service.py
    ├── assistant_service.py
    ├── scenario_service.py
    ├── budget_service.py
    └── llm_service.py
```

---

## Frontend Structure

```text
frontend/src/
├── api.js
├── App.js
├── App.css
├── components/
│   ├── Sidebar.js
│   ├── Topbar.js
│   ├── MonthFilter.js
│   ├── SummaryCards.js
│   ├── BudgetCard.js
│   ├── ExpenseForm.js
│   ├── ExpenseList.js
│   ├── CategoryChart.js
│   ├── DailyTimeline.js
│   ├── InsightsSection.js
│   ├── OcrPanel.js
│   ├── VoicePanel.js
│   ├── AssistantPanel.js
│   ├── Toast.js
│   └── EmptyState.js
├── pages/
│   ├── DashboardPage.js
│   ├── ExpensesPage.js
│   ├── AddExpensePage.js
│   ├── InsightsPage.js
│   ├── AssistantPage.js
│   ├── SettingsPage.js
│   ├── LoginPage.js
│   └── SignupPage.js
└── utils/
    └── exportUtils.js
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file using `.env.example`.

Run the backend:

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Use this format:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/arcdime

SECRET_KEY=replace_with_a_long_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend

Create:

```text
frontend/.env
```

Use this format:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| GET | `/` | Backend health message |
| GET | `/health` | Health check |
| POST | `/auth/signup` | Create user account |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update profile |
| PUT | `/auth/change-password` | Change password |
| GET | `/expenses` | Get user expenses |
| POST | `/expenses` | Add expense |
| PUT | `/expenses/{id}` | Update expense |
| DELETE | `/expenses/{id}` | Delete expense |
| GET | `/analytics/monthly` | Monthly analytics |
| POST | `/ai/suggest-category` | Suggest category |
| POST | `/ocr/extract-text` | Extract text from bill image |
| POST | `/ocr/parse-expense` | Parse OCR text |
| POST | `/voice/parse-expense` | Parse voice text |
| POST | `/assistant/ask` | Ask assistant |
| GET | `/budgets/monthly` | Get monthly budget |
| PUT | `/budgets/monthly` | Save monthly budget |

---

## Database Tables

ArcDime uses PostgreSQL with the following main tables:

```text
users
expenses
budgets
```

### Users

Stores user account details.

Main fields:

```text
id
name
email
dob
hashed_password
created_at
```

### Expenses

Stores user-specific expense records.

Main fields:

```text
id
amount
category
merchant
description
expense_date
source_type
user_id
```

### Budgets

Stores monthly and category-wise budget limits.

Main fields:

```text
id
user_id
year
month
monthly_limit
category_limits
created_at
updated_at
```

---

## Security Notes

- JWT authentication is used for protected routes.
- User-specific expenses are filtered by authenticated user ID.
- Passwords are hashed using bcrypt.
- Sensitive keys are stored in `.env`.
- The real `.env` file is excluded from GitHub.
- The frontend sends the JWT token using the Authorization header.

---

## Export Features

ArcDime supports:

```text
CSV export
Monthly text report download
```

The monthly report includes:

- total spending
- total expenses
- financial health score
- budget summary
- category breakdown
- alerts
- expense entries

---

## Deployment Plan

Recommended deployment:

```text
Frontend: Vercel or Netlify
Backend: Render or Railway
Database: Neon or Supabase PostgreSQL
```

Before deployment:

- Set production environment variables
- Update frontend API base URL
- Update backend CORS origins
- Use a strong `SECRET_KEY`
- Use a hosted PostgreSQL database
- Do not commit `.env`
- Test authentication, expenses, budgets, assistant, OCR, voice, and exports

---

## Important Design Decision

ArcDime does not rely on the LLM for exact financial calculations.

All important calculations, such as budget usage, savings targets, and what-if scenarios, are calculated in Python. The LLM is only used to explain the already-computed result.

This makes the assistant more reliable and reduces the risk of hallucinated financial math.

---

## Example Assistant Questions

```text
Give me a summary of this month.
Where did I spend the most?
Can I stay under ₹10000 this month?
What if I spend ₹2000 more this month?
What if I reduce Food spending by ₹100?
How much should I save to spend 15% less than last month?
Tell me a wise plan to save budget.
```

---

## Project Status

ArcDime is currently a full-stack portfolio project with local development support and deployment-ready structure.

---

## Author

Diya Bairagya