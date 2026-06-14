function Toast({ toast, onClose }) {
    if (!toast) return null;

    return (
        <div className={`toast toast-${toast.type || "info"}`}>
            <div>
                <strong>{toast.title}</strong>
                {toast.message && <p>{toast.message}</p>}
            </div>

            <button type="button" onClick={onClose}>
                ×
            </button>
        </div>
    );
}

export default Toast;