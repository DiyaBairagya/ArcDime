import ExpenseList from "../components/ExpenseList";

function ExpensesPage({
    expenses,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    sourceFilter,
    setSourceFilter,
    handleEditExpense,
    handleDeleteExpense,
}) {
    const filteredExpenses = expenses.filter((expense) => {
        const searchText = `${expense.category} ${expense.merchant || ""} ${expense.description || ""
            }`.toLowerCase();

        const matchesSearch = searchText.includes(searchTerm.toLowerCase());

        const matchesCategory =
            categoryFilter === "All" || expense.category === categoryFilter;

        const matchesSource =
            sourceFilter === "All" || expense.source_type === sourceFilter;

        return matchesSearch && matchesCategory && matchesSource;
    });

    return (
        <>
            <section className="page-header-card">
                <div>
                    <p className="eyebrow">Expense Records</p>
                    <h3>Manage Expenses</h3>
                    <span>{filteredExpenses.length} matching transactions</span>
                </div>
            </section>

            <section className="filters-card">
                <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

                <select
                    value={categoryFilter}
                    onChange={(event) => setCategoryFilter(event.target.value)}
                >
                    <option>All</option>
                    <option>Food</option>
                    <option>Travel</option>
                    <option>Shopping</option>
                    <option>Groceries</option>
                    <option>Bills</option>
                    <option>Entertainment</option>
                    <option>Healthcare</option>
                    <option>Other</option>
                </select>

                <select
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value)}
                >
                    <option>All</option>
                    <option>manual</option>
                    <option>smart</option>
                    <option>ocr</option>
                    <option>voice</option>
                </select>
            </section>

            <ExpenseList
                expenses={filteredExpenses}
                handleEditExpense={handleEditExpense}
                handleDeleteExpense={handleDeleteExpense}
                title="All Expenses"
            />
        </>
    );
}

export default ExpensesPage;