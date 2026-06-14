const getIntentLabel = (intent) => {
    const labels = {
        llm_sql_rag: "AI Analysis",
        llm_quota_fallback: "Fallback",

        total_spending: "Total Spending",
        highest_category: "Highest Category",
        category_breakdown: "Category Breakdown",
        summary: "Summary",
        average_expense: "Average",
        alerts: "Alerts",
        financial_health_score: "Health Score",
        no_data: "No Data",
        fallback: "Guide",

        scenario_extra_spending: "What-if",
        scenario_reduce_category: "What-if",
        scenario_stay_under_budget: "Budget Check",
        scenario_save_percentage_vs_previous_month: "Savings Target",

        scenario_extra_spending_fallback: "What-if",
        scenario_reduce_category_fallback: "What-if",
        scenario_stay_under_budget_fallback: "Budget Check",
        scenario_save_percentage_vs_previous_month_fallback: "Savings Target",
    };

    return labels[intent] || intent;
};

function AssistantPanel({
    assistantQuestion,
    setAssistantQuestion,
    assistantMessages,
    isAssistantLoading,
    handleAskAssistant,
}) {
    return (
        <section className="panel assistant-panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Expense Explanation Chat</p>
                    <h3>ArcDime Assistant</h3>
                </div>
            </div>

            <div className="assistant-chat-box">
                <div className="assistant-messages">
                    {assistantMessages.map((message, index) => (
                        <div key={index} className={`assistant-message ${message.role}`}>
                            <p>{message.text}</p>
                            {/* {message.intent && <span className="intent-pill">{getIntentLabel(message.intent)}</span>} */}
                        </div>
                    ))}

                    {isAssistantLoading && (
                        <div className="assistant-message assistant">
                            <p>Thinking about your expenses...</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleAskAssistant} className="assistant-form">
                    <input
                        type="text"
                        value={assistantQuestion}
                        onChange={(event) => setAssistantQuestion(event.target.value)}
                        placeholder="Ask: Where did I spend the most this month?"
                    />

                    <button type="submit" className="primary-btn">
                        Ask
                    </button>
                </form>
            </div>

            <div className="question-suggestions">
                <button
                    type="button"
                    onClick={() => setAssistantQuestion("Give me a summary of this month")}
                >
                    Monthly summary
                </button>

                <button
                    type="button"
                    onClick={() => setAssistantQuestion("Where did I spend the most?")}
                >
                    Highest category
                </button>

                <button
                    type="button"
                    onClick={() => setAssistantQuestion("Can I stay under ₹10000 this month?")}
                >
                    Budget check
                </button>

                <button
                    type="button"
                    onClick={() => setAssistantQuestion("What if I spend ₹2000 more this month?")}
                >
                    What-if spend
                </button>

                <button
                    type="button"
                    onClick={() => setAssistantQuestion("How much should I save to spend 15% less than last month?")}
                >
                    Savings target
                </button>
            </div>
        </section>
    );
}

export default AssistantPanel;