import MonthFilter from "../components/MonthFilter";
import InsightsSection from "../components/InsightsSection";
import DailyTimeline from "../components/DailyTimeline";
import CategoryChart from "../components/CategoryChart";

function InsightsPage({
    analytics,
    categoryColors,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
}) {
    const healthScore = analytics.financial_health_score || 0;

    return (
        <>
            <section className="page-header-card">
                <div>
                    <p className="eyebrow">AI-powered spending analysis</p>
                    <h3>Insights</h3>
                    <span>Understand your patterns, alerts, and financial health.</span>
                </div>
            </section>

            <MonthFilter
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
            />

            <section className="insight-metric-grid">
                <div className="summary-card">
                    <p>Financial Health Score</p>
                    <h3>{healthScore}/100</h3>
                    <div className="health-track">
                        <div className="health-fill" style={{ width: `${healthScore}%` }} />
                    </div>
                </div>

                <div className="summary-card gold-card">
                    <p>Highest Category</p>
                    <h3 className="small-heading">
                        {analytics.highest_category
                            ? `${analytics.highest_category.category} — ₹${analytics.highest_category.amount.toFixed(2)}`
                            : "No data yet"}
                    </h3>
                </div>

                <div className="summary-card">
                    <p>Total Spending</p>
                    <h3>₹{analytics.total_spending.toFixed(2)}</h3>
                </div>
            </section>

            <InsightsSection
                insights={analytics.insights}
                alerts={analytics.alerts}
            />

            <section className="content-grid">
                <CategoryChart analytics={analytics} categoryColors={categoryColors} />
                <DailyTimeline dailyBreakdown={analytics.daily_breakdown} />
            </section>
        </>
    );
}

export default InsightsPage;