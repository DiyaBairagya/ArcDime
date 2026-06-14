function ExpenseForm({
    formData,
    editingExpenseId,
    categorySuggestion,
    isSuggestingCategory,
    handleChange,
    handleSubmitExpense,
    handleSuggestCategory,
    handleCancelEdit,
}) {
    return (
        <div className="panel">
            <h3>{editingExpenseId ? "Edit Expense" : "Add Expense"}</h3>

            <form onSubmit={handleSubmitExpense} className="expense-form">
                <label>
                    Amount
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        required
                    />
                </label>

                <label>
                    Category
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option>Food</option>
                        <option>Travel</option>
                        <option>Shopping</option>
                        <option>Groceries</option>
                        <option>Bills</option>
                        <option>Entertainment</option>
                        <option>Healthcare</option>
                        <option>Other</option>
                    </select>
                </label>

                <label>
                    Merchant
                    <input
                        type="text"
                        name="merchant"
                        value={formData.merchant}
                        onChange={handleChange}
                        placeholder="Example: Cafe, Amazon"
                    />
                </label>

                <label>
                    Description
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Example: Evening snacks"
                    />
                </label>

                <button
                    type="button"
                    className="suggest-btn"
                    onClick={handleSuggestCategory}
                    disabled={isSuggestingCategory}
                >
                    {isSuggestingCategory ? "Suggesting..." : "Suggest Category"}
                </button>

                {categorySuggestion && (
                    <div className="suggestion-box">
                        <p>
                            Suggested: <strong>{categorySuggestion.suggested_category}</strong>
                        </p>
                        <span>
                            Confidence: {categorySuggestion.confidence}
                            {categorySuggestion.matched_keywords.length > 0 &&
                                ` • Matched: ${categorySuggestion.matched_keywords.join(", ")}`}
                        </span>
                    </div>
                )}

                <label>
                    Date
                    <input
                        type="date"
                        name="expense_date"
                        value={formData.expense_date}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="primary-btn">
                    {editingExpenseId ? "Update Expense" : "Add Expense"}
                </button>

                {editingExpenseId && (
                    <button type="button" className="secondary-btn" onClick={handleCancelEdit}>
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
}

export default ExpenseForm;