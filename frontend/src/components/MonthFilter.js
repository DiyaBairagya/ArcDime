function MonthFilter({ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }) {
    return (
        <section className="filter-row">
            <div>
                <p className="filter-label">Analyze month</p>

                <div className="filter-controls">
                    <select
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(Number(event.target.value))}
                    >
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>

                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(event) => setSelectedYear(Number(event.target.value))}
                    />
                </div>
            </div>
        </section>
    );
}

export default MonthFilter;