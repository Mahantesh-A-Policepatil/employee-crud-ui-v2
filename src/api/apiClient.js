import axios from "axios";
import { getStoredAuth } from "../services/auth";

export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const auth = getStoredAuth();

    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }

    return config;
});

export function getSafeApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
    const message = error.response?.data?.message || "";
    const validationErrors = error.response?.data?.errors;
    const status = error.response?.status;
    const unsafeServerMessage =
        /SQLSTATE|SQL:|select\s+\*|insert\s+into|update\s+`?|delete\s+from|where\s+`?|Connection refused|target machine actively refused/i.test(message);

    if (!error.response || status >= 500 || unsafeServerMessage) {
        return "Unable to connect to the service. Please start XAMPP/MySQL and try again.";
    }

    if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        if (firstError) {
            return firstError;
        }
    }

    return message || fallback;
}

export default apiClient;
