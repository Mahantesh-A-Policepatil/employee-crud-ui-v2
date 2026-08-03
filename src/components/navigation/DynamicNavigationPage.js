import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../../contexts/AuthContext";

function DynamicNavigationPage() {
  const location = useLocation();
  const { navigation, isNavigationLoading } = useAuth();

  if (isNavigationLoading) {
    return null;
  }

  const item = navigation.find((entry) => entry.path === location.pathname);

  if (!item) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout>
      <section className="settings-panel">
        <h1>{item.label}</h1>
        <p className="mb-0 text-muted">
          This navigation module is available. Add its React page and API workflow
          to replace this placeholder.
        </p>
      </section>
    </AppLayout>
  );
}

export default DynamicNavigationPage;
