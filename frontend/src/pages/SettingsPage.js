import { useEffect, useState } from "react";
import api from "../api";
import { downloadCSV, downloadMonthlyReport } from "../utils/exportUtils";
const defaultCategoryLimits = {
    Food: "",
    Travel: "",
    Shopping: "",
    Groceries: "",
    Bills: "",
    Entertainment: "",
    Healthcare: "",
    Other: "",
};

function SettingsPage({
    expenses,
    analytics,
    selectedYear,
    selectedMonth,
    showToast,
    currentUser,
    setCurrentUser,
}) {
    const today = new Date();

    const [budgetYear, setBudgetYear] = useState(today.getFullYear());
    const [budgetMonth, setBudgetMonth] = useState(today.getMonth() + 1);
    const [monthlyLimit, setMonthlyLimit] = useState("");
    const [categoryLimits, setCategoryLimits] = useState(defaultCategoryLimits);
    const [message, setMessage] = useState("");
    const [isSavingBudget, setIsSavingBudget] = useState(false);
    const [profileName, setProfileName] = useState(currentUser?.name || "");
    const [profileDob, setProfileDob] = useState(currentUser?.dob || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const fetchBudget = async () => {
        try {
            setMessage("");

            const response = await api.get("/budgets/monthly", {
                params: {
                    year: budgetYear,
                    month: budgetMonth,
                },
            });

            setMonthlyLimit(response.data.monthly_limit || "");

            setCategoryLimits({
                ...defaultCategoryLimits,
                ...(response.data.category_limits || {}),
            });
        } catch (error) {
            if (error.response?.status === 404) {
                setMonthlyLimit("");
                setCategoryLimits(defaultCategoryLimits);
                setMessage("No budget set for this month yet.");
            } else {
                setMessage("Could not load budget.");
            }
        }
    };

    useEffect(() => {
        fetchBudget();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [budgetYear, budgetMonth]);

    const handleCategoryLimitChange = (category, value) => {
        setCategoryLimits((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const handleSaveBudget = async (event) => {
        event.preventDefault();

        const cleanedCategoryLimits = {};

        Object.entries(categoryLimits).forEach(([category, value]) => {
            if (value !== "" && Number(value) > 0) {
                cleanedCategoryLimits[category] = Number(value);
            }
        });

        try {
            setIsSavingBudget(true);
            setMessage("");

            await api.put("/budgets/monthly", {
                year: budgetYear,
                month: budgetMonth,
                monthly_limit: Number(monthlyLimit || 0),
                category_limits: cleanedCategoryLimits,
            });

            setMessage("Budget saved successfully.");
        } catch (error) {
            setMessage(error.response?.data?.detail || "Could not save budget.");
        } finally {
            setIsSavingBudget(false);
        }
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        try {
            setIsSavingProfile(true);

            const response = await api.put("/auth/profile", {
                name: profileName,
                dob: profileDob || null,
            });

            const updatedUser = {
                ...currentUser,
                ...response.data,
            };

            localStorage.setItem("arcdime_user", JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            showToast("Profile updated", "Your profile details were saved.", "success");
        } catch (error) {
            showToast(
                "Profile update failed",
                error.response?.data?.detail || "Could not update profile.",
                "error"
            );
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        try {
            setIsChangingPassword(true);

            await api.put("/auth/change-password", {
                current_password: currentPassword,
                new_password: newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");

            showToast("Password updated", "Your password was changed successfully.", "success");
        } catch (error) {
            showToast(
                "Password change failed",
                error.response?.data?.detail || "Could not change password.",
                "error"
            );
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <>
            <section className="page-header-card">
                <div>
                    <p className="eyebrow">Manage your preferences</p>
                    <h3>Settings</h3>
                    <span>Set monthly budgets, category limits, and account preferences.</span>
                </div>
            </section>

            <section className="settings-section">
                <p className="settings-label">Budget Planning</p>

                <form className="budget-settings-card" onSubmit={handleSaveBudget}>
                    <div className="budget-settings-grid">
                        <label>
                            Month
                            <select
                                value={budgetMonth}
                                onChange={(event) => setBudgetMonth(Number(event.target.value))}
                            >
                                <option value={1}>January</option>
                                <option value={2}>February</option>
                                <option value={3}>March</option>
                                <option value={4}>April</option>
                                <option value={5}>May</option>
                                <option value={6}>June</option>
                                <option value={7}>July</option>
                                <option value={8}>August</option>
                                <option value={9}>September</option>
                                <option value={10}>October</option>
                                <option value={11}>November</option>
                                <option value={12}>December</option>
                            </select>
                        </label>

                        <label>
                            Year
                            <input
                                type="number"
                                value={budgetYear}
                                onChange={(event) => setBudgetYear(Number(event.target.value))}
                            />
                        </label>

                        <label>
                            Monthly Budget
                            <input
                                type="number"
                                value={monthlyLimit}
                                onChange={(event) => setMonthlyLimit(event.target.value)}
                                placeholder="Example: 25000"
                                min="0"
                            />
                        </label>
                    </div>

                    <div className="category-budget-grid">
                        {Object.keys(defaultCategoryLimits).map((category) => (
                            <label key={category}>
                                {category}
                                <input
                                    type="number"
                                    value={categoryLimits[category] || ""}
                                    onChange={(event) =>
                                        handleCategoryLimitChange(category, event.target.value)
                                    }
                                    placeholder="Limit"
                                    min="0"
                                />
                            </label>
                        ))}
                    </div>

                    {message && <p className="settings-message">{message}</p>}

                    <button type="submit" className="primary-btn" disabled={isSavingBudget}>
                        {isSavingBudget ? "Saving Budget..." : "Save Budget"}
                    </button>
                </form>
            </section>

            <section className="settings-section">
                <p className="settings-label">Account</p>

                <div className="settings-card">
                    <span>👤</span>

                    <div>
                        <strong>Profile</strong>
                        <p>Manage your name, date of birth, and password</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsProfileOpen((prev) => !prev)}
                    >
                        {isProfileOpen ? "Close" : "Manage"}
                    </button>
                </div>

                {isProfileOpen && (
                    <div className="profile-dropdown">
                        <form className="profile-settings-card" onSubmit={handleSaveProfile}>
                            <div className="budget-settings-grid">
                                <label>
                                    Full Name
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(event) => setProfileName(event.target.value)}
                                        placeholder="Your name"
                                    />
                                </label>

                                <label>
                                    Email
                                    <input type="email" value={currentUser?.email || ""} disabled />
                                </label>

                                <label>
                                    Date of Birth
                                    <input
                                        type="date"
                                        value={profileDob || ""}
                                        onChange={(event) => setProfileDob(event.target.value)}
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="primary-btn compact-btn"
                                disabled={isSavingProfile}
                            >
                                {isSavingProfile ? "Saving..." : "Save Profile"}
                            </button>
                        </form>

                        <form className="profile-settings-card" onSubmit={handleChangePassword}>
                            <div className="budget-settings-grid">
                                <label>
                                    Current Password
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(event) => setCurrentPassword(event.target.value)}
                                        placeholder="Current password"
                                    />
                                </label>

                                <label>
                                    New Password
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) => setNewPassword(event.target.value)}
                                        placeholder="At least 8 characters"
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="primary-btn compact-btn"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? "Updating..." : "Change Password"}
                            </button>
                        </form>
                    </div>
                )}
            </section>

            <section className="settings-section">

                <div className="settings-card">
                    <span>⬇</span>
                    <div>
                        <strong>Export Expenses CSV</strong>
                        <p>Download all visible expenses as a CSV file</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const exported = downloadCSV(
                                expenses,
                                `arcdime-expenses-${selectedYear}-${selectedMonth}.csv`
                            );

                            if (exported) {
                                showToast("CSV exported", "Your expense data was downloaded.", "success");
                            } else {
                                showToast("No data to export", "Add expenses before exporting.", "info");
                            }
                        }}
                    >
                        Export
                    </button>
                </div>

                <div className="settings-card">
                    <span>📄</span>
                    <div>
                        <strong>Monthly Report</strong>
                        <p>Download a simple monthly spending report</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            const exported = downloadMonthlyReport(
                                analytics,
                                expenses,
                                selectedYear,
                                selectedMonth,
                                `arcdime-report-${selectedYear}-${selectedMonth}.txt`
                            );

                            if (exported) {
                                showToast("Report downloaded", "Your monthly report was generated.", "success");
                            }
                        }}
                    >
                        Download
                    </button>
                </div>
            </section>
        </>
    );
}

export default SettingsPage;