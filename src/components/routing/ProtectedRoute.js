import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getDefaultAccessibleRoute } from "../../config/routes";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children, permission }) {
    const location = useLocation();
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
        const fallbackRoute = getDefaultAccessibleRoute(hasPermission);

        if (fallbackRoute !== location.pathname) {
            return <Navigate to={fallbackRoute} replace />;
        }
    }

    return children;
}

export default ProtectedRoute;
