import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForbiddenPage from "./ForbiddenPage";
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

function renderForbiddenPage() {
    return render(
        <MemoryRouter>
            <AuthProvider>
                <ForbiddenPage />
            </AuthProvider>
        </MemoryRouter>
    );
}

describe("ForbiddenPage", () => {
    beforeEach(() => {
        clearStoredAuth();
    });

    test("renders 403 message", () => {
        renderForbiddenPage();

        expect(screen.getByText("403")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /forbidden/i })).toBeInTheDocument();
        expect(screen.getByText(/you do not have permission to access this page/i)).toBeInTheDocument();
    });

    test("links back to the first accessible route", async () => {
        apiClient.get.mockResolvedValueOnce({
            data: {
                permissions: ["departments.view"],
            },
        });

        setStoredAuth({
            token: "token",
            user: {
                permissions: ["departments.view"],
            },
        });

        renderForbiddenPage();

        await waitFor(() => {
            expect(screen.getByRole("link", { name: /back to dashboard/i })).toHaveAttribute("href", "/departments");
        });
    });
});
