function SummaryCards({ analytics, layout = "grid" }) {
    const highestCategoryText = analytics.highest_category
        ? `${analytics.highest_category.category} — ₹${analytics.highest_category.amount.toFixed(
            2
        )}`
        : "No data yet";

    const healthScore = analytics.financial_health_score || 0;

    return (
        <section
            className={
                layout === "vertical"
                    ? "summary-stack"
                    : "summary-grid four-grid"
            }
        >
            <div className="summary-card">
                <p>Monthly Spending</p>
                <h3>₹{analytics.total_spending.toFixed(2)}</h3>
            </div>

            <div className="summary-card">
                <p>Total Expenses</p>
                <h3>{analytics.total_expenses}</h3>
            </div>

            <div className="summary-card gold-card">
                <p>Highest Category</p>
                <h3 className="small-heading">{highestCategoryText}</h3>
            </div>

            <div className="summary-card health-card">
                <p>Financial Health Score</p>
                <h3>{healthScore}/100</h3>

                <div className="health-track">
                    <div
                        className="health-fill"
                        style={{ width: `${healthScore}%` }}
                    />
                </div>
            </div>
        </section>
    );
}

export default SummaryCards;