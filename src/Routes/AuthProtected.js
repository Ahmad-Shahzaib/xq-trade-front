// AuthProtected.js
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { loginUser } from '../rtk/slices/crm-slices/auth/authSlice';
import { getUserDashboard } from '../rtk/slices/crm-slices/userDashboard/userDashboard';

const AuthProtected = (props) => {
    const isLocked = useSelector((state) => state.lock.isLocked); // Get lock status from Redux
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const  initialValues = {
        email: "test@test.com",
        password: "12345678",
    }
    const handleSubmit = async (values) => {
            try {
                let token = localStorage.getItem("token");
    
                // Step 1: Login if no token exists
                if (!token) {
                    const response = await dispatch(loginUser(values)).unwrap(); // Wait for login response
                    token = response?.access_token; // Assuming the loginUser action returns the token
                    if (token) {
                        localStorage.setItem("token", token);
                    } else {
                        throw new Error("Token not received after login.");
                    }
                }
    
                // Step 2: Fetch userDashboard data
                const userDashboardResponse = await dispatch(getUserDashboard(token)).unwrap(); // Wait for userDashboard response
                const { user, trade_accounts, deposits, withdrawals, commission } = userDashboardResponse;
    
                // Step 3: Handle trade accounts logic
                const crmuser = JSON.parse(localStorage.getItem('crm-user')) || {};
                const localUser = JSON.parse(localStorage.getItem('user')) || {};
    
                if (!localUser?.account) {
                    if (trade_accounts?.length === 1) {
                        // Single trade account
                        const account = trade_accounts[0]?.account;
                        localStorage.setItem('user', JSON.stringify({ account }));
                    } else if (trade_accounts?.length > 1) {
                        // Multiple trade accounts
                        const latestAccount = trade_accounts.reduce((latest, account) => {
                            return new Date(account.created_at) > new Date(latest.created_at) ? account : latest;
                        }, trade_accounts[0]);
    
                        localStorage.setItem('user', JSON.stringify({ account: latestAccount.account }));
                    }
                }
    
                // Step 4: Store userDashboard data in localStorage
                localStorage.setItem('crm-user', JSON.stringify({ user, trade_accounts, deposits, withdrawals, commission }));
    
                // Step 5: Navigate to dashboard
                if (localStorage.getItem('user')) {
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error("Login error:", error);
            }
        };

    // Function to check if user is in local storage
    const isUserAuthenticated = () => {
        // const user = JSON.parse(localStorage.getItem('user'));
        // return user && user.account;
        const token = localStorage.getItem('token');
        return token;
    };

    // If user is not authenticated, redirect to login page
    // if (!isUserAuthenticated()) {
    //     handleSubmit(initialValues)
    // }

    if (!isUserAuthenticated()) {
        return <Navigate to="/login" />;
    }

    // If screen is locked, redirect to lock screen
    if (isLocked || localStorage.getItem('isLocked') === 'true') {
        return <Navigate to="/auth-lockscreen-basic" />;
    }

    return <>{props.children}</>;
};

export default AuthProtected;
