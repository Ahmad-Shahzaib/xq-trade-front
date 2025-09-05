import axios from "axios";
import { apiBaseUrl1, crmApiBaseUrl } from "../utils/config";

const axiosInstance = axios.create({
  baseURL: apiBaseUrl1,
});

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle Unauthorized Errors (401)
axiosInstance.interceptors.response.use(
  (response) => response, // If response is OK, return it
  (error) => {
    if (error.response && error.response.status === 401) {
       localStorage.removeItem("token");
      // Import handleLogout inside the function to avoid circular dependency
      // import("../utils/menuUtils").then(({ handleLogout }) => {
      //   handleLogout(); // Logout the user
      //   localStorage.removeItem("token"); // Clear token
      //   // window.location.href = "/login"; // Redirect to login page
      // });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
