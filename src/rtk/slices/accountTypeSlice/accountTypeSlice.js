import { createSlice } from "@reduxjs/toolkit";
import pusher from "../../../helpers/pusher";
import { removePendingTrade } from "../binaryTradeHistorySlice/binaryTradeHistorySlice";


const initialState = {
    selectedAccount: null,  // No account selected initially
    isModalOpen: false,
    tradeAccounts: [], // Store fetched trade accounts here
    latestOrderResult: null,
    latestClosedOrder: null,
    closedOrder:null

};

const accountTypeSlice = createSlice({
    name: "accountType",
    initialState,
    reducers: {
        setSelectedAccount: (state, action) => {
            state.selectedAccount = action.payload;
        },
        toggleModal: (state) => {
            state.isModalOpen = !state.isModalOpen;
        },
        setTradeAccounts: (state, action) => {
            state.tradeAccounts = action.payload;

            // If selectedAccount exists, find the updated version from tradeAccounts
            if (state.selectedAccount) {
                const updatedAccount = action.payload.find(acc => acc.id === state.selectedAccount.id);

                if (updatedAccount) {
                    // If balance is different, update selectedAccount in Redux and localStorage
                    if (updatedAccount.balance !== state.selectedAccount.balance) {
                        // console.log("Balance mismatch, updating selectedAccount..."); // Removed console.log
                        state.selectedAccount = updatedAccount;
                        localStorage.setItem("selectedAccount", JSON.stringify(updatedAccount));
                    }
                }
            }

            // If no selectedAccount, set the first available account
            if (!state.selectedAccount && action.payload.length > 0) {
                state.selectedAccount = action.payload[0];
            }
        },

        updateSelectedAccountBalance: (state, action) => {
            if (state.selectedAccount) {
                state.selectedAccount.balance -= action.payload;
            }
            const accountIndex = state.tradeAccounts.findIndex(acc => acc.id === state.selectedAccount?.id);
            if (accountIndex !== -1) {
                state.tradeAccounts[accountIndex] = {
                    ...state.tradeAccounts[accountIndex],
                    balance: state.tradeAccounts[accountIndex].balance - action.payload
                };
            }
        },
        deductBalanceImmediately: (state, action) => {
            if (state.selectedAccount) {
                state.selectedAccount.balance -= action.payload;
            }
            const accountIndex = state.tradeAccounts.findIndex(acc => acc.id === state.selectedAccount?.id);
            if (accountIndex !== -1) {
                state.tradeAccounts[accountIndex] = {
                    ...state.tradeAccounts[accountIndex],
                    balance: state.tradeAccounts[accountIndex].balance - action.payload
                };
            }
        },
        refundBalance: (state, action) => {
            if (state.selectedAccount) {
                state.selectedAccount.balance += action.payload;
            }
            const accountIndex = state.tradeAccounts.findIndex(acc => acc.id === state.selectedAccount?.id);
            if (accountIndex !== -1) {
                state.tradeAccounts[accountIndex] = {
                    ...state.tradeAccounts[accountIndex],
                    balance: state.tradeAccounts[accountIndex].balance + action.payload
                };
            }
        },
        updateBalanceFromPusher: (state, action) => {
            const { id, balance, order } = action.payload;

            if (state.selectedAccount?.id === id) {
                state.selectedAccount.balance = balance;

                // ✅ Update `selectedAccount` in localStorage
                const updatedSelectedAccount = { ...state.selectedAccount, balance };
                localStorage.setItem("selectedAccount", JSON.stringify(updatedSelectedAccount));
            }

            state.tradeAccounts = state.tradeAccounts.map((acc) =>
                acc.id === id ? { ...acc, balance } : acc
            );

            state.latestOrderResult = order?.result || null;
        },

        clearLatestOrderResult: (state) => {
            state.latestOrderResult = null; // ✅ Clears the result after it has been displayed
        },

        setLatestClosedOrder: (state, action) => {
            state.latestClosedOrder = action.payload;
        },
        clearLatestClosedOrder: (state) => {
            state.latestClosedOrder = null;
        },
        setClosedOrder:(state,action)=>{
            state.closedOrder = action.payload
        },
        clearClosedOrder:(state)=>{
            state.closedOrder = null

        }

    },
});

export const {
    setSelectedAccount,
    toggleModal,
    setTradeAccounts,
    updateSelectedAccountBalance,
    deductBalanceImmediately,
    refundBalance,
    updateBalanceFromPusher,
    clearLatestOrderResult,
    setLatestClosedOrder,
    clearLatestClosedOrder,
    setClosedOrder,
    clearClosedOrder
} = accountTypeSlice.actions;
export default accountTypeSlice.reducer;


// 🔹 Listen for Pusher event
export const listenForOrderCloseUpdates = (id) => (dispatch) => {
    const channel = pusher.subscribe(`order-channel-${id}`);
    channel.bind("order-close", (data) => {
        // console.log(`Pusher triggered at id ${id}`);

        // console.log("Order Closed Event Received:", data); // Removed console.log
        dispatch(setClosedOrder(data.order))
        dispatch(updateBalanceFromPusher({ id: data.account_id, balance: data.balance, order: data.order, }));

        // If the type is  "order_completed", remove from pending orders
        if (data.type === "pending_order_executed") {
            dispatch(removePendingTrade(data.order.id));
            dispatch(setLatestClosedOrder(data.order));
        }
    });
};

