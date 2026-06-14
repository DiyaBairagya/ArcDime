function EmptyState({
    title = "Nothing here yet",
    message = "Once you add data, it will appear here.",
    actionLabel,
    onAction,
}) {
    return (
        <div className="empty-state">
            <div className="empty-icon">✦</div>
            <h3>{title}</h3>
            <p>{message}</p>

            {actionLabel && onAction && (
                <button type="button" className="primary-btn" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;