function BudgetCard({ budgetStatus }) {
    if (!budgetStatus || !budgetStatus.has_budget) {
        return (
            <div className="budget-card">
                <p className="eyebrow">Budget</p>
                <h3>No budget set</h3>
                <span>Set a monthly budget from Settings to track progress.</span>
            </div>
        );
    }

    const usedPercentage = Math.min(budgetStatus.monthly_used_percentage || 0, 100);

    return (
        <div className="budget-card">
            <p className="eyebrow">Budget Progress</p>

            <div className="budget-row">
                <h3>₹{budgetStatus.monthly_spent.toFixed(2)}</h3>
                <span>of ₹{budgetStatus.monthly_limit.toFixed(2)}</span>
            </div>

            <div className="budget-track">
                <div
                    className={`budget-fill ${budgetStatus.is_monthly_over_budget ? "danger" : ""
                        }`}
                    style={{ width: `${usedPercentage}%` }}
                />
            </div>

            <p className="budget-note">
                {budgetStatus.is_monthly_over_budget
                    ? `Over budget by ₹${Math.abs(budgetStatus.monthly_remaining).toFixed(2)}`
                    : `Remaining ₹${budgetStatus.monthly_remaining.toFixed(2)}`}
            </p>
        </div>
    );
}

export default BudgetCard;