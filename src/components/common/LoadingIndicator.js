import React from "react";
import { loaderTileIndexes } from "./loadingMarkup";

function LoadingIndicator({ label = "Loading" }) {
  return (
    <div className="loading-indicator" role="status" aria-live="polite">
      <div className="loading-indicator__ring" aria-hidden="true">
        {loaderTileIndexes.map((index) => (
          <span
            className="loading-indicator__tile"
            key={index}
            style={{ "--loader-index": index }}
          />
        ))}
      </div>
      <span className="loading-indicator__label">{label}...</span>
    </div>
  );
}

export default LoadingIndicator;
