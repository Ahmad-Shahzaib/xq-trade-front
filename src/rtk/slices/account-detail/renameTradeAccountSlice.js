import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiBaseUrl1, token } from '../../../utils/config';

export const renameTradeAccount = createAsyncThunk(
    'renameTradeAccount/rename',
    async ({ id, name }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${apiBaseUrl1}/trade-accounts-update/${id}`,
                { name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const renameTradeAccountSlice = createSlice({
    name: 'renameTradeAccount',
    initialState: {
        renameStatus: null,
        renameError: null,
    },
    reducers: {
        resetRenameState: (state) => {
            state.renameStatus = null;
            state.renameError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(renameTradeAccount.pending, (state) => {
                state.renameStatus = 'loading';
            })
            .addCase(renameTradeAccount.fulfilled, (state, action) => {
                state.renameStatus = 'succeeded';
                state.renameError = null;

                // Get the new name and ID of the renamed account
                const { id, name } = action.payload;

                // Get the selectedAccount from localStorage
                const selectedAccount = JSON.parse(localStorage.getItem('selectedAccount'));

                // If the renamed account is the selected one, update only the name
                if (selectedAccount && selectedAccount.id === id) {
                    selectedAccount.name = name;
                    localStorage.setItem('selectedAccount', JSON.stringify(selectedAccount));
                }
            })

            .addCase(renameTradeAccount.rejected, (state, action) => {
                state.renameStatus = 'failed';
                state.renameError = action.payload || 'Rename failed';
            });
    }
});

export const { resetRenameState } = renameTradeAccountSlice.actions;
export default renameTradeAccountSlice.reducer;
