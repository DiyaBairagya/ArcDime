from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routes import expenses, analytics, ai, ocr, voice, assistant, auth, budgets

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ArcDime API",
    description="AI-powered expense intelligence backend",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(budgets.router)

@app.get("/")
def home():
    return {
        "message": "ArcDime API is running",
        "tagline": "Because Every Dime Matters."
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ArcDime Backend"
    }


app.include_router(expenses.router)
app.include_router(analytics.router)
app.include_router(ai.router)
app.include_router(ocr.router)
app.include_router(voice.router)
app.include_router(assistant.router)
app.include_router(auth.router)