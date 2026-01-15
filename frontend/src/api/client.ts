import axios from "axios";

// Create ONE axios instance so every request shares the same base URL and settings.
export const api = axios.create({
  baseURL: "/api",
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response, // pass through successful responses unchanged
  (error) => {
    // Log error details for debugging
    console.error(
      "API error:",
      error?.response?.status,
      error?.response?.data ?? error.message
    );
    return Promise.reject(error); // rethrow so React Query sees it as an error
  }
);
