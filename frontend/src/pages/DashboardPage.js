import MonthFilter from "../components/MonthFilter";
import SummaryCards from "../components/SummaryCards";
import CategoryChart from "../components/CategoryChart";
import ExpenseList from "../components/ExpenseList";
import BudgetCard from "../components/BudgetCard";

function DashboardPage({
    analytics,
    expenses,
    categoryColors,
    selectedYear,
    selectedMonth,
    setSelectedYear,
    setSelectedMonth,
    onEditExpense,
    onDeleteExpense,
    isRefreshingData,
}) {
    const recentExpenses = expenses.slice(0, 4);

    return (
        <>
            <section className="dashboard-greeting">
                <p>Good morning, Diya ✦</p>
            </section>

            <MonthFilter
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                setSelectedMonth={setSelectedMonth}
                setSelectedYear={setSelectedYear}
            />

            {isRefreshingData && (
                <div className="inline-loading">
                    Refreshing your spending data...
                </div>
            )}

            <section className="dashboard-overview-grid">
                <div className="dashboard-left-stack">
                    <BudgetCard budgetStatus={analytics.budget_status} />
                    <SummaryCards analytics={analytics} layout="vertical" />
                </div>

                <CategoryChart
                    analytics={analytics}
                    categoryColors={categoryColors}
                />
            </section>

            <ExpenseList
                expenses={recentExpenses}
                onEditExpense={onEditExpense}
                onDeleteExpense={onDeleteExpense}
            />
        </>
    );
}

export default DashboardPage;