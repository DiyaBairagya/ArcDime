function VoicePanel({
    isListening,
    voiceText,
    parsedVoiceExpense,
    handleStartVoiceInput,
    handleUseVoiceExpense,
}) {
    return (
        <section className="panel voice-panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Voice Entry</p>
                    <h3>Dictate an Expense</h3>
                </div>
            </div>

            <div className="voice-box">
                <p className="voice-help">
                    Try saying: “Spent 450 rupees on groceries today”
                </p>

                <button
                    type="button"
                    className="primary-btn"
                    onClick={handleStartVoiceInput}
                    disabled={isListening}
                >
                    {isListening ? "Listening..." : "Start Voice Entry"}
                </button>

                {voiceText && (
                    <div className="voice-transcript">
                        <span>Detected Speech</span>
                        <p>{voiceText}</p>
                    </div>
                )}

                {parsedVoiceExpense && (
                    <div className="parsed-expense-card">
                        <h4>Detected Voice Expense</h4>

                        <div className="parsed-grid">
                            <p>
                                <span>Amount</span>
                                <strong>
                                    {parsedVoiceExpense.amount
                                        ? `₹${parsedVoiceExpense.amount}`
                                        : "Not detected"}
                                </strong>
                            </p>

                            <p>
                                <span>Category</span>
                                <strong>{parsedVoiceExpense.category}</strong>
                            </p>

                            <p>
                                <span>Date</span>
                                <strong>{parsedVoiceExpense.expense_date}</strong>
                            </p>

                            <p>
                                <span>Source</span>
                                <strong>Voice</strong>
                            </p>
                        </div>

                        <button type="button" className="primary-btn" onClick={handleUseVoiceExpense}>
                            Use This Expense
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default VoicePanel;