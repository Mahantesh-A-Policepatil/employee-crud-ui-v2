import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { AuthProvider } from "./contexts/AuthContext";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./config/routes";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                {PROTECTED_ROUTES.map(({ path, Component, permission }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            <ProtectedRoute permission={permission}>
                                <Component />
                            </ProtectedRoute>
                        }
                    />
                ))}

                {PUBLIC_ROUTES.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
