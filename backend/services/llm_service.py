import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def generate_llm_answer(question: str, context: dict):
    if not GEMINI_API_KEY or client is None:
        print("GEMINI_API_KEY missing")
        return None

    prompt = f"""
You are ArcDime Assistant, an AI expense explanation assistant.

Your job:
Explain the user's spending data clearly using ONLY the provided context.

Strict rules:
- Do NOT invent numbers.
- Do NOT redo calculations if calculated results are already provided.
- Do NOT give investment, tax, legal, or loan advice.
- Do NOT say things like "based on the provided context" repeatedly.
- Keep answers short: 3 to 6 sentences max.
- Use Indian Rupee format like ₹450.
- If data is limited, mention that politely.
- Give practical spending guidance, not generic motivation.

User question:
{question}

Context:
{context}

Answer:
"""

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    return response.text.strip()