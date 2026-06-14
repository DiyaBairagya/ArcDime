function InsightsSection({ insights, alerts }) {
    return (
        <section className="insights-grid">
            <div className="panel">
                <h3>Smart Insights</h3>

                {insights.length === 0 ? (
                    <p className="empty-state">No insights yet.</p>
                ) : (
                    <div className="insight-list">
                        {insights.map((insight, index) => (
                            <div className="insight-card" key={index}>
                                <span>✨</span>
                                <p>{insight}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="panel">
                <h3>Alerts & Warnings</h3>

                {alerts.length === 0 ? (
                    <div className="success-card">
                        <span>✓</span>
                        <p>No major spending alerts for this month.</p>
                    </div>
                ) : (
                    <div className="insight-list">
                        {alerts.map((alert, index) => (
                            <div className="alert-card" key={index}>
                                <span>!</span>
                                <p>{alert}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default InsightsSection;