import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("arcdime_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("arcdime_token");
            localStorage.removeItem("arcdime_user");

            window.dispatchEvent(new Event("arcdime-auth-expired"));
        }

        return Promise.reject(error);
    }
);

export default api;