import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/apiClient";
import {
    clearStoredAuth,
    getStoredAuth,
    getUserPermissions,
    setStoredAuth,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(() => getStoredAuth());
    const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(getStoredAuth()?.token));
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = auth?.token;

        if (!token) {
            setIsCheckingAuth(false);
            setIsAuthenticated(false);
            return;
        }

        setIsCheckingAuth(true);

        apiClient
            .get("/user")
            .then((response) => {
                const nextAuth = { token, user: response.data };
                setStoredAuth(nextAuth);
                setAuth(nextAuth);
                setIsAuthenticated(true);
            })
            .catch(() => {
                clearStoredAuth();
                setAuth(null);
                setIsAuthenticated(false);
            })
            .finally(() => {
                setIsCheckingAuth(false);
            });
    }, [auth?.token]);

    const login = useCallback((authPayload) => {
        setStoredAuth(authPayload);
        setAuth(authPayload);
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
    }, []);

    const logout = useCallback(() => {
        clearStoredAuth();
        setAuth(null);
        setIsAuthenticated(false);
    }, []);

    const updateUser = useCallback((user) => {
        setAuth((current) => {
            if (!current?.token) {
                return current;
            }

            const nextAuth = { token: current.token, user };
            setStoredAuth(nextAuth);
            return nextAuth;
        });
    }, []);

    const hasPermission = useCallback(
        (permission) => {
            if (!permission) {
                return true;
            }

            return getUserPermissions(auth).includes(permission);
        },
        [auth]
    );

    const value = useMemo(
        () => ({
            user: auth?.user ?? null,
            token: auth?.token ?? null,
            isAuthenticated,
            isCheckingAuth,
            login,
            logout,
            updateUser,
            hasPermission,
        }),
        [auth, isAuthenticated, isCheckingAuth, login, logout, updateUser, hasPermission]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
