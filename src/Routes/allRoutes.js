import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import DashboardCrypto from "../pages/DashboardCrypto";
import SymbolDetailPageMobile from "../pages/DashboardCrypto/SymbolDetailPageMobile";

//AuthenticationInner pages
import BasicLockScreen from '../pages/AuthenticationInner/LockScreen/BasicLockScr'
//pages
import SocialTrading from '../pages/Pages/SocialTrading'

//login
import Login from "../pages/Authentication/Login";
import { components } from "react-select";
import CloseOrder from "../pages/DashboardCrypto/CloseOrder";
// import DesktopHistoryPositions from "../pages/DashboardCrypto/DesktopHistoryPositions";
import TradingViewChart from "../pages/DashboardCrypto/TradingViewChart";

// crm imports
import Dashboard from '../pages/crm-pages/Dashboard'
import PamManager from "../pages/crm-pages/PamManager";
import CopyTrading from '../pages/crm-pages/CopyTrading'
import IBMArea from '../pages/crm-pages/IBMArea'
import TradingAccounts from '../pages/crm-pages/TradingAccount'
import NewTradingAccount from '../pages/crm-pages/TradingAccount/NewTradingAccount'
import Trade from '../pages/crm-pages/Trade'
import InternalTransfer from '../pages/crm-pages/InternalTransfer'
import TransferForm from "../pages/crm-pages/InternalTransfer/TransferForm";
import DemoAccounts from '../pages/crm-pages/DemoAccounts'
import DemoAccountForm from '../pages/crm-pages/DemoAccounts/DemoAccountForm'
import MyReferrals from '../pages/crm-pages/MyReferrals'
import Deposite from '../pages/crm-pages/Deposite'
import DepositeHistory from "../pages/crm-pages/Deposite/DepositeHistory";
import WithdrawFunds from '../pages/crm-pages/WithdrawFunds'
import WithdrawHistory from "../pages/crm-pages/WithdrawFunds/WithdrawHistory";
import Transactions from '../pages/crm-pages/Transactions'
import SupportTickets from '../pages/crm-pages/SupportTickets'
import NewSupportTicket from "../pages/crm-pages/SupportTickets/NewSupportTicket";
import TwoFactoreAuth from '../pages/crm-pages/TwoFactoreAuth'
import CoverPasswCreate from "../pages/crm-pages/AuthenticationInner/PasswordCreate/CoverPasswCreate";
import Profile from '../pages/crm-pages/Profile'

// crm autth imports 
import CrmLogin from "../pages/crm-pages/Authentication/CrmLogin";
import ForgetPasswordPage from "../pages/crm-pages/Authentication/ForgetPassword";
import Logout from "../pages/crm-pages/Authentication/Logout";
import Register from "../pages/crm-pages/Authentication/Register";
// import OpenPositions from "../pages/DashboardCrypto/openPositions/OpenPositions";
import SuccessMessage from "../pages/DashboardCrypto/SuccessMessage";
import MarketGraph from "../pages/DashboardCrypto/MarketGraph/MarketGraph2";
import ProfileSettings from "../pages/crm-pages/ProfileSettings/ProfileSettings";
import PlatformSettings from "../pages/crm-pages/PlatformSettings/PlatformSettings";
import ResetPassword from "../pages/crm-pages/Authentication/ResetPassword";
import Wallets from "../pages/DashboardCrypto/Wallets/Wallets";
import FAQs from "../pages/DashboardCrypto/FAQs/FAQs";
import FaqDetail from "../pages/DashboardCrypto/FAQs/FaqDetail";
import TawkChat from "../pages/DashboardCrypto/TawkChat/TawkChat";
import TicketShow from "../pages/crm-pages/SupportTickets/TicketShow";
import { PinPad } from "../pages/DashboardCrypto/PinScreen/PinPad";
import { CreatePin } from "../pages/DashboardCrypto/PinScreen/CreatePin";
import XQChart from "../pages/Pages/XQChart/XQChart";
import KYC from '../pages/crm-pages/KYC/KYC'
import Trades from "../pages/DashboardCrypto/TradesHistory/Trades";
import Market from "../pages/DashboardCrypto/Market/Market";
import Events from "../pages/DashboardCrypto/Events/Events";
import Help from "../pages/DashboardCrypto/Help/Helps";
import ResetVerification from "../pages/crm-pages/Authentication/ResetVerification";
import XQTradeTutorial from "../pages/DashboardCrypto/XQTradeTutorial/XQTradeTutorial";
import EducationCenter from "../pages/DashboardCrypto/EducationCenter/EducationCenter";
import ChangePassword from "../pages/crm-pages/Authentication/ChangePassword";



const authProtectedRoutes = [
  { path: "/trade", component: <DashboardCrypto /> },
  { path: "/symbol-detail", component: <SymbolDetailPageMobile /> },
  { path: "/close-order", component: <CloseOrder /> },
  { path: "/social-trading", component: <SocialTrading /> },
  // { path: "/open-position", component: <OpenPositions /> },
  // { path: "/history", component: <DesktopHistoryPositions /> },
  { path: "/trading-view", component: <TradingViewChart /> },
  { path: '/success-trade', component: <SuccessMessage /> },


  // crm routes
  // { path: "/dashboard", component: <Dashboard /> },
  { path: "/dashboard", component: <MarketGraph /> },
  { path: "/index", component: <DashboardCrypto /> },
  { path: "/pam-manager", component: <PamManager /> },
  { path: "/copy-trading", component: <CopyTrading /> },
  { path: "/ibm-area", component: <IBMArea /> },
  { path: "/trading-accounts", component: <TradingAccounts /> },
  { path: "/new-trading-account", component: <NewTradingAccount /> },
  { path: "/trade", component: <Trade /> },
  { path: "/internal-transfer", component: <InternalTransfer /> },
  { path: "/internal-transfer/create", component: <TransferForm /> },
  { path: "/demo-acounts", component: <DemoAccounts /> },
  { path: "/demo-acounts/create", component: <DemoAccountForm /> },
  { path: "/my-referrals", component: <MyReferrals /> },
  { path: "/deposit", component: <Deposite /> },
  { path: "/deposit/history", component: <DepositeHistory /> },
  { path: "/withdraw-funds", component: <WithdrawFunds /> },
  { path: "/withdraw-funds/history", component: <WithdrawHistory /> },
  { path: "/transactions", component: <Transactions /> },
  { path: "/support-tickets", component: <SupportTickets /> },
  { path: "/support-tickets/create", component: <NewSupportTicket /> },
  { path: "/two-factor-authentication", component: <TwoFactoreAuth /> },
  { path: "/profile", component: <Profile /> },
  { path: "/profile-settings", component: <ProfileSettings/> },
  { path: "/platform-settings", component: <PlatformSettings/> },
  { path: "/wallets", component: <Wallets/> },
  { path: "/faqs", component: <FAQs/>},
  { path: "/faq/:id", component: <FaqDetail/>},
  { path: "/chat", component: <TawkChat/>},
  { path: "/ticket-show/:ticketId", component: <TicketShow/>},
  { path: "/app-pin", component: <CreatePin/>},
  { path: "/kyc", component: <KYC/>},
  { path: "/active-trades", component: <Trades/>},
  { path: "/market", component: <Market/>},
  { path: "/events", component: <Events/>},
  { path: "/help", component: <Help/>},
  { path: "/xq-trade-tutorial", component: <XQTradeTutorial/>},
  { path: "/education-center", component: <EducationCenter/>},
  {path:"change-password",component:<ChangePassword/>},




  //Pages


  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: <CrmLogin /> },
  // { path: "/login", component: <Login /> },
  //AuthenticationInner pages
  { path: "/auth-lockscreen-basic", component: <BasicLockScreen /> },
  { path: "/xq-chart", component: <XQChart/>},


  // crm auth routes
  { path: "/logout", component: <Logout /> },
  // { path: "/crm-login", component: <CrmLogin /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
  { path: "/reset", component: <ResetVerification/>},
  { path: "/password-reset", component: <ResetPassword/> },


];

export { authProtectedRoutes, publicRoutes };