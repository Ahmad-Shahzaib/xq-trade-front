// src/slices/registerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosInstance';


// Async action to handle user registration
export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      // Save token in localStorage
      localStorage.setItem('token', response.data.access_token);
      const tradeAccount = response.data?.trade_accounts;
      const user = response.data?.user;
      if (Array.isArray(tradeAccount) && tradeAccount.length > 0) {
        localStorage.setItem('selectedAccount', JSON.stringify(tradeAccount[0]));
      }
      localStorage.setItem('crm-user', JSON.stringify({ user }));

      return response.data;
    } catch (error) {
      console.error("register error", error.response.data);

      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        return rejectWithValue({ message, errors });
      }
      return rejectWithValue({ message: 'An unexpected error occurred' });
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState: {
    user: null,
    token: null,
    tradeAccount: null,
    loading: false,
    errorMessage: '',
    fieldErrors: {},
  },
  reducers: {
    clearRegisterState: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    clearErrors: (state) => {
      state.errorMessage = '';
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
        state.fieldErrors = {};
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.tradeAccount = action.payload?.tradeAccount || null;
        state.errorMessage = '';
        state.fieldErrors = {};

        // localStorage.setItem('selectedAccount', JSON.stringify(state.tradeAccount[0]));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
        state.fieldErrors = action.payload.errors || {};
      });
  },
});

export const { clearRegisterState, clearErrors } = registerSlice.actions;
export default registerSlice.reducer;
