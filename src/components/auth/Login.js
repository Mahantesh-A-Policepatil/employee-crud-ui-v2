import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import apiClient, { getSafeApiErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { clearStoredAuth } from "../../services/auth";

const LOGIN_FAILED_MESSAGE = "Login failed. Please check your email and password.";

function Login() {
    const { isAuthenticated, login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            clearStoredAuth();

            const response = await apiClient.post("/login", form);

            login({
                token: response.data.token,
                user: response.data.user,
            });
            setMessage(response.data.message || "Logged in successfully.");
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const firstError = Object.values(serverErrors)[0]?.[0];
                setError(firstError || LOGIN_FAILED_MESSAGE);
            } else {
                setError(getSafeApiErrorMessage(err, LOGIN_FAILED_MESSAGE));
            }
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <div className="card-body p-4">
                    <h3 className="mb-3 text-center">Login</h3>
                    <p className="text-muted text-center">Sign in to your account</p>

                    {message && <div className="alert alert-info">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 btn-with-icon" disabled={loading}>
                            <span className="button-icon" aria-hidden="true">&#8594;</span>
                            <span>{loading ? "Logging in..." : "Login"}</span>
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <div className="mt-2 text-center">
                        <span>Don&apos;t have an account? </span>
                        <Link to="/register">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
