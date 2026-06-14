import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import VoicePanel from "../components/VoicePanel";
import OcrPanel from "../components/OcrPanel";

function AddExpensePage({
    formData,
    editingExpenseId,
    categorySuggestion,
    isSuggestingCategory,
    handleChange,
    handleSubmitExpense,
    handleSuggestCategory,
    handleCancelEdit,

    isListening,
    voiceText,
    parsedVoiceExpense,
    handleStartVoiceInput,
    handleUseVoiceExpense,

    selectedBillFile,
    ocrText,
    parsedOcrExpense,
    isProcessingOcr,
    handleBillFileChange,
    handleExtractBillText,
    handleUseOcrExpense,
}) {
    const [activeMethod, setActiveMethod] = useState("manual");

    return (
        <>
            <section className="page-header-card">
                <div>
                    <p className="eyebrow">Add Expense</p>
                    <h3>Choose how you want to add your expense</h3>
                    <span>Manual entry, bill scanner, or voice input.</span>
                </div>
            </section>

            <section className="method-grid">
                <button
                    className={`method-card ${activeMethod === "manual" ? "active" : ""}`}
                    onClick={() => setActiveMethod("manual")}
                >
                    <span>✎</span>
                    <strong>Manual Entry</strong>
                    <p>Type it yourself</p>
                </button>

                <button
                    className={`method-card ${activeMethod === "ocr" ? "active" : ""}`}
                    onClick={() => setActiveMethod("ocr")}
                >
                    <span>▣</span>
                    <strong>Bill Scanner</strong>
                    <p>Scan any receipt</p>
                </button>

                <button
                    className={`method-card ${activeMethod === "voice" ? "active" : ""}`}
                    onClick={() => setActiveMethod("voice")}
                >
                    <span>🎙</span>
                    <strong>Voice Entry</strong>
                    <p>Just speak it out</p>
                </button>
            </section>

            {activeMethod === "manual" && (
                <ExpenseForm
                    formData={formData}
                    editingExpenseId={editingExpenseId}
                    categorySuggestion={categorySuggestion}
                    isSuggestingCategory={isSuggestingCategory}
                    handleChange={handleChange}
                    handleSubmitExpense={handleSubmitExpense}
                    handleSuggestCategory={handleSuggestCategory}
                    handleCancelEdit={handleCancelEdit}
                />
            )}

            {activeMethod === "ocr" && (
                <>
                    <OcrPanel
                        selectedBillFile={selectedBillFile}
                        ocrText={ocrText}
                        parsedOcrExpense={parsedOcrExpense}
                        isProcessingOcr={isProcessingOcr}
                        handleBillFileChange={handleBillFileChange}
                        handleExtractBillText={handleExtractBillText}
                        handleUseOcrExpense={handleUseOcrExpense}
                    />

                    <ExpenseForm
                        formData={formData}
                        editingExpenseId={editingExpenseId}
                        categorySuggestion={categorySuggestion}
                        isSuggestingCategory={isSuggestingCategory}
                        handleChange={handleChange}
                        handleSubmitExpense={handleSubmitExpense}
                        handleSuggestCategory={handleSuggestCategory}
                        handleCancelEdit={handleCancelEdit}
                    />
                </>
            )}

            {activeMethod === "voice" && (
                <>
                    <VoicePanel
                        isListening={isListening}
                        voiceText={voiceText}
                        parsedVoiceExpense={parsedVoiceExpense}
                        handleStartVoiceInput={handleStartVoiceInput}
                        handleUseVoiceExpense={handleUseVoiceExpense}
                    />

                    <ExpenseForm
                        formData={formData}
                        editingExpenseId={editingExpenseId}
                        categorySuggestion={categorySuggestion}
                        isSuggestingCategory={isSuggestingCategory}
                        handleChange={handleChange}
                        handleSubmitExpense={handleSubmitExpense}
                        handleSuggestCategory={handleSuggestCategory}
                        handleCancelEdit={handleCancelEdit}
                    />
                </>
            )}
        </>
    );
}

export default AddExpensePage;