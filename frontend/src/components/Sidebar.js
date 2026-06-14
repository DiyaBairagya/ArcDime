import { NavLink } from "react-router-dom";

function Sidebar({ currentUser, onLogout }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand-row">
                <div>
                    <h1>ArcDime</h1>
                    <p>Because Every Dime Matters.</p>
                </div>

                <div className="mobile-avatar">D</div>
            </div>

            <nav>
                <span className="nav-label">Main</span>

                <NavLink to="/" end>
                    Dashboard
                </NavLink>

                <NavLink to="/expenses">
                    Expenses
                </NavLink>

                <NavLink to="/add-expense">
                    Add Expense
                </NavLink>

                <span className="nav-label">Intelligence</span>

                <NavLink to="/insights">
                    Insights
                </NavLink>

                <NavLink to="/assistant">
                    Assistant <span className="ai-pill">AI</span>
                </NavLink>

                <span className="nav-divider"></span>

                <NavLink to="/settings">
                    Settings
                </NavLink>
            </nav>

            <div className="sidebar-profile">
                <div className="avatar">
                    {currentUser?.name?.[0]?.toUpperCase() || "U"}
                </div>

                <div>
                    <strong>{currentUser?.name || "User"}</strong>
                    <span>{currentUser?.email || "Logged in"}</span>
                </div>
            </div>

            <button className="logout-btn" onClick={onLogout}>
                Logout
            </button>
        </aside>
    );
}

export default Sidebar;