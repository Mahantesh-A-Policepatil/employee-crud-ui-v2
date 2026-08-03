import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import apiClient from "../api/apiClient";
import {
  clearStoredAuth,
  getStoredAuth,
  hasPermission as userHasPermission,
  setStoredAuth,
} from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [isCheckingAuth, setIsCheckingAuth] = useState(
    Boolean(getStoredAuth()?.token),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [navigation, setNavigation] = useState([]);
  const [isNavigationLoading, setIsNavigationLoading] = useState(
    Boolean(getStoredAuth()?.token),
  );

  useEffect(() => {
    const token = auth?.token;

    if (!token) {
      setIsCheckingAuth(false);
      setIsAuthenticated(false);
      setNavigation([]);
      setIsNavigationLoading(false);
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

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setIsNavigationLoading(true);

    apiClient
      .get("/navigation")
      .then((response) => setNavigation(response.data))
      .catch(() => setNavigation([]))
      .finally(() => setIsNavigationLoading(false));
  }, [isAuthenticated]);

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
    setNavigation([]);
    setIsNavigationLoading(false);
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

      return userHasPermission(permission, auth);
    },
    [auth],
  );

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated,
      isCheckingAuth,
      navigation,
      isNavigationLoading,
      login,
      logout,
      updateUser,
      hasPermission,
    }),
    [
      auth,
      isAuthenticated,
      isCheckingAuth,
      navigation,
      isNavigationLoading,
      login,
      logout,
      updateUser,
      hasPermission,
    ],
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
