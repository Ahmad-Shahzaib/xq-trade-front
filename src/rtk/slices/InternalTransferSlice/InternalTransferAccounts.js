import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance"; 

export const createInternalTransferAccounts = createAsyncThunk(
    'internalTransferAccounts/fetchInternalTransferAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axiosInstance.get('/internal-transfer-create', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;  
        } catch (error) {
            if (error.response) {
                console.error('internalTransferAccounts API error:', error.response.data);
                return rejectWithValue(error.response.data);
            } else {
                console.error('Network error:', error);
                return rejectWithValue('Network error');
            }
        }
    }
);

const internalTransferAccountsSlice = createSlice({
    name: "internalTransferAccounts",
    initialState: {
        fromAccounts: [],
        toAccounts: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createInternalTransferAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createInternalTransferAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.fromAccounts = action.payload.from || [];
                state.toAccounts = action.payload.to || [];
            })
            .addCase(createInternalTransferAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default internalTransferAccountsSlice.reducer;
