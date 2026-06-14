import { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function LoginPage({ onAuthSuccess }) {
    const [formData, setFormData] = useState({
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

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);

            const response = await api.post("/auth/login", formData);

            onAuthSuccess(response.data);
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage(
                error.response?.data?.detail || "Login failed. Please try again."
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
                <span>Understand your spending with AI-powered expense intelligence.</span>
            </section>

            <section className="auth-card">
                <p className="eyebrow">Welcome back</p>
                <h2>Login to ArcDime</h2>

                <form onSubmit={handleLogin} className="auth-form">
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
                            placeholder="Enter password"
                            required
                        />
                    </label>

                    {errorMessage && <p className="auth-error">{errorMessage}</p>}

                    <button type="submit" className="primary-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-switch">
                    New to ArcDime? <Link to="/signup">Create an account</Link>
                </p>
            </section>
        </div>
    );
}

export default LoginPage;