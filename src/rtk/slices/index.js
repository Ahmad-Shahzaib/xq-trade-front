import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";


//Crypto
import CryptoReducer from "./crypto/reducer";


// projectSLices 
import priceTradingSlice from "./priceTradingSlice/priceTradingSlice";
import orderReducer from './orderSlice/orderSlice'
import loginReducer from './loginSlice/loginSlice'
import openPositionsReducer  from './openPositionsSlice/openPositionsSlice'
import lockReducer  from './lockSlice/lockSlice'
import accountDetailsReducer from './account-detail/accountDetailSlice'
import orderCloseReducer  from './orderCloseSlice/orderCloseSlice'
import historyReducer  from './historySlice/historySlice'
import filterReducer from './filterSlice/filterSlice'
import tradingReducer from "./tradingSlice/tradingSlice"
import pendingOrderReducer from './pendingOrderSlice/pendingOrderSlice'
import getPendingOrdersReducer  from './getPendingOrderSlice/getPendingOrderSlice'
import cancelPendingOrderReducer from './pendingOrderSlice/cancelPendingOrderSlice'
import updatePendingOrderReducer from './pendingOrderSlice/updatePendingOrderSlice'
import marketDataReducer from './marketDataSlice/marketDataSlice'
import marketDataHistoryReducer from './marketDataHistorySlice/marketDataHistorySlice'
import binaryTradeHistoryReducer  from './binaryTradeHistorySlice/binaryTradeHistorySlice'
import transactionsHistoryReducer from './transactionsListSlice/transactionsListSlice'
import renameTradeAccountReducer from './account-detail/renameTradeAccountSlice'



// crm reducers 
import authReducer from './crm-slices/auth/authSlice'
import registerReducer from './crm-slices/auth/registerSlice';
import updateProfileReducer from './crm-slices/user/updateProfileSlice'
import userReducer from './crm-slices/user/getUserSlice'
import depositListReducer from './crm-slices/deposite/depositeListSlice';
import tradeAccountsListReducer from './crm-slices/trade/tradeAccountsList'
import tradeGroupsReducer from './crm-slices/trade/tradeGroups'
import newTradingAccountReducer from './crm-slices/trade/newTradingAccountSlice'
import withdrawReducer from './crm-slices/withdraw/getWithdrawFormSlice'
import withdrawStepOneReducer from './crm-slices/withdraw/stepOneFormSubmitSlice'
import withdrawStepTwoReducer from './crm-slices/withdraw/stepTwoFormSubmitSlice'
import withdrawalListReducer from './crm-slices/withdraw/withdrawalListSlice'
import depositReducer from './crm-slices/deposite/getDepositeFormSlice'
import depositStepOneReducer from './crm-slices/deposite/stepOneFormSubmitSlice'
import depositStepTwoReducer from './crm-slices/deposite/stepTwoFormSubmitSlice'
import myPortfolioReducer from './crm-slices/myPortfolio/myPortfolio'
import tradingAccountListReducer from './crm-slices/tradingAccountListSlice/tradingAccountListSlice'
import userDashboardReducer from './crm-slices/userDashboard/userDashboard'
import myReferralsReducer from './crm-slices/myReferralsSlice/myReferralsSlice'
import accountTypeReducer from './accountTypeSlice/accountTypeSlice'
import walletListReducer from './walletListSlice/walletListSlice'
import faqsReducer from './faqSlice/faqSlice'
import tawkReducer from './tawkSlice/tawkSlice'
import ticketListReducer  from './supportTicketSlices/ticketListSlice'
import supportTicketReducer from './supportTicketSlices/createSupportTicketSlice'
import ticketShowReducer from './supportTicketSlices/ticketShowSlice'
import replyTicketReducer  from './supportTicketSlices/replyTicketSlice'
import symbolsReducer from './fetchSymbolsSlice/fetchSymbolsSlice'
import internalTransferAccountsReducer from './InternalTransferSlice/InternalTransferAccounts'
import internalTransferReducer from './InternalTransferSlice/createInternalTransfer'
import internalTransferListReducer from './InternalTransferSlice/listInternalTransfer'
import pinLockReducer from './pinLockSlice/pinLockSlice';
import platformSettingsReducer from './platformSettingsSlice/platformSettingsSlice'
import ibStatusReducer from './IBComission/GetIBSlice'
import marketReducer from './MarketAndEventsSlice/GetMarketSlice'
import eventReducer from './MarketAndEventsSlice/GetEventsSlice'
import kycReducer from './crm-slices/KYCSlice/KYC_FormSLice'
import kycSubmitReducer from './crm-slices/KYCSlice/KYC_SubmitSlice'
import checkReferralReducer  from './checkReferralSlice/checkReferralSlice'
import resetPasswordReducer from './resetPasswordSlice/resetSlice'
import verifyResetLinkReducer from './resetPasswordSlice/verifyResetLink'
import resetPasswordValuesReducer from './resetPasswordSlice/resetPasswordValuesSlice'
import getAllSymbolsReducer from './crm-slices/allSymbols/getAllSymbolsSlice'

import registerWithGoogleSlice from './crm-slices/auth/registerWithGoogleSlice';

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    PriceTrading:priceTradingSlice,
    order:orderReducer,
    login: loginReducer,
    openPositions: openPositionsReducer,
    lock: lockReducer,
    accountDetails:accountDetailsReducer,
    orderClose: orderCloseReducer,
    history: historyReducer,
    filter: filterReducer,
    trading: tradingReducer,
    pendingOrder:pendingOrderReducer,
    getPendingOrders: getPendingOrdersReducer,
    cancelPendingOrder:cancelPendingOrderReducer,
    updatePendingOrder:updatePendingOrderReducer,
    marketData: marketDataReducer,
    marketDataHistory: marketDataHistoryReducer,
    accountType:accountTypeReducer,
    binaryTradeHistory:binaryTradeHistoryReducer,
    transactionsHistory:transactionsHistoryReducer,
    walletList:walletListReducer,
    faqs: faqsReducer,
    tawk: tawkReducer,
    tickets: ticketListReducer,
    supportTicket: supportTicketReducer,
    ticketShow:ticketShowReducer, 
    replyTicket: replyTicketReducer,
    symbols:symbolsReducer,
    internalTransferAccounts:internalTransferAccountsReducer,
    internalTransfer: internalTransferReducer,
    internalTransferList:internalTransferListReducer,
    pinLock: pinLockReducer,
    platformSettings:platformSettingsReducer,
    IB:ibStatusReducer,
    markets: marketReducer,
    events: eventReducer,
    checkReferral: checkReferralReducer, 
    resetPassword:resetPasswordReducer,
    verifyResetLink:verifyResetLinkReducer,
    resetPasswordValues:resetPasswordValuesReducer,
    renameTradeAccount:renameTradeAccountReducer,



    // crm reducers 
    auth: authReducer,
    register: registerReducer,
    updateUser:updateProfileReducer,
    user: userReducer,
    depositList: depositListReducer,
    tradeAccountsList:tradeAccountsListReducer,
    tradeGroupsList:tradeGroupsReducer,
    newTradingAccount:newTradingAccountReducer,
    withdraw:withdrawReducer,
    withdrawStepOne:withdrawStepOneReducer,
    withdrawStepTwo:withdrawStepTwoReducer,
    withdrawalList:withdrawalListReducer,
    deposit:depositReducer,
    depositStepOne:depositStepOneReducer,
    depositStepTwo:depositStepTwoReducer,
    myPortfolio:myPortfolioReducer,
    tradingAccountList:tradingAccountListReducer,
    userDashboard:userDashboardReducer,
    myReferrals:myReferralsReducer,
    kyc:kycReducer,
    kycSubmit:kycSubmitReducer,
    getAllSymbols: getAllSymbolsReducer,
    registerWithGoogle: registerWithGoogleSlice,
});

export default rootReducer;