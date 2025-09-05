import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';
import { handleLogout } from './utils/menuUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectFilteredStaticSymbols, setSymbols } from './rtk/slices/tradingSlice/tradingSlice';
import { token } from './utils/config';
import { tradeAccountsList } from './rtk/slices/crm-slices/trade/tradeAccountsList';
import { subscribeToOrderChannel, unsubscribeFromOrderChannel } from './utils/pusher-2';
import { fetchSymbols } from './rtk/slices/fetchSymbolsSlice/fetchSymbolsSlice';
import { LockScreen } from './pages/DashboardCrypto/PinScreen/LockScreen';
import { CreatePin } from './pages/DashboardCrypto/PinScreen/CreatePin';
import { lockApp, unlockApp } from './rtk/slices/pinLockSlice/pinLockSlice';
import { getUser } from './rtk/slices/crm-slices/user/getUserSlice';
import './i18n';
import LanguageSwitcher from './Components/LanguageSwitcher';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountTypeModel from './Layouts/AccountTypeModel';



const IdleMonitor = ({ onIdle }) => {
  let idleRef = React.useRef(0).current;

  React.useEffect(() => {
    const idleInterval = setInterval(timerIncrement, 1000); // 1 minute

    function timerIncrement() {
      idleRef += 1;
      if (idleRef > 3599) {
        // 3600 seconds == 1 hour
        onIdle();
        clearInterval(idleInterval);
      }
    }

    function resetIdleRef() {
      idleRef = 0;
    }

    document.body.addEventListener('mousemove', resetIdleRef);
    document.body.addEventListener('keypress', resetIdleRef);

    return () => {
      document.body.removeEventListener('mousemove', resetIdleRef);
      document.body.removeEventListener('keypress', resetIdleRef);
      clearInterval(idleInterval);
    };
  }, [onIdle]);

  return null;
};




function App() {
  const { pin, isLockEnabled, isLocked } = useSelector((state) => state.pinLock);


  const location = useLocation();
  const terminalPath = location.pathname === "/dashboard";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filteredStaticSymbols = useSelector(selectFilteredStaticSymbols);

  const { tradeAccount, status } = useSelector((state) => state.tradeAccountsList) || {};
  const registeredTradeAccount = useSelector((state) => state.register.tradeAccount);
  const tradeAccountsData = tradeAccount?.data || registeredTradeAccount || [];


  const user = JSON.parse(localStorage.getItem('user'));
  const account = user ? user.account : null;

  function logout() {
    console.log('Logging out due to inactivity');
    handleLogout(dispatch, navigate);
  }

  // useEffect(() => {

  //   if (account) {
  //     subscribeToOrderChannel(account, (data) => {
  //       console.log('New order received in Trading:', data);
  //     });
  //     return () => unsubscribeFromOrderChannel(account);
  //   }
  // }, [account]);

  useEffect(() => {
    // Establish socket connection
    filteredStaticSymbols.forEach(({ symbol, ask, bid, Spread }) => {
      const spreadAsk = ask + Spread
      const spreadBid = bid + Spread
      dispatch(setSymbols({ symbol, bid, ask, spreadAsk, spreadBid }));
    });
    dispatch({ type: 'socket/connect' });

    return () => {
      // Disconnect socket when app unmounts
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch, filteredStaticSymbols]);

  useEffect(() => {
    if (token) {
      dispatch(tradeAccountsList(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchSymbols()); // Fetch symbols on mount
    }
  }, [dispatch]);


  useEffect(() => {
    // Check if there is already a user in localStorage
    const storedUser = localStorage.getItem('user');

    // If there's no stored user, set the default trade account
    if (token) {

      if (!storedUser) {
        if (tradeAccountsData?.length === 1) {
          // If only one trade account, set it in localStorage
          localStorage.setItem('user', JSON.stringify({ account: tradeAccountsData[0]?.account }));
        } else if (tradeAccountsData?.length > 1) {
          // If multiple trade accounts, set the latest one in localStorage
          const latestAccount = tradeAccountsData?.reduce((latest, account) => {
            return new Date(account.created_at) > new Date(latest.created_at) ? account : latest;
          }, tradeAccountsData[0]);

          localStorage.setItem('user', JSON.stringify({ account: latestAccount.account }));
        }
      }

    }


  }, [tradeAccountsData]);



  const path = location.pathname;

  useEffect(() => {
    if (path === "/dashboard") {
      document.body.style.backgroundColor = "#010e1c";
    } else {
      document.body.style.backgroundColor = "#010e1c";
    }

  }, [terminalPath]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUser(token))

    }

  }, [dispatch])


  useEffect(() => {
    if (isLockEnabled && pin && token) {
      dispatch(lockApp());
    }
  }, [isLockEnabled, pin, dispatch]);

  const handleUnlock = () => {
    dispatch(unlockApp());
  };

  useEffect(() => {
    const { os, version } = getOSInfo();
    console.log(`Operating System: ${os}, Version: ${version}`);
    // You can also dispatch this information to your Redux store or use it as needed
  }, []);


  if (isLocked && isLockEnabled && pin && token) {
    return <LockScreen onUnlock={handleUnlock} storedPin={pin} />;
  }


  function getOSInfo() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let os = "Unknown";
    let version = "Unknown";

    // Windows
    if (/Windows NT/i.test(userAgent)) {
      os = "Windows";
      const match = userAgent.match(/Windows NT ([0-9.]+)/);
      version = match ? match[1] : "Unknown";
    }

    // macOS
    else if (/Mac OS X/i.test(userAgent)) {
      os = "macOS";
      const match = userAgent.match(/Mac OS X ([0-9_]+)/);
      version = match ? match[1].replace(/_/g, '.') : "Unknown";
    }

    // iOS
    else if (/iP(hone|od|ad)/.test(userAgent)) {
      os = "iOS";
      const match = userAgent.match(/OS (\d+_\d+(_\d+)?)/);
      version = match ? match[1].replace(/_/g, '.') : "Unknown";
    }

    // Android
    else if (/Android/.test(userAgent)) {
      os = "Android";
      const match = userAgent.match(/Android ([0-9.]+)/);
      version = match ? match[1] : "Unknown";
    }

    // Linux
    else if (/Linux/.test(userAgent)) {
      os = "Linux";
      version = "Unknown";
    }

    return { os, version };
  }






  return (
    <React.Fragment>

      <IdleMonitor onIdle={logout} />
      {/* <LanguageSwitcher /> */}
      <ToastContainer position="top-right" autoClose={1500} theme="dark"/>
      <Route />
      <AccountTypeModel />

    </React.Fragment>
  );
}

export default App;
