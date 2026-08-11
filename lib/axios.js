import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ============================
// Request Interceptor
// ============================

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // FormData ke case me browser ko
    // Content-Type automatically set karne do
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================
// Response Interceptor
// ============================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;

      // Token expired / unauthorized
      if (status === 401) {
        // Remove expired token
        localStorage.removeItem("token");

        // Login page par redirect
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;