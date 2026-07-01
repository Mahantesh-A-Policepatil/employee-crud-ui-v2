import React from "react";
import { Navigate } from "react-router-dom";
import ForbiddenPage from "../common/ForbiddenPage";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children, permission }) {
    const { isAuthenticated, isCheckingAuth, hasPermission } = useAuth();

    if (isCheckingAuth) {
        return (
            <div className="d-flex min-vh-100 align-items-center justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (permission && !hasPermission(permission)) {
        return <ForbiddenPage />;
    }

    return children;
}

export default ProtectedRoute;
