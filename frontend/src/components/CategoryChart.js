import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function CategoryChart({ analytics, categoryColors }) {
    return (
        <div className="panel">
            <h3>Category Breakdown</h3>

            {analytics.category_breakdown.length === 0 ? (
                <p className="empty-state">No analytics available for this month.</p>
            ) : (
                <div className="chart-wrap">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={analytics.category_breakdown}
                                dataKey="amount"
                                nameKey="category"
                                innerRadius={55}
                                outerRadius={90}
                                paddingAngle={4}
                            >
                                {analytics.category_breakdown.map((entry, index) => (
                                    <Cell
                                        key={entry.category}
                                        fill={categoryColors[index % categoryColors.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value}`} />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="category-list">
                        {analytics.category_breakdown.map((item, index) => (
                            <div className="category-row" key={item.category}>
                                <span
                                    className="category-dot"
                                    style={{
                                        background: categoryColors[index % categoryColors.length],
                                    }}
                                />
                                <span>{item.category}</span>
                                <strong>₹{item.amount.toFixed(2)}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryChart;