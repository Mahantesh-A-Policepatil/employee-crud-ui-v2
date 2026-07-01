import React, { useState } from "react";
import apiClient, { getSafeApiErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import AppLayout from "../layout/AppLayout";

function UserSettings() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        password_confirmation: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (form.password && form.password !== form.password_confirmation) {
            setError("Password confirmation does not match.");
            return;
        }

        setLoading(true);

        const payload = {
            name: form.name,
            email: form.email,
        };

        if (form.password) {
            payload.password = form.password;
            payload.password_confirmation = form.password_confirmation;
        }

        try {
            const response = await apiClient.put("/user", payload);
            const updatedUser = response.data.user || response.data;

            updateUser(updatedUser);
            setForm({
                name: updatedUser.name || "",
                email: updatedUser.email || "",
                password: "",
                password_confirmation: "",
            });
            setMessage(response.data.message || "User information updated successfully.");
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const firstError = Object.values(serverErrors)[0]?.[0];
                setError(firstError || "Unable to update user information.");
            } else {
                setError(getSafeApiErrorMessage(err, "Unable to update user information."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout loading={loading} mainClassName="settings-page flex-grow-1">
            <div className="page-title-row">
                <div>
                    <h1>User Settings</h1>
                </div>
            </div>

            <div className="settings-panel">
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
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

                        <div className="col-md-6">
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

                        <div className="col-md-6">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                className="form-control"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current password"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary btn-with-icon" disabled={loading}>
                            <span className="button-icon" aria-hidden="true">&#10003;</span>
                            <span>{loading ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

export default UserSettings;
