import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function SignupPage({ onAuthSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrorMessage("");
    };

    const handleSignup = async (event) => {
        event.preventDefault();

        if (formData.password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await api.post("/auth/signup", formData);

            onAuthSuccess(response.data);
        } catch (error) {
            console.error("Signup failed:", error);
            setErrorMessage(
                error.response?.data?.detail || "Signup failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-brand">
                <h1>ArcDime</h1>
                <p>Because Every Dime Matters.</p>
                <span>Track expenses, scan bills, use voice entry, and understand your financial behavior.</span>
            </section>

            <section className="auth-card">
                <p className="eyebrow">Start your journey</p>
                <h2>Create your account</h2>

                <form onSubmit={handleSignup} className="auth-form">
                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Diya"
                            required
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="diya@gmail.com"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimum 8 characters"
                            required
                        />
                    </label>

                    {errorMessage && <p className="auth-error">{errorMessage}</p>}

                    <button type="submit" className="primary-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </section>
        </div>
    );
}

export default SignupPage;