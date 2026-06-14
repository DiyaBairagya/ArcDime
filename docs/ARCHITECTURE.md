# ArcDime Architecture Explanation

This document explains ArcDime in an interview-friendly way.

---

## What is ArcDime?

ArcDime is an AI-powered expense intelligence web application.

It helps users:

```text
track expenses
scan bills
add expenses using voice
set budgets
view analytics
generate reports
ask spending questions through an AI assistant
```

It is not just a CRUD expense tracker. It combines full-stack development, authentication, analytics, OCR, voice input, budgeting, and LLM-based explanation.

---

## Why did I build it?

I wanted to build a practical full-stack AI project that solves a real-world problem.

Most expense trackers only allow users to add and view expenses. ArcDime goes further by helping users understand their spending patterns, set budgets, ask questions, and run what-if scenarios.

---

## Tech Stack

### Frontend

```text
React
React Router
Axios
CSS
Browser Speech Recognition API
```

### Backend

```text
FastAPI
SQLAlchemy
Pydantic
PostgreSQL
JWT Authentication
EasyOCR
Gemini API
```

### Database

```text
PostgreSQL
```

---

## Main Features

```text
User authentication
Manual expense tracking
OCR bill scanning
Voice expense entry
Smart category suggestion
Monthly analytics
Category-wise breakdown
Daily spending timeline
Budget tracking
Category-wise limits
Budget alerts
Financial health score
AI assistant
What-if financial planning
CSV export
Monthly report generation
Profile update
Password change
```

---

## System Flow

```text
User logs in
↓
JWT token is stored on frontend
↓
Frontend sends authenticated API requests
↓
FastAPI validates the token
↓
Expense data is stored with user_id in PostgreSQL
↓
Analytics are calculated from user-specific expenses
↓
Assistant uses structured analytics context
↓
Python performs deterministic calculations
↓
LLM explains the result
```

---

## Authentication Flow

ArcDime uses JWT authentication.

Flow:

```text
User signs up or logs in
↓
Backend verifies credentials
↓
Backend generates JWT token
↓
Frontend stores token in localStorage
↓
Axios interceptor attaches token to protected requests
↓
Backend extracts current user from token
↓
Routes return only that user's data
```

This ensures that one user cannot access another user's expenses.

---

## Expense Flow

Users can create expenses in three ways:

```text
manual entry
bill scanner
voice input
```

Each expense stores:

```text
amount
category
merchant
description
expense_date
source_type
user_id
```

The `source_type` can be:

```text
manual
smart
ocr
voice
```

---

## OCR Flow

```text
User uploads bill image
↓
Frontend sends image as multipart form data
↓
FastAPI receives image
↓
EasyOCR extracts text
↓
Backend parses amount, merchant, date, and category
↓
Frontend shows detected result
↓
User confirms and saves expense
```

This reduces manual typing for bill-based expenses.

---

## Voice Entry Flow

```text
User clicks voice entry
↓
Browser Speech Recognition captures speech
↓
Transcript is sent to FastAPI
↓
Backend parses amount, category, date, and description
↓
Frontend displays detected expense
↓
User verifies and saves it
```

Example:

```text
Spent 450 rupees on groceries today
```

Output:

```text
amount = 450
category = Groceries
description = Spent 450 rupees on groceries today
```

---

## Analytics Flow

For a selected month and year, backend calculates:

```text
total spending
total number of expenses
category breakdown
daily breakdown
highest category
insights
alerts
financial health score
budget status
```

The dashboard displays these analytics in a visual format.

---

## Budget System

Users can set:

```text
monthly budget
category-wise budget
```

The backend calculates:

```text
monthly spending progress
remaining budget
used percentage
over-budget status
category-wise budget status
budget alerts
```

This makes ArcDime more useful than a normal expense tracker because it supports planning, not just tracking.

---

## AI Assistant Flow

The assistant answers spending-related questions.

Flow:

```text
User asks a question
↓
Backend identifies authenticated user
↓
Backend retrieves selected month analytics
↓
Analytics are converted into structured context
↓
Gemini generates an explanation
↓
If Gemini fails or quota is exhausted, fallback logic responds
```

Example questions:

```text
Where did I spend the most this month?
Give me a summary of this month.
Can I stay under ₹10000 this month?
Tell me a wise plan to save budget.
```

---

## What-if Scenario Planner

ArcDime supports what-if financial planning.

Example questions:

```text
What if I spend ₹2000 more this month?
What if I reduce Food spending by ₹1000?
Can I stay under ₹10000 this month?
How much should I save to spend 15% less than last month?
```

Flow:

```text
User asks scenario question
↓
Backend detects scenario intent
↓
Backend extracts amount or percentage
↓
Python calculates projected spending or savings target
↓
LLM explains the result
↓
Fallback explanation is used if LLM fails
```

---

## Why not let the LLM calculate?

Financial calculations need accuracy.

So ArcDime does not depend on the LLM for exact calculations. Instead:

```text
Python performs exact calculations
LLM explains the calculated result
```

This avoids hallucinated or incorrect financial math.

This is one of the strongest design decisions in the project.

---

## Error Handling and Fallbacks

ArcDime includes fallback logic.

Examples:

```text
If Gemini quota is exhausted → rule-based assistant response
If OCR fails → frontend shows toast error
If voice parsing fails → frontend shows toast error
If budget is missing → budget card shows empty state
If no expenses exist → empty state is displayed
```

This improves reliability and user experience.

---

## Export Features

ArcDime supports:

```text
CSV export
Monthly text report download
```

The monthly report includes:

```text
total spending
total expenses
financial health score
budget summary
category breakdown
alerts
expense entries
```

---

## Challenges Faced

```text
Structuring backend into routes and services
Making expenses user-specific with JWT
Handling OCR parsing from noisy bill text
Building fallback logic when Gemini quota is exhausted
Preventing LLM hallucination in financial calculations
Making dashboard responsive and clean
Adding budget-aware analytics
Managing frontend state across multiple pages
```

---

## What I Learned

```text
Full-stack architecture
FastAPI route and service design
JWT authentication
PostgreSQL schema design
React routing and component structure
OCR integration
Voice input integration
LLM context grounding
Deterministic scenario calculation
Budget analytics
UI polish and product thinking
```

---

## How I Would Improve It Further

```text
Deploy using Vercel, Render, and Neon
Add recurring expenses
Add email report summaries
Add chart-based PDF export
Add Alembic database migrations
Add role-based admin support
Improve OCR accuracy using a dedicated OCR API
Add spending prediction using time-series forecasting
Add automated budget recommendations
```

---

## 60-Second Interview Explanation

ArcDime is an AI-powered expense intelligence web app that I built using React, FastAPI, and PostgreSQL. Users can track expenses manually, scan bills with OCR, or add expenses using voice input. The app also supports monthly budgets, category-wise limits, analytics, alerts, CSV export, and monthly reports.

The AI assistant is grounded on user-specific PostgreSQL data. It answers questions like where the user spent the most or whether they can stay under budget. For what-if financial planning, I made sure Python performs the exact calculations and the LLM only explains the result. This makes the system safer and avoids hallucinated financial math.

The project helped me practice full-stack development, authentication, database design, OCR, voice input, analytics, and LLM integration in one complete product.