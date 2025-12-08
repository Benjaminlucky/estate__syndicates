// src/utils/api.js
import axios from "axios";

const origin = window.location.origin;
let BASE_URL = "";
let FRONTEND_URL = "";

/* ---------------------------------------------
   LOCAL DEVELOPMENT (Vite on port 5173)
---------------------------------------------- */
if (origin.includes("localhost:5173") || origin.includes("127.0.0.1:5173")) {
  BASE_URL = "http://localhost:5000"; // local backend
  FRONTEND_URL = "http://localhost:5173"; // local frontend
} else if (
  /* ---------------------------------------------
   PRODUCTION LIVE WEBSITE
---------------------------------------------- */
  origin.includes("estatesindicates.com") || // main domain
  origin.includes("www.estatesindicates.com") || // www version
  origin.includes("estatesyndicates.netlify.app") // Netlify (if used)
) {
  BASE_URL = "https://estate-syndicates.onrender.com"; // backend on Render
  FRONTEND_URL = "https://estatesindicates.com"; // production frontend
} else {
  /* ---------------------------------------------
   FALLBACK
---------------------------------------------- */
  BASE_URL = "https://estate-syndicates.onrender.com";
  FRONTEND_URL = "https://estatesindicates.com";
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export the URLs for use in other parts of the app
export const API_BASE_URL = BASE_URL;
export const FRONTEND_BASE_URL = FRONTEND_URL;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      return Promise.reject({
        isOffline: true,
        message: "No internet connection. Please check your network.",
      });
    }

    const token = localStorage.getItem("team_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.isOffline) {
      return Promise.reject(error);
    }

    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return Promise.reject({
          message: "Request timeout. Please try again.",
        });
      }
      return Promise.reject({
        message: "Network error. Unable to reach server.",
      });
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        localStorage.removeItem("team_token");
        if (!window.location.pathname.includes("/team/login")) {
          window.location.href = "/team/login";
        }
        break;
      case 403:
        error.message = data.message || "Access forbidden";
        break;
      case 404:
        error.message = data.message || "Resource not found";
        break;
      case 500:
        error.message = data.message || "Server error occurred";
        break;
      default:
        error.message = data.message || "An error occurred";
    }

    return Promise.reject(error);
  }
);

// Helper function to build frontend URLs
export const getFrontendUrl = (path = "") => {
  return `${FRONTEND_URL}${path}`;
};

// Helper functions
export const checkBackendHealth = async () => {
  try {
    const response = await api.get("/api/health");
    return { online: true, ...response.data };
  } catch (error) {
    return { online: false, error: error.message };
  }
};

export const isOnline = () => {
  return navigator.onLine;
};

export const setupNetworkListeners = (onOnline, onOffline) => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
};

// API Endpoints
export const teamAuth = {
  login: (credentials) => api.post("/api/auth/team/login", credentials),
  changePassword: (passwords) =>
    api.post("/api/team/team/change-password", passwords),
};

export const teamMembers = {
  getAll: () => api.get("/api/team"),
  getById: (id) => api.get(`/api/team/${id}`),
  create: (data) => api.post("/api/team", data),
  update: (id, data) => api.put(`/api/team/${id}`, data),
  delete: (id) => api.delete(`/api/team/${id}`),
  toggleStatus: (id) => api.patch(`/api/team/${id}/toggle-status`),
};

console.log("API USING:", BASE_URL);
console.log("FRONTEND URL:", FRONTEND_URL);

export default api;
