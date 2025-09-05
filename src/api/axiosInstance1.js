import axios from "axios";
import { crmApiBaseUrl } from "../utils/config";

const axiosInstance1 = axios.create({
  baseURL: "https://www.portal.xqtrades.com/api",
});

// Attach token to requests
axiosInstance1.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle Unauthorized Errors (401)
axiosInstance1.interceptors.response.use(
  (response) => response, // If response is OK, return it
  (error) => {
    if (error.response && error.response.status === 401) {
      // Import handleLogout inside the function to avoid circular dependency
      import("../utils/menuUtils").then(({ handleLogout }) => {
        handleLogout(); // Logout the user
        localStorage.removeItem("token"); // Clear token
        // window.location.href = "/login"; // Redirect to login page
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance1;
