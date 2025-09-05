import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosInstance';
import { token } from '../../../../utils/config';

export const depositStepOneSubmit = createAsyncThunk(
    'depositStepOne/depositStepOneSubmit',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(
          '/deposit/create',
          credentials,
          {
            headers: {
              barrier: token, // Add the token here as the `barrier`
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('Deposit step one API error:', error);
        return rejectWithValue(error.response ? error.response.data : 'Network error');
      }
    }
  );



  const depositStepOne = createSlice({
    name: 'depositStepOne',
    initialState: {
      loading: false,
      successMessage: null,
      errorMessage: null,
    },
    reducers: {
      clearMessages: (state) => {
        state.successMessage = null;
        state.errorMessage = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(depositStepOneSubmit.pending, (state) => {
          state.loading = true;
          state.successMessage = null;
          state.errorMessage = null;
        })
        .addCase(depositStepOneSubmit.fulfilled, (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message; // Show success message
        })
        .addCase(depositStepOneSubmit.rejected, (state, action) => {
          state.loading = false;
          state.errorMessage = action.payload || 'An error occurred'; // Show error message
        });
    },
  });
  
  export const { clearMessages } = depositStepOne.actions;
  export default depositStepOne.reducer;