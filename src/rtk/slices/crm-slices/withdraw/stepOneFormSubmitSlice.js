import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../../api/axiosInstance';
import { token } from '../../../../utils/config'; // Assuming `token` is exported from this file

export const stepOneSubmit = createAsyncThunk(
  'withdrawStepOne/stepOneSubmit',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        '/withdraw/create',
        credentials,
        {
          headers: {
            barrier: token, // Add the token here as the `barrier`
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Withdrawal step one API error:', error);
      return rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

const withdrawStepOne = createSlice({
  name: 'withdrawStepOne',
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
      .addCase(stepOneSubmit.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.errorMessage = null;
      })
      .addCase(stepOneSubmit.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Show success message
      })
      .addCase(stepOneSubmit.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'An error occurred'; // Show error message
      });
  },
});

export const { clearMessages } = withdrawStepOne.actions;
export default withdrawStepOne.reducer;
