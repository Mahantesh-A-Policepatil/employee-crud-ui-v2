import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ForgotPassword() {
    const { isAuthenticated } = useAuth();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("Password reset request submitted. This will be wired to Laravel later.");
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <div className="card-body p-4">
                    <h3 className="mb-3 text-center">Forgot Password</h3>
                    <p className="text-muted text-center">Enter your email to receive reset instructions</p>

                    {message && <div className="alert alert-info">{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-warning w-100 btn-with-icon">
                            <span className="button-icon" aria-hidden="true">&#8594;</span>
                            <span>Send Reset Link</span>
                        </button>
                    </form>

                    <div className="mt-3 text-center">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
