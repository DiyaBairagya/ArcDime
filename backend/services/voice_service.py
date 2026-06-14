import re
from datetime import date, timedelta

from services.category_service import suggest_expense_category


def parse_voice_expense_text(text: str):
    cleaned_text = text.lower()

    amount = None

    amount_patterns = [
        r"(?:spent|paid|pay|gave|used|expense|cost)\s*(?:rs\.?|rupees|₹)?\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"([0-9]+(?:\.[0-9]{1,2})?)\s*(?:rs\.?|rupees|₹)",
        r"₹\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"\b([0-9]+(?:\.[0-9]{1,2})?)\b",
    ]

    for pattern in amount_patterns:
        match = re.search(pattern, cleaned_text, re.IGNORECASE)
        if match:
            try:
                amount = float(match.group(1))
                break
            except ValueError:
                pass

    expense_date = date.today()

    if "yesterday" in cleaned_text:
        expense_date = date.today() - timedelta(days=1)
    elif "today" in cleaned_text:
        expense_date = date.today()

    category_result = suggest_expense_category(text)

    merchant = None

    known_merchants = [
        "swiggy", "zomato", "uber", "ola", "rapido", "amazon", "flipkart",
        "myntra", "dmart", "netflix", "spotify", "apollo pharmacy"
    ]

    for item in known_merchants:
        if item in cleaned_text:
            merchant = item.title()
            break

    return {
        "amount": amount,
        "category": category_result["suggested_category"],
        "merchant": merchant,
        "description": text,
        "expense_date": str(expense_date),
        "confidence": category_result["confidence"],
        "matched_keywords": category_result["matched_keywords"],
        "source_type": "voice"
    }