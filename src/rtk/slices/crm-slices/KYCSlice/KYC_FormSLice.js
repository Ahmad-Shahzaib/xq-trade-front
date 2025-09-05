import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance1 from '../../../../api/axiosInstance1';

// Async thunk to fetch KYC form data
export const createKyc = createAsyncThunk(
  'kyc/createKyc',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance1.get('/kyc-form-status', {
        headers: {
          Authorization: `Bearer ${token}`,
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

// Initial state
const initialState = {
  loading: false,
  errorKycForm: null,
  pageTitle: '',
  form: null, // or {} if you prefer
};

// Slice
const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    resetKycForm: (state) => {
      state.loading = false;
      state.errorKycForm = null;
      state.pageTitle = '';
      state.form = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createKyc.pending, (state) => {
        state.loading = true;
        state.errorKycForm = null;
      })
      .addCase(createKyc.fulfilled, (state, action) => {
        state.loading = false;
        state.pageTitle = action.payload.pageTitle;
        state.form = action.payload.form;
      })
      .addCase(createKyc.rejected, (state, action) => {
        state.loading = false;
        state.errorKycForm = action.payload || 'Something went wrong';
      });
  },
});

export const { resetKycForm } = kycSlice.actions;

export default kycSlice.reducer;
