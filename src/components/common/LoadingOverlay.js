import React from "react";

function LoadingOverlay({ show }) {
    if (!show) {
        return null;
    }

    return (
        <div className="loading-overlay">
            <div className="spinner-border text-primary loading-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default LoadingOverlay;
