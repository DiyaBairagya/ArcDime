import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function DailyTimeline({ dailyBreakdown }) {
    return (
        <section className="panel">
            <h3>Daily Spending Timeline</h3>

            {dailyBreakdown.length === 0 ? (
                <p className="empty-state">No daily spending data for this month.</p>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={dailyBreakdown}>
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Bar dataKey="amount" fill="#7B5EA7" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </section>
    );
}

export default DailyTimeline;