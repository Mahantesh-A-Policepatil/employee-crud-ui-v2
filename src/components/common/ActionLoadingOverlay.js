import React from "react";
import LoadingIndicator from "./LoadingIndicator";

function ActionLoadingOverlay({ show }) {
  if (!show) {
    return null;
  }

  return (
    <div className="action-loading-overlay" aria-label="Processing your request">
      <LoadingIndicator />
    </div>
  );
}

export default ActionLoadingOverlay;
