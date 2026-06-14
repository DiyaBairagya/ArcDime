import AssistantPanel from "../components/AssistantPanel";

function AssistantPage({
    assistantQuestion,
    setAssistantQuestion,
    assistantMessages,
    isAssistantLoading,
    handleAskAssistant,
}) {
    return (
        <>
            <section className="page-header-card">
                <div>
                    <p className="eyebrow">Chat with your finances</p>
                    <h3>ArcDime Assistant</h3>
                    <span>Ask questions about your spending, patterns, and alerts.</span>
                </div>
            </section>

            <AssistantPanel
                assistantQuestion={assistantQuestion}
                setAssistantQuestion={setAssistantQuestion}
                assistantMessages={assistantMessages}
                isAssistantLoading={isAssistantLoading}
                handleAskAssistant={handleAskAssistant}
            />
        </>
    );
}

export default AssistantPage;