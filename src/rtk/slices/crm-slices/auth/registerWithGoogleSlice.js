// src/redux/slices/registerWithGoogleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserDashboard } from "../userDashboard/userDashboard";
import { apiBaseUrl1 } from "../../../../utils/config";

export const registerWithGoogle = createAsyncThunk(
  "auth/registerWithGoogle",
  async ({ email, first_name, register_type }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiBaseUrl1}/register-social`, {
        email,
        first_name,
        register_type,
      });

      const data = response.data;
      const token = data?.access_token;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        throw new Error("Token not received after login.");
      }

      // Fetch dashboard data
      const userDashboard = await dispatch(getUserDashboard(token)).unwrap();

      const { user, trade_accounts, deposits, withdrawals, commission } = userDashboard;

      // Set local user account if not already present
      // Overwrite even if user object exists but no account
      const localUser = JSON.parse(localStorage.getItem("user")) || {};
      if (!localUser?.account) {
        let selectedAccount = null;

        if (trade_accounts?.length === 1) {
          selectedAccount = trade_accounts[0]?.account;
        } else if (trade_accounts?.length > 1) {
          const latestAccount = trade_accounts.reduce((latest, account) =>
            new Date(account.created_at) > new Date(latest.created_at) ? account : latest,
            trade_accounts[0]
          );
          selectedAccount = latestAccount.account;
        }

        if (selectedAccount) {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...localUser, account: selectedAccount })
          );
        }
      }


      localStorage.setItem("crm-user", JSON.stringify({ user, trade_accounts, deposits, withdrawals, commission }));

      return { token, user };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const registerWithGoogleSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(registerWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = registerWithGoogleSlice.actions;
export default registerWithGoogleSlice.reducer;
