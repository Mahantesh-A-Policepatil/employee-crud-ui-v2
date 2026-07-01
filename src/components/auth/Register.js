import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import apiClient, { getSafeApiErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";

function Register() {
    const { isAuthenticated, login } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await apiClient.post("/register", form);

            login({
                token: response.data.token,
                user: response.data.user,
            });
            setMessage(response.data.message || "Account created successfully.");
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const firstError = Object.values(serverErrors)[0]?.[0];
                setError(firstError || "Registration failed.");
            } else {
                setError(getSafeApiErrorMessage(err, "Registration failed."));
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
            <div className="card auth-card auth-card-wide">
                <div className="card-body p-4">
                    <h3 className="mb-3 text-center">Register</h3>
                    <p className="text-muted text-center">Create a new account</p>

                    {message && <div className="alert alert-info">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

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

                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                className="form-control"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-success w-100 btn-with-icon" disabled={loading}>
                            <span className="button-icon" aria-hidden="true">+</span>
                            <span>{loading ? "Registering..." : "Register"}</span>
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <span>Already have an account? </span>
                        <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
