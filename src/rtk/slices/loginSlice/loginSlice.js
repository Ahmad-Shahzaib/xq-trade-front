// src/features/loginSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl, apiKey } from '../../../utils/config';

export const loginUser = createAsyncThunk('login/loginUser', async (credentials) => {
    try {
        const response = await axios.post(`${apiBaseUrl}/login`, {
            api_key: apiKey,
            // account: credentials.account,
            // password: credentials.password,
            account: credentials.account,
            password: credentials.password,
        });
        
        // Log the response for debugging
        // console.log("Login Response:", response.data); // Removed console.log
        
        // Return the response directly if the login is successful
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data : error.message);
    }
});

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        // Add the resetLoginFlag reducer
        resetLoginFlag: (state) => {
            state.error = null;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Create an object that holds both user and account information
                    const userData = {
                        ...action.payload, // Assuming action.payload contains user data
                        account: action.meta.arg.account, // Add the account info here
                    };
            
                    // Store user data in local storage
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    // Handle the successful login
                    state.user = userData; // Save user data directly
                    state.error = null;
                } else {
                    // Handle other cases if needed
                    state.error = "Login failed, please check your credentials.";
                }
            })
            
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { resetLoginFlag } = loginSlice.actions; // Export the new action

export default loginSlice.reducer;

