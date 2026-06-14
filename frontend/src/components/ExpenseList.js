import EmptyState from "./EmptyState";

function ExpenseList({ expenses, handleEditExpense, handleDeleteExpense, title = "Recent Expenses" }) {
    return (
        <section className="panel expenses-panel">
            <h3>{title}</h3>

            {expenses.length === 0 ? (
                <EmptyState
                    title="No expenses yet"
                    message="Start by adding your first expense manually, through bill scan, or voice entry."
                />
            ) : (
                <div className="expense-list">
                    {expenses.map((expense) => (
                        <div className="expense-item" key={expense.id}>
                            <div>
                                <h4>{expense.category}</h4>
                                <p>
                                    {expense.merchant || "Unknown merchant"} • {expense.expense_date} •{" "}
                                    <span className={`source-pill ${expense.source_type}`}>
                                        {expense.source_type}
                                    </span>
                                </p>

                                {expense.description && (
                                    <p className="description">{expense.description}</p>
                                )}
                            </div>

                            <div className="expense-right">
                                <strong>₹{expense.amount}</strong>

                                <div className="action-row">
                                    <button
                                        onClick={() => handleEditExpense(expense)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDeleteExpense(expense.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default ExpenseList;