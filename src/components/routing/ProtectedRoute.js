import React from "react";
import { Navigate } from "react-router-dom";
import ForbiddenPage from "../common/ForbiddenPage";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute({ children, permission }) {
    const { isAuthenticated, isCheckingAuth, hasPermission } = useAuth();

    if (isCheckingAuth) {
        return null;
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
