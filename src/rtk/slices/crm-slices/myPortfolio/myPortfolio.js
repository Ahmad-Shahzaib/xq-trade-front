import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    totalDeposit: 0,
    completedDeposit: 0,
    pendingDeposit: 0,
    totalWithdrawal: 0,
    processedWithdrawal: 0,
    pendingWithdrawal: 0,
};

const myPortfolioSlice = createSlice({
    name: 'myPortfolio',
    initialState,
    reducers: {
        updateDepositSummary: (state, action) => {
            state.totalDeposit = action.payload.totalDeposit;
            state.completedDeposit = action.payload.completedDeposit;
            state.pendingDeposit = action.payload.pendingDeposit;
        },
        updateWithdrawalSummary: (state, action) => {
            state.totalWithdrawal = action.payload.totalWithdrawal;
            state.processedWithdrawal = action.payload.processedWithdrawal;
            state.pendingWithdrawal = action.payload.pendingWithdrawal;
        },
    },
});

export const { updateDepositSummary, updateWithdrawalSummary } = myPortfolioSlice.actions;
export default myPortfolioSlice.reducer;
