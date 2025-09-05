import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance1 from '../../../../api/axiosInstance1';



export const submitKycForm  = createAsyncThunk(
  'kyc/submitKycForm',
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance1.post('/kyc-form-submit', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('KYC API error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.error('Network error:', error);
        return rejectWithValue('Network error');
      }
    }
  }
);

const kycSubmitSlice = createSlice({
    name: 'kycSubmit',
    initialState: {
      loading: false,
      success: false,
      error: null,
    },
    reducers: {
      resetKycSubmission: (state) => {
        state.loading = false;
        state.success = false;
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(submitKycForm.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = null;
        })
        .addCase(submitKycForm.fulfilled, (state) => {
          state.loading = false;
          state.success = true;
          state.error = null;
        })
        .addCase(submitKycForm.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { resetKycSubmission } = kycSubmitSlice.actions;
  export default kycSubmitSlice.reducer;
