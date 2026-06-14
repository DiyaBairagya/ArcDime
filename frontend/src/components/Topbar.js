function Topbar({ apiMessage }) {
    return (
        <header className="topbar compact-topbar">
            <div>
                <p className="eyebrow">ArcDime workspace</p>
                <h2>Dashboard</h2>
            </div>

            <div className="backend-pill">{apiMessage}</div>
        </header>
    );
}

export default Topbar;