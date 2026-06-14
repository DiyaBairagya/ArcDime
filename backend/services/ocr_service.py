import re
import easyocr
from datetime import date, datetime

from services.category_service import suggest_expense_category

ocr_reader = easyocr.Reader(["en"], gpu=False)


def extract_amount_from_text(text: str):
    lines = text.split("\n")

    amount_patterns = [
        r"(?:total|grand total|amount|net amount|bill amount|payable)[:\s₹Rs.]*([0-9]+(?:\.[0-9]{1,2})?)",
        r"₹\s*([0-9]+(?:\.[0-9]{1,2})?)",
        r"Rs\.?\s*([0-9]+(?:\.[0-9]{1,2})?)",
    ]

    possible_amounts = []

    for line in lines:
        lower_line = line.lower()

        for pattern in amount_patterns:
            matches = re.findall(pattern, lower_line, re.IGNORECASE)
            for match in matches:
                try:
                    possible_amounts.append(float(match))
                except ValueError:
                    pass

    if possible_amounts:
        return max(possible_amounts)

    fallback_numbers = re.findall(r"\b[0-9]+(?:\.[0-9]{1,2})?\b", text)

    cleaned_numbers = []

    for num in fallback_numbers:
        try:
            value = float(num)
            if 1 <= value <= 100000:
                cleaned_numbers.append(value)
        except ValueError:
            pass

    if cleaned_numbers:
        return max(cleaned_numbers)

    return None


def extract_date_from_text(text: str):
    date_patterns = [
        r"\b(\d{2}[-/]\d{2}[-/]\d{4})\b",
        r"\b(\d{2}[-/]\d{2}[-/]\d{2})\b",
        r"\b(\d{4}[-/]\d{2}[-/]\d{2})\b",
    ]

    for pattern in date_patterns:
        match = re.search(pattern, text)

        if match:
            raw_date = match.group(1)

            possible_formats = [
                "%d/%m/%Y",
                "%d-%m-%Y",
                "%d/%m/%y",
                "%d-%m-%y",
                "%Y/%m/%d",
                "%Y-%m-%d",
            ]

            for fmt in possible_formats:
                try:
                    parsed_date = datetime.strptime(raw_date, fmt).date()
                    return str(parsed_date)
                except ValueError:
                    continue

    return str(date.today())


def extract_merchant_from_text(text: str):
    lines = [line.strip() for line in text.split("\n") if line.strip()]

    ignore_keywords = [
        "invoice", "receipt", "tax", "gst", "total", "amount", "date",
        "cash", "card", "upi", "payment", "qty", "quantity", "price",
        "subtotal", "discount"
    ]

    for line in lines[:5]:
        lower_line = line.lower()

        if not any(keyword in lower_line for keyword in ignore_keywords):
            if len(line) >= 3:
                return line[:60]

    if lines:
        return lines[0][:60]

    return "Unknown Merchant"


def parse_expense_from_ocr_text(text: str):
    amount = extract_amount_from_text(text)
    expense_date = extract_date_from_text(text)
    merchant = extract_merchant_from_text(text)

    category_result = suggest_expense_category(text)

    return {
        "amount": amount,
        "merchant": merchant,
        "expense_date": expense_date,
        "category": category_result["suggested_category"],
        "confidence": category_result["confidence"],
        "matched_keywords": category_result["matched_keywords"],
        "description": "Extracted from bill image",
        "source_type": "ocr"
    }


def extract_text_from_image(file_path: str):
    ocr_results = ocr_reader.readtext(file_path)
    extracted_lines = [result[1] for result in ocr_results]
    extracted_text = "\n".join(extracted_lines)

    return extracted_text, extracted_lines