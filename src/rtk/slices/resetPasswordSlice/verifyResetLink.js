
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

export const verifyResetLink = createAsyncThunk(
  'reset/verifyResetLink',
  async ({ email, code }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/reset-verification', { email, code });
      // console.log('verifyResetLink',res.data); // Removed console.log
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Network error');
    }
  }
);

const verifyResetLinkSlice = createSlice({
  name: 'verifyResetLink',
  initialState: {
    loading: false,
    verified: false,
    message: '',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyResetLink.pending, (state) => {
        state.loading = true;
        state.verified = false;
        state.error = null;
      })
      .addCase(verifyResetLink.fulfilled, (state, action) => {
        state.loading = false;
        state.verified = action.payload.status;
        state.message = action.payload.message;
      })
      .addCase(verifyResetLink.rejected, (state, action) => {
        state.loading = false;
        state.verified = false;
        state.error = action.payload;
      });
  },
});

export default verifyResetLinkSlice.reducer;

