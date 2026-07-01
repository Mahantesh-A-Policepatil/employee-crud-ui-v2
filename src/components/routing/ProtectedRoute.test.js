import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../auth/Login";
import { AuthProvider } from "../../contexts/AuthContext";
import apiClient from "../../api/apiClient";
import { clearStoredAuth, setStoredAuth } from "../../services/auth";

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

test("shows the forbidden page when a user lacks the required permission", async () => {
    clearStoredAuth();
    setStoredAuth({
        token: "token",
        user: {
            permissions: ["departments.view"],
        },
    });

    apiClient.get.mockResolvedValueOnce({
        data: {
            permissions: ["departments.view"],
        },
    });

    render(
        <MemoryRouter initialEntries={["/roles"]}>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/roles"
                        element={
                            <ProtectedRoute permission="roles.view">
                                <div>Protected content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/departments" element={<div>Departments page</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { name: /forbidden/i })).toBeInTheDocument();
    expect(screen.getByText(/you do not have permission to access this page/i)).toBeInTheDocument();
});
