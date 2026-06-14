import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import InsightsPage from "./pages/InsightsPage";
import AssistantPage from "./pages/AssistantPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const CATEGORY_COLORS = [
  "#7B5EA7",
  "#C9A96E",
  "#6B9E6B",
  "#C4817A",
  "#A98EC0",
  "#3D2E55",
  "#DDD0F0",
  "#9B90B4",
];

const emptyForm = {
  amount: "",
  category: "Food",
  merchant: "",
  description: "",
  expense_date: new Date().toISOString().split("T")[0],
};

const defaultAnalytics = {
  total_spending: 0,
  total_expenses: 0,
  category_breakdown: [],
  daily_breakdown: [],
  highest_category: null,
  insights: [],
  alerts: [],
  financial_health_score: 100,
  budget_status: {
    has_budget: false,
    monthly_limit: 0,
    monthly_spent: 0,
    monthly_remaining: null,
    monthly_used_percentage: null,
    is_monthly_over_budget: false,
    category_status: [],
  },
};

function AppContent() {
  const navigate = useNavigate();
  const today = new Date();

  const [apiMessage, setApiMessage] = useState("");
  const [expenses, setExpenses] = useState([]);

  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [toast, setToast] = useState(null);

  const showToast = (title, message = "", type = "info") => {
    setToast({ title, message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const [analytics, setAnalytics] = useState(defaultAnalytics);


  const [formData, setFormData] = useState(emptyForm);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [categorySuggestion, setCategorySuggestion] = useState(null);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [categoryWasSuggested, setCategoryWasSuggested] = useState(false);
  const [expenseSourceType, setExpenseSourceType] = useState("manual");
  const [selectedBillFile, setSelectedBillFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [parsedOcrExpense, setParsedOcrExpense] = useState(null);
  const [voiceText, setVoiceText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [parsedVoiceExpense, setParsedVoiceExpense] = useState(null);

  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I’m ArcDime Assistant. Ask me about your spending, budgets, savings targets, or what-if scenarios.",
    },
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("arcdime_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isRefreshingData, setIsRefreshingData] = useState(false);

  useEffect(() => {
    const handleAuthExpired = () => {
      setCurrentUser(null);
      setExpenses([]);

      setAnalytics(defaultAnalytics);

      navigate("/login");
    };

    window.addEventListener("arcdime-auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("arcdime-auth-expired", handleAuthExpired);
    };
  }, [navigate]);

  useEffect(() => {
    const verifyLoggedInUser = async () => {
      const token = localStorage.getItem("arcdime_token");

      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        localStorage.setItem("arcdime_user", JSON.stringify(response.data));
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Auth verification failed:", error);

        localStorage.removeItem("arcdime_token");
        localStorage.removeItem("arcdime_user");
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyLoggedInUser();
  }, []);

  useEffect(() => {
    checkBackend();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
      fetchMonthlyAnalytics();
    }
  }, [currentUser]);

  useEffect(() => {
    const loadMonthlyAnalytics = async () => {
      try {
        const response = await api.get("/analytics/monthly", { params: { year: selectedYear, month: selectedMonth } });

        setAnalytics(response.data);
      } catch (error) {
        console.error("Could not fetch monthly analytics:", error);
      }
    };

    loadMonthlyAnalytics();
  }, [selectedYear, selectedMonth]);

  const checkBackend = async () => {
    try {
      const response = await api.get("/");
      setApiMessage(response.data.message);
    } catch (error) {
      console.error("Backend connection failed:", error);
      setApiMessage("Could not connect to ArcDime backend.");
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Could not fetch expenses:", error);
    }
  };

  const fetchMonthlyAnalytics = async () => {
    try {
      const response = await api.get("/analytics/monthly", { params: { year: selectedYear, month: selectedMonth } });

      setAnalytics(response.data);
    } catch (error) {
      console.error("Could not fetch monthly analytics:", error);
    }
  };

  const refreshData = async () => {
    const token = localStorage.getItem("arcdime_token");

    if (!token) return;

    try {
      setIsRefreshingData(true);
      await Promise.all([fetchExpenses(), fetchMonthlyAnalytics()]);
    } finally {
      setIsRefreshingData(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "category") {
      setCategoryWasSuggested(false);
      setExpenseSourceType("manual");
    }

    if (name === "merchant" || name === "description") {
      setCategorySuggestion(null);
      setCategoryWasSuggested(false);
      setExpenseSourceType("manual");
    }
  };

  const handleSubmitExpense = async (event) => {
    event.preventDefault();

    const expensePayload = {
      amount: Number(formData.amount),
      category: formData.category,
      merchant: formData.merchant,
      description: formData.description,
      expense_date: formData.expense_date,
      source_type: expenseSourceType,
    };

    try {
      if (editingExpenseId) {
        await api.put(`/expenses/${editingExpenseId}`, expensePayload);
        showToast("Expense updated", "Your expense was updated successfully.", "success");
      } else {
        await api.post("/expenses", expensePayload);
        showToast("Expense added", "Your expense was saved successfully.", "success");
      }

      setFormData(emptyForm);
      setEditingExpenseId(null);
      setCategorySuggestion(null);
      setCategoryWasSuggested(false);
      setExpenseSourceType("manual");
      refreshData();
    } catch (error) {
      console.error("Could not save expense:", error);
      showToast("Action failed", "Could not save the expense. Please try again.", "error");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpenseId(expense.id);

    setFormData({
      amount: expense.amount,
      category: expense.category,
      merchant: expense.merchant || "",
      description: expense.description || "",
      expense_date: expense.expense_date,
    });

    setCategorySuggestion(null);
    setCategoryWasSuggested(false);
    setExpenseSourceType(expense.source_type || "manual");

    navigate("/add-expense");
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setFormData(emptyForm);
    setCategorySuggestion(null);
    setCategoryWasSuggested(false);
    setExpenseSourceType("manual");
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      showToast("Expense deleted", "The expense was removed successfully.", "success");
      refreshData();
    } catch (error) {
      console.error("Could not delete expense:", error);
      showToast("Delete failed", "Could not delete the expense.", "error");
    }
  };

  const handleSuggestCategory = async () => {
    const textForSuggestion = `${formData.merchant} ${formData.description}`.trim();

    if (!textForSuggestion) {
      alert("Please enter merchant or description first.");
      return;
    }

    try {
      setIsSuggestingCategory(true);

      const response = await api.post("/ai/suggest-category", { text: textForSuggestion });

      const suggestion = response.data;

      setCategorySuggestion(suggestion);

      if (suggestion.suggested_category) {
        setFormData((prev) => ({
          ...prev,
          category: suggestion.suggested_category,
        }));

        setCategoryWasSuggested(true);
        setExpenseSourceType("smart");
        showToast(
          "Category suggested",
          `Suggested category: ${response.data.suggested_category}`,
          "success"
        );
      }
    } catch (error) {
      console.error("Could not suggest category:", error);
      alert("Could not suggest category. Check backend.");
      showToast(
        "Suggestion failed",
        "Could not suggest a category right now.",
        "error"
      );
    } finally {
      setIsSuggestingCategory(false);
    }
  };

  const handleBillFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedBillFile(file);
      setOcrText("");
      setParsedOcrExpense(null);
    }
  };

  const handleExtractBillText = async () => {
    if (!selectedBillFile) {
      alert("Please select a bill image first.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("file", selectedBillFile);

    try {
      setIsProcessingOcr(true);

      const response = await api.post("/ocr/extract-text", uploadData, { headers: { "Content-Type": "multipart/form-data" } });

      setOcrText(response.data.extracted_text);
      setParsedOcrExpense(response.data.parsed_expense);
      showToast("Bill scanned", "Expense details were extracted from the bill.", "success");
    } catch (error) {
      console.error("OCR failed:", error);
      alert("Could not extract text from bill. Check backend.");
      showToast("OCR failed", "Could not extract details from this bill.", "error");
    } finally {
      setIsProcessingOcr(false);
    }
  };

  const handleUseOcrExpense = () => {
    if (!parsedOcrExpense) {
      alert("No parsed OCR expense available.");
      return;
    }

    setFormData({
      amount: parsedOcrExpense.amount || "",
      category: parsedOcrExpense.category || "Other",
      merchant: parsedOcrExpense.merchant || "",
      description: parsedOcrExpense.description || "Extracted from bill image",
      expense_date:
        parsedOcrExpense.expense_date || new Date().toISOString().split("T")[0],
    });

    setCategorySuggestion({
      suggested_category: parsedOcrExpense.category || "Other",
      confidence: parsedOcrExpense.confidence || "low",
      matched_keywords: parsedOcrExpense.matched_keywords || [],
    });

    setCategoryWasSuggested(false);
    setExpenseSourceType("ocr");
    setEditingExpenseId(null);

    showToast("Expense filled", "Please verify the bill details and save.", "success");
  };

  const handleStartVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setVoiceText("");
    setParsedVoiceExpense(null);

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      setIsListening(false);
      handleParseVoiceText(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      alert("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleParseVoiceText = async (text) => {
    if (!text.trim()) {
      alert("No voice text detected.");
      return;
    }

    try {
      const response = await api.post("/voice/parse-expense", { text });

      setParsedVoiceExpense(response.data);
      showToast("Voice entry ready", "Expense details were detected from your voice input.", "success");
    } catch (error) {
      console.error("Could not parse voice expense:", error);
      alert("Could not understand voice expense. Check backend.");
      showToast("Voice parsing failed", "Could not understand the expense clearly.", "error");
    }
  };

  const handleUseVoiceExpense = () => {
    if (!parsedVoiceExpense) {
      alert("No parsed voice expense available.");
      return;
    }

    setFormData({
      amount: parsedVoiceExpense.amount || "",
      category: parsedVoiceExpense.category || "Other",
      merchant: parsedVoiceExpense.merchant || "",
      description: parsedVoiceExpense.description || "Added using voice",
      expense_date:
        parsedVoiceExpense.expense_date || new Date().toISOString().split("T")[0],
    });

    setCategorySuggestion({
      suggested_category: parsedVoiceExpense.category || "Other",
      confidence: parsedVoiceExpense.confidence || "low",
      matched_keywords: parsedVoiceExpense.matched_keywords || [],
    });

    setCategoryWasSuggested(false);
    setExpenseSourceType("voice");
    setEditingExpenseId(null);

    showToast("Expense filled", "Please verify the voice details and save.", "success");
  };

  const handleAskAssistant = async (event) => {
    event.preventDefault();

    if (!assistantQuestion.trim()) {
      return;
    }

    const userQuestion = assistantQuestion.trim();

    setAssistantMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setAssistantQuestion("");

    try {
      setIsAssistantLoading(true);

      const response = await api.post("/assistant/ask", { question: userQuestion, year: selectedYear, month: selectedMonth });

      setAssistantMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.data.answer,
          intent: response.data.intent,
        },
      ]);
    } catch (error) {
      console.error("Assistant failed:", error);

      setAssistantMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I could not process that question right now. Please check the backend.",
        },
      ]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleAuthSuccess = (authData) => {
    localStorage.setItem("arcdime_token", authData.access_token);
    localStorage.setItem("arcdime_user", JSON.stringify(authData.user));

    setCurrentUser(authData.user);

    refreshData();
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("arcdime_token");
    localStorage.removeItem("arcdime_user");

    setCurrentUser(null);
    setExpenses([]);
    setFormData(emptyForm);
    setEditingExpenseId(null);
    setCategorySuggestion(null);
    setCategoryWasSuggested(false);
    setExpenseSourceType("manual");

    setAnalytics(defaultAnalytics);

    navigate("/login");
  };

  if (isCheckingAuth) {
    return (
      <div className="app-loading">
        <div>
          <h1>ArcDime</h1>
          <p>Preparing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onAuthSuccess={handleAuthSuccess} />}
        />

        <Route
          path="/signup"
          element={<SignupPage onAuthSuccess={handleAuthSuccess} />}
        />

        <Route
          path="/*"
          element={
            currentUser ? (
              <div className="app">
                <Sidebar currentUser={currentUser} onLogout={handleLogout} />

                <main className="main">
                  <Topbar apiMessage={apiMessage} />

                  <Routes>
                    <Route
                      path="/"
                      element={
                        <DashboardPage
                          analytics={analytics}
                          expenses={expenses}
                          categoryColors={CATEGORY_COLORS}
                          handleEditExpense={handleEditExpense}
                          handleDeleteExpense={handleDeleteExpense}
                          selectedMonth={selectedMonth}
                          selectedYear={selectedYear}
                          setSelectedMonth={setSelectedMonth}
                          setSelectedYear={setSelectedYear}
                          isRefreshingData={isRefreshingData}
                        />
                      }
                    />

                    <Route
                      path="/expenses"
                      element={
                        <ExpensesPage
                          expenses={expenses}
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          categoryFilter={categoryFilter}
                          setCategoryFilter={setCategoryFilter}
                          sourceFilter={sourceFilter}
                          setSourceFilter={setSourceFilter}
                          handleEditExpense={handleEditExpense}
                          handleDeleteExpense={handleDeleteExpense}
                        />
                      }
                    />

                    <Route
                      path="/add-expense"
                      element={
                        <AddExpensePage
                          formData={formData}
                          editingExpenseId={editingExpenseId}
                          categorySuggestion={categorySuggestion}
                          isSuggestingCategory={isSuggestingCategory}
                          handleChange={handleChange}
                          handleSubmitExpense={handleSubmitExpense}
                          handleSuggestCategory={handleSuggestCategory}
                          handleCancelEdit={handleCancelEdit}
                          isListening={isListening}
                          voiceText={voiceText}
                          parsedVoiceExpense={parsedVoiceExpense}
                          handleStartVoiceInput={handleStartVoiceInput}
                          handleUseVoiceExpense={handleUseVoiceExpense}
                          selectedBillFile={selectedBillFile}
                          ocrText={ocrText}
                          parsedOcrExpense={parsedOcrExpense}
                          isProcessingOcr={isProcessingOcr}
                          handleBillFileChange={handleBillFileChange}
                          handleExtractBillText={handleExtractBillText}
                          handleUseOcrExpense={handleUseOcrExpense}
                        />
                      }
                    />

                    <Route
                      path="/insights"
                      element={
                        <InsightsPage
                          analytics={analytics}
                          categoryColors={CATEGORY_COLORS}
                          selectedMonth={selectedMonth}
                          selectedYear={selectedYear}
                          setSelectedMonth={setSelectedMonth}
                          setSelectedYear={setSelectedYear}
                        />
                      }
                    />

                    <Route
                      path="/assistant"
                      element={
                        <AssistantPage
                          assistantQuestion={assistantQuestion}
                          setAssistantQuestion={setAssistantQuestion}
                          assistantMessages={assistantMessages}
                          isAssistantLoading={isAssistantLoading}
                          handleAskAssistant={handleAskAssistant}
                        />
                      }
                    />

                    <Route
                      path="/settings"
                      element={
                        <SettingsPage
                          expenses={expenses}
                          analytics={analytics}
                          selectedYear={selectedYear}
                          selectedMonth={selectedMonth}
                          showToast={showToast}
                          currentUser={currentUser}
                          setCurrentUser={setCurrentUser}
                        />
                      }
                    />
                  </Routes>
                </main>
              </div>
            ) : (
              <LoginPage onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
