import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiBaseUrl1 } from "../../../utils/config"; // Adjust API base URL accordingly

// ✅ Async Thunk to fetch FAQs from API
export const fetchFaqs = createAsyncThunk(
    "faqs/fetchFaqs",
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem("token"); // ✅ Get token from localStorage
  
        const response = await axios.get(`${apiBaseUrl1}/faqs`, {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Send token in headers
          },
        });
  
        return response.data.faqs; // ✅ Extract only the `faqs` array
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );
  

// ✅ Initial state
const initialState = {
  faqs: [],
  loading: false,
  error: null,
};

// ✅ Redux Slice
const faqsSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload; // ✅ Store fetched FAQs
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch FAQs";
      });
  },
});

// ✅ Export reducer
export default faqsSlice.reducer;
