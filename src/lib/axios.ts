import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { store } from "../store";
import { logout, setToken } from "../store/userSlice";
import RESPONSE_STATUSES from "../constants/responseStatuses";
import BACKEND_RESOURCES from "../constants/backendResources";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
    _skipRefresh?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// After login, set the access token
export const setAccessToken = (token: string) => {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  store.dispatch(setToken(token));
};

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: string | null) => void;
  reject: (reason?: AxiosError) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Skip refresh logic for login, register, or refresh endpoints
const authExcludedEndpoints = [
  `${BACKEND_RESOURCES.AUTH}/login`,
  `${BACKEND_RESOURCES.AUTH}/signup`,
  `${BACKEND_RESOURCES.AUTH}/refresh-token`,
  `${BACKEND_RESOURCES.AUTH}/forgot-password`,
  `${BACKEND_RESOURCES.AUTH}/reset-password`,
];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Only retry once and only for 401s

    if (
      error.response?.status === RESPONSE_STATUSES.UNAUTHORIZED &&
      !originalRequest._retry &&
      !originalRequest._skipRefresh && // Check for skip flag
      !authExcludedEndpoints.some((endpoint) =>
        originalRequest.url?.includes(endpoint)
      )
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Create a separate request config for refresh to avoid interference
        const refreshConfig = {
          method: "get",
          url: `${BACKEND_RESOURCES.AUTH}/refresh-token`,
          _skipRefresh: true, // Prevent this request from triggering refresh logic
        };

        // This request will send the refresh token via cookie automatically
        const res = await axiosInstance.request(refreshConfig);

        const newAccessToken = res.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // Set new token to headers for retry
        setAccessToken(newAccessToken);

        // Fix potential undefined originalRequest.headers
        originalRequest.headers = originalRequest.headers || {};

        // Then, assigning the new access token value to authorization header
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry original request with new token
        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError, null);

        if (axios.isAxiosError(refreshErr)) {
          const message =
            refreshErr.response?.data?.message ||
            "Session expired. Please login again.";
          toast(message); // if using something like react-toastify
        }

        store.dispatch(logout());

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Optional: Add request interceptor to ensure token is always set
axiosInstance.interceptors.request.use(
  (config) => {
    // Get current token from store if not already set
    const state = store.getState();
    const token = state.user.accessToken; // Adjust based on your store structure

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
