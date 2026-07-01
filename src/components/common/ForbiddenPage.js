import React from "react";
import { Link } from "react-router-dom";
import { getDefaultAccessibleRoute } from "../../config/routes";
import { useAuth } from "../../contexts/AuthContext";

function ForbiddenPage() {
    const { hasPermission } = useAuth();
    const fallbackRoute = getDefaultAccessibleRoute(hasPermission);

    return (
        <div className="forbidden-page">
            <div className="forbidden-panel">
                <div className="forbidden-status">403</div>
                <h1>Forbidden</h1>
                <p>You do not have permission to access this page.</p>
                <Link className="btn btn-primary btn-with-icon" to={fallbackRoute}>
                    <span className="button-icon" aria-hidden="true">&#8592;</span>
                    <span>Back to dashboard</span>
                </Link>
            </div>
        </div>
    );
}

export default ForbiddenPage;
