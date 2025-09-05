import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosInstance';
import { token } from '../../../../utils/config'; // Assuming `token` is exported from this file

export const stepTwoSubmit = createAsyncThunk(
    'withdrawStepTwo/stepTwoSubmit',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(
          '/withdraw/submit',
          credentials,
          {
            headers: {
              barrier: token, // Add the token here as the `barrier`
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error('Withdrawal step two API error:', error);
        return rejectWithValue(error.response ? error.response.data : 'Network error');
      }
    }
  );


  const withdrawStepTwoSlice = createSlice({
    name: 'withdrawStepTwo',
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
        .addCase(stepTwoSubmit.pending, (state) => {
          state.loading = true;
          state.successMessage = null;
          state.errorMessage = null;
        })
        .addCase(stepTwoSubmit.fulfilled, (state, action) => {
          state.loading = false;
          state.successMessage = action.payload.message; // Show success message
        })
        .addCase(stepTwoSubmit.rejected, (state, action) => {
          state.loading = false;
          state.errorMessage = action.payload || 'An error occurred'; // Show error message
        });
    },
  });
  
  export const { clearMessages } = withdrawStepTwoSlice.actions;
  export default withdrawStepTwoSlice.reducer;
  