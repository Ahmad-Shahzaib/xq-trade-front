import axios from "axios";
import { resetLoginFlag } from "../rtk/slices/loginSlice/loginSlice";

/**
 * Common logout handler
 * @param {function} dispatch - Redux dispatch function
 * @param {function} navigate - Navigation function from react-router
 */
export const handleLogout = async (dispatch, navigate) => {
    console.log("Logging out...");

    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No token found, logging out locally.");
        cleanUpAndRedirect(dispatch, navigate);
        return;
    }

    try {
        const response = await axios.get(
            "https://www.portal.xqtrades.com/api/logout", {
              
                headers: {
                    Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
                    Accept: "application/json", // ✅ Ensure API accepts JSON
                },
            }
        );

        console.log("Logout API successful:", response.data);
    } catch (error) {
        console.error("Logout API failed:", error.response?.data || error.message);
    } finally {
        cleanUpAndRedirect(dispatch, navigate);
    }
};

/**
 * Helper function to clear user data and redirect to login
 */
const cleanUpAndRedirect = (dispatch, navigate) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("crm-user");
    localStorage.removeItem("selectedAccount");

    dispatch(resetLoginFlag());
    // window.location.reload();
    navigate("/login", { replace: true });

    console.log("User logged out and redirected to login.");
};
