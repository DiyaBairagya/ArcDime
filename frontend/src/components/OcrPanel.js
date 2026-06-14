function OcrPanel({
    selectedBillFile,
    ocrText,
    parsedOcrExpense,
    isProcessingOcr,
    handleBillFileChange,
    handleExtractBillText,
    handleUseOcrExpense,
}) {
    return (
        <section className="panel ocr-panel">
            <div className="panel-header">
                <div>
                    <p className="eyebrow">Bill Intelligence</p>
                    <h3>Upload Bill for OCR</h3>
                </div>
            </div>

            <div className="ocr-upload-box">
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleBillFileChange}
                />

                {selectedBillFile && (
                    <p className="selected-file">
                        Selected: <strong>{selectedBillFile.name}</strong>
                    </p>
                )}

                <button
                    type="button"
                    className="primary-btn"
                    onClick={handleExtractBillText}
                    disabled={isProcessingOcr}
                >
                    {isProcessingOcr ? "Extracting Text..." : "Extract Text from Bill"}
                </button>
            </div>

            {ocrText && (
                <div className="ocr-result">
                    <h4>Extracted Text</h4>
                    <pre>{ocrText}</pre>
                </div>
            )}

            {parsedOcrExpense && (
                <div className="parsed-expense-card">
                    <h4>Detected Expense</h4>

                    <div className="parsed-grid">
                        <p>
                            <span>Amount</span>
                            <strong>
                                {parsedOcrExpense.amount
                                    ? `₹${parsedOcrExpense.amount}`
                                    : "Not detected"}
                            </strong>
                        </p>

                        <p>
                            <span>Merchant</span>
                            <strong>{parsedOcrExpense.merchant}</strong>
                        </p>

                        <p>
                            <span>Date</span>
                            <strong>{parsedOcrExpense.expense_date}</strong>
                        </p>

                        <p>
                            <span>Category</span>
                            <strong>{parsedOcrExpense.category}</strong>
                        </p>
                    </div>

                    <button type="button" className="primary-btn" onClick={handleUseOcrExpense}>
                        Use This Expense
                    </button>
                </div>
            )}
        </section>
    );
}

export default OcrPanel;