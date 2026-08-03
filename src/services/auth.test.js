import {
    AUTH_STORAGE_KEY,
    clearStoredAuth,
    getStoredAuth,
    getUserPermissions,
    hasPermission,
    setStoredAuth,
} from "./auth";

describe("auth service", () => {
    beforeEach(() => {
        clearStoredAuth();
    });

    test("stores and reads auth payload", () => {
        const auth = {
            token: "token-123",
            user: { name: "Jane", permissions: ["employees.read"] },
        };

        setStoredAuth(auth);

        expect(getStoredAuth()).toEqual(auth);
        expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeTruthy();
    });

    test("returns null for invalid stored auth", () => {
        localStorage.setItem(AUTH_STORAGE_KEY, "{invalid-json");

        expect(getStoredAuth()).toBeNull();
    });

    test("checks permissions from auth payload", () => {
        const auth = {
            token: "token-123",
            user: { permissions: ["departments.read", "roles.read"] },
        };

        expect(hasPermission("departments.read", auth)).toBe(true);
        expect(hasPermission("departments.view", auth)).toBe(true);
        expect(hasPermission("employees.read", auth)).toBe(false);
        expect(hasPermission(null, auth)).toBe(true);
    });

    test("returns user permissions", () => {
        const auth = {
            user: { permissions: ["employees.read"] },
        };

        expect(getUserPermissions(auth)).toEqual(["employees.read"]);
        expect(getUserPermissions(null)).toEqual([]);
    });
});
