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
            user: { name: "Jane", permissions: ["employees.view"] },
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
            user: { permissions: ["departments.view", "roles.view"] },
        };

        expect(hasPermission("departments.view", auth)).toBe(true);
        expect(hasPermission("employees.view", auth)).toBe(false);
        expect(hasPermission(null, auth)).toBe(true);
    });

    test("returns user permissions", () => {
        const auth = {
            user: { permissions: ["employees.view"] },
        };

        expect(getUserPermissions(auth)).toEqual(["employees.view"]);
        expect(getUserPermissions(null)).toEqual([]);
    });
});
