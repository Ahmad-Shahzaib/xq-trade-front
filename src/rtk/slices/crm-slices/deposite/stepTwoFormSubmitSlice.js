import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosInstance';
import { token } from '../../../../utils/config';


export const depositStepTwoSubmit = createAsyncThunk(
    'depositStepTwo/depositStepTwoSubmit',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(
          '/deposit/confirm',
          credentials,
          {
            headers: {
              barrier: token, // Add the token here as the `barrier`
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('deposit step two API error:', error);
        return rejectWithValue(error.response ? error.response.data : 'Network error');
      }
    }
  );

    const depositStepTwo = createSlice({
      name: 'depositStepTwo',
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
          .addCase(depositStepTwoSubmit.pending, (state) => {
            state.loading = true;
            state.successMessage = null;
            state.errorMessage = null;
          })
          .addCase(depositStepTwoSubmit.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload.message; // Show success message
          })
          .addCase(depositStepTwoSubmit.rejected, (state, action) => {
            state.loading = false;
            state.errorMessage = action.payload || 'An error occurred'; // Show error message
          });
      },
    });
    
    export const { clearMessages } = depositStepTwo.actions;
    export default depositStepTwo.reducer;