import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../auth/Login";
import { AuthProvider } from "../../contexts/AuthContext";
import { clearStoredAuth } from "../../services/auth";

jest.mock("../../api/apiClient", () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: { request: { use: jest.fn() } },
    },
    API_BASE_URL: "http://127.0.0.1:8000/api",
    getSafeApiErrorMessage: (_error, fallback) => fallback,
}));

test("redirects unauthenticated users to login", async () => {
    clearStoredAuth();

    render(
        <MemoryRouter initialEntries={["/"]}>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute permission="employees.view">
                                <div>Protected content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: /login/i })).toBeInTheDocument();
});
