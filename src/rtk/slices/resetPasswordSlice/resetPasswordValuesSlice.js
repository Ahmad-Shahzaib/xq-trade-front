import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk
export const resetPasswordValues = createAsyncThunk(
  'reset/resetPasswordValues',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reset-password', credentials);
      console.log('reset form ', response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : 'Network error'
      );
    }
  }
);

// Slice
const resetPasswordValuesSlice = createSlice({
  name: 'resetPasswordValues',
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
      .addCase(resetPasswordValues.pending, (state) => {
        state.loading = true;
        state.successMessage = '';
        state.errorMessage = '';
      })
      .addCase(resetPasswordValues.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.errorMessage = '';
      })
      .addCase(resetPasswordValues.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = '';
        state.errorMessage =
          typeof action.payload === 'string'
            ? action.payload
            : action.payload.message || 'Something went wrong';
      });
  },
});

export const { clearMessages } = resetPasswordValuesSlice.actions;

export default resetPasswordValuesSlice.reducer;
