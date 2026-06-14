# ArcDime Project Summary

This file contains resume-ready points for ArcDime.

---

## One-Line Project Description

ArcDime is an AI-powered personal finance assistant that combines expense tracking, budget planning, OCR, voice input, and a SQL-grounded LLM assistant to help users understand and improve their spending habits.

---

## Short Resume Version

Built ArcDime, an AI-powered expense intelligence web app using React, FastAPI, PostgreSQL, JWT authentication, OCR, voice input, and Gemini-powered SQL-grounded assistant.

---

## Strong Resume Bullets

- Built a full-stack AI-powered expense intelligence platform using React, FastAPI, PostgreSQL, and JWT authentication, enabling users to track expenses, set budgets, and analyze monthly spending.

- Implemented OCR-based bill scanning using EasyOCR to extract merchant, amount, date, and category from receipt images and auto-fill structured expense forms.

- Developed a voice-based expense entry workflow using the browser Speech Recognition API and FastAPI parsing services to convert spoken expenses into structured records.

- Designed a SQL-grounded AI assistant that retrieves authenticated user-specific expense analytics from PostgreSQL and generates contextual explanations using Gemini.

- Built deterministic what-if financial scenario planning where Python performs exact budget and savings calculations while the LLM explains the computed result safely.

- Implemented budget-aware analytics including monthly budgets, category-wise limits, progress tracking, overspending alerts, and financial health score.

- Added production-focused features including profile management, password update, CSV export, monthly report generation, toast notifications, empty states, and responsive dashboard UI.

---

## ATS-Friendly Project Entry

### ArcDime — AI-Powered Expense Intelligence Web App

Built a full-stack personal finance assistant using React, FastAPI, PostgreSQL, SQLAlchemy, and JWT authentication. Implemented expense tracking, budget planning, OCR bill scanning, voice expense entry, smart category suggestion, analytics dashboard, CSV export, and monthly report generation. Integrated a Gemini-powered SQL-grounded assistant that answers spending questions using authenticated user-specific data. Designed deterministic Python-based what-if scenario calculations to avoid unreliable LLM-generated financial math.

---

## Resume Skills From This Project

```text
React
React Router
Axios
FastAPI
PostgreSQL
SQLAlchemy
Pydantic
JWT Authentication
Python
JavaScript
EasyOCR
Gemini API
REST APIs
OCR
Voice Input
Data Analytics
Budget Analytics
LLM Integration
SQL-grounded AI
```

---

## Interview Explanation

ArcDime is a full-stack expense intelligence system. The frontend is built with React and the backend uses FastAPI with PostgreSQL. Users can add expenses manually, scan bills with OCR, or use voice input. The backend stores user-specific data using JWT authentication.

The analytics layer calculates monthly spending, category breakdowns, daily trends, budget progress, alerts, and a financial health score. I also integrated an AI assistant that uses structured expense data from PostgreSQL as context. For financial scenario planning, I intentionally kept the calculations deterministic in Python and used the LLM only for explanation. This avoids relying on the LLM for exact financial math.

---

## Technical Highlight

The strongest technical part of ArcDime is the assistant architecture.

```text
User question
↓
JWT-authenticated user
↓
PostgreSQL expense data
↓
Python analytics/scenario calculation
↓
Structured context
↓
Gemini explanation
↓
Fallback response if LLM quota fails
```

This design makes the system more reliable because the backend controls data access and financial calculations.

---

## GitHub Description

AI-powered expense intelligence app with React, FastAPI, PostgreSQL, OCR bill scanning, voice expense entry, budgets, analytics, and SQL-grounded Gemini assistant.

---

## GitHub Topics

```text
react
fastapi
postgresql
expense-tracker
ai-assistant
ocr
jwt-authentication
gemini-api
personal-finance
full-stack
```

---

## LinkedIn Post Draft

I built ArcDime — an AI-powered expense intelligence web app.

ArcDime helps users track expenses, scan bills, add expenses using voice, set monthly/category budgets, generate insights, and ask spending-related questions through an AI assistant.

What makes it interesting:

- OCR-based bill scanning
- Voice expense entry
- JWT-authenticated user-specific data
- Budget-aware analytics
- Financial health score
- SQL-grounded AI assistant
- What-if scenario planning

One design decision I focused on was not letting the LLM perform financial calculations directly. All exact calculations are done in Python, and the LLM only explains the computed result using structured context.

Tech stack:

React, FastAPI, PostgreSQL, SQLAlchemy, JWT, EasyOCR, Gemini API

This project helped me understand how to combine full-stack engineering with AI in a practical product workflow.