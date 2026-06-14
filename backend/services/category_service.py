def suggest_expense_category(text: str):
    cleaned_text = text.lower()

    category_keywords = {
        "Food": [
            "swiggy", "zomato", "restaurant", "cafe", "coffee", "tea",
            "pizza", "burger", "dinner", "lunch", "breakfast", "snacks",
            "food", "meal", "biryani", "dominos", "kfc", "mcdonald"
        ],
        "Travel": [
            "uber", "ola", "rapido", "auto", "cab", "taxi", "bus",
            "train", "metro", "flight", "petrol", "fuel", "diesel",
            "parking", "toll", "ride"
        ],
        "Shopping": [
            "amazon", "flipkart", "myntra", "ajio", "clothes", "dress",
            "shoes", "bag", "watch", "shopping", "order", "fashion"
        ],
        "Groceries": [
            "grocery", "groceries", "supermarket", "dmart", "reliance fresh",
            "vegetables", "fruits", "milk", "bread", "rice", "atta",
            "dal", "oil", "eggs"
        ],
        "Bills": [
            "electricity", "water bill", "wifi", "internet", "mobile recharge",
            "recharge", "rent", "gas", "bill", "subscription", "netflix",
            "spotify", "prime"
        ],
        "Entertainment": [
            "movie", "cinema", "bookmyshow", "concert", "game", "gaming",
            "outing", "party", "club", "ott"
        ],
        "Healthcare": [
            "medicine", "medical", "doctor", "hospital", "clinic",
            "pharmacy", "apollo pharmacy", "health", "checkup", "tablet"
        ],
    }

    best_category = "Other"
    matched_keywords = []

    for category, keywords in category_keywords.items():
        matches = [keyword for keyword in keywords if keyword in cleaned_text]

        if len(matches) > len(matched_keywords):
            best_category = category
            matched_keywords = matches

    if len(matched_keywords) >= 2:
        confidence = "high"
    elif len(matched_keywords) == 1:
        confidence = "medium"
    else:
        confidence = "low"

    return {
        "suggested_category": best_category,
        "confidence": confidence,
        "matched_keywords": matched_keywords
    }