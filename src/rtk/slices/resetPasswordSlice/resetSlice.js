import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk
export const resetPassword = createAsyncThunk(
  'reset/resetPassword',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reset', credentials);
      // console.log('reset form ', response.data); // Removed console.log
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Network error'
      );
    }
  }
);

// Slice
const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    loading: false,
    successMessage: '',
    errorMessage: '',
  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = '';
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.errorMessage = '';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = '';
        state.errorMessage =
          typeof action.payload === 'string'
            ? action.payload
            : action.payload.message || 'Something went wrong';
      });
  },
});

export const { clearMessages } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;