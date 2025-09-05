import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/menuUtils";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isOpenPosition, setIsOpenPosition] = useState(false);
  const [isPricing, setIsPricing] = useState(false);
  const [isHistory, setIsHistory] = useState(false);


  // CRM STATES 
  const [isUserDashboard, setIsUserDashboard] = useState(false);
  const [isPamManager, setIsPamManager] = useState(false);
  const [isCopyTrading, setIsCopyTrading] = useState(false);
  const [isIBMArea, setIsIBMArea] = useState(false);
  const [isTradingAccounts, setIsTradingAccounts] = useState(false);
  const [isTrade, setIsTrade] = useState(false);
  const [isInternalTransfer, setIsInternalTransfer] = useState(false);
  const [isDemoAccounts, setIsDemoAccounts] = useState(false);
  const [isMyReferrals, setIsMyReferrals] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [isTransactions, setIsTransactions] = useState(false);
  const [isSupportTickets, setIsSupportTickets] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [isKyc, setIsKyc] = useState(false);



  // Multi Level

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "OpenPosition") {
      setIsOpenPosition(false);
    }
    if (iscurrentState !== "Pricing") {
      setIsPricing(false);
    }
    if (iscurrentState !== "History") {
      setIsHistory(false);
    }


    // CRM STATES UPDATIONS 
    if (iscurrentState !== "UserDashboard") {
      setIsUserDashboard(false);
    }
    if (iscurrentState !== "PamManager") {
      setIsPamManager(false);
    }
    if (iscurrentState !== "CopyTrading") {
      setIsCopyTrading(false);
    }
    if (iscurrentState !== "IBMArea") {
      setIsIBMArea(false);
    }
    if (iscurrentState !== "TradingAccounts") {
      setIsTradingAccounts(false);
    }
    if (iscurrentState !== "Trade") {
      setIsTrade(false);
    }
    if (iscurrentState !== "InternalTransfer") {
      setIsInternalTransfer(false);
    }
    if (iscurrentState !== "DemoAccounts") {
      setIsDemoAccounts(false);
    }
    if (iscurrentState !== "MyReferrals") {
      setIsMyReferrals(false);
    }
    if (iscurrentState !== "Deposit") {
      setIsDeposit(false);
    }
    if (iscurrentState !== "Withdraw") {
      setIsWithdraw(false);
    }
    if (iscurrentState !== "Transactions") {
      setIsTransactions(false);
    }
    if (iscurrentState !== "SupportTickets") {
      setIsSupportTickets(false);
    }
    if (iscurrentState !== "2FA") {
      setIs2FA(false);
    }
    if (iscurrentState !== "PasswordReset") {
      setIsPasswordReset(false);
    }
    if (iscurrentState !== "Profile") {
      setIsProfile(false);
    }
    if (iscurrentState !== "KYC") {
      setIsKyc(false);
    }


  }, [
    history,
    iscurrentState,
    isDashboard,
    isOpenPosition,
    isPricing,
    isHistory,


    // crm variables 
    isUserDashboard,
    isPamManager,
    isCopyTrading,
    isIBMArea,
    isTradingAccounts,
    isTrade,
    isInternalTransfer,
    isDemoAccounts,
    isMyReferrals,
    isDeposit,
    isWithdraw,
    isTransactions,
    isSupportTickets,
    is2FA,
    isPasswordReset,
    isProfile,
    isKyc,


  ]);

  //  abc
  const handleCardClasses = (isHidden, mediaQueryList, dpCard, dcCard) => {
    // if (!isHidden && mediaQueryList.matches) {
    //   dpCard.classList.remove('col-md-4');
    //   dpCard.classList.remove('mt-3'); // Separate 'mt-3' class removal
    //   dpCard.classList.add('col-md-12');
    //   dpCard.classList.add('mt-3'); // Add back as needed
    //   dcCard.classList.remove('col-md-8');
    //   dcCard.classList.add('col-md-12');
    // } else if (isHidden || !mediaQueryList.matches) {
    //   dpCard.classList.remove('col-md-12');
    //   dpCard.classList.remove('mt-3');
    //   dpCard.classList.add('col-md-4');
    //   dcCard.classList.remove('col-8');
    //   dcCard.classList.add('col-md-8');
    // }
  };

  const addEventListenerOnSmHoverMenu = () => {
    // Get the elements
    const pricing = document.getElementById('pricing_desktop');
    const mainCnt = document.getElementById('main_cnt_desktop');
    const dpCard = document.getElementById('dp-card');
    const dcCard = document.getElementById('dc-card');
    const mediaQueryList = window.matchMedia('(max-width: 1150px)');

    // Toggle the 'd-none' class on the pricing element
    if (pricing) {
      pricing.classList.toggle('d-none');
      if (pricing.classList.contains('d-none')) {
        // If 'd-none' class is present, adjust mainCnt classes
        mainCnt.classList.remove('col-md-9');
        mainCnt.classList.add('col-md-12');
      } else {
        mainCnt.classList.remove('col-md-12');
        mainCnt.classList.add('col-md-9');
      }
    }

    // Adjust mainCnt classes based on the visibility of the pricing element
    const isHidden = pricing.classList.contains('d-none');
    mainCnt.classList.toggle('col-md-9', !isHidden);
    mainCnt.classList.toggle('col-md-12', isHidden);

    // Adjust card widths and classes
    handleCardClasses(isHidden, mediaQueryList, dpCard, dcCard);
  };

  // Add functionality to handle on window load

  useEffect(() => {
    window.onload = () => {
      const pricing = document.getElementById('pricing_desktop');
      const dpCard = document.getElementById('dp-card');
      const dcCard = document.getElementById('dc-card');
      const mediaQueryList = window.matchMedia('(max-width: 1150px)');

      if (pricing && dpCard && dcCard) {
        const isHidden = pricing.classList.contains('d-none');
        handleCardClasses(isHidden, mediaQueryList, dpCard, dcCard);
      } else {
        console.error('One or more elements are missing on load.');
      }
    };

  }, [])




  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },

    // {
    //   id: "pricing",
    //   label: "Pricing",
    //   icon: "ri-bookmark-line",
    //   link: "/#",
    //   stateVariables: isPricing,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsPricing(!isPricing);
    //     setIscurrentState("Pricing");
    //     updateIconSidebar(e);
    //     addEventListenerOnSmHoverMenu()
    //   },

    // },
    {
      id: "userDashboard",
      label: "Dashboard",
      icon: "ri-dashboard-2-line",
      link: "/user-dashboard",
      stateVariables: isUserDashboard,
      click: function (e) {
        e.preventDefault();
        setIsUserDashboard(!isUserDashboard);
        setIscurrentState("userDashboard");
        updateIconSidebar(e);
        history('/')

      },
    },
    // {
    //   id: "dashboard",
    //   label: "Trade",
    //   icon: "ri-dashboard-2-line",
    //   link: "/#",
    //   stateVariables: isDashboard,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDashboard(!isDashboard);
    //     setIscurrentState("Dashboard");
    //     updateIconSidebar(e);
    //     history('/trade')

    //   },
    //   // subItems: [

    //   //   {
    //   //     id: "crypto",
    //   //     label: "Crypto",
    //   //     link: "/dashboard",
    //   //     parentId: "dashboard",
    //   //     icon: "ri-dashboard-2-line",
    //   //   },

    //   // ],
    // },
    // {
    //   id: "openPosition",
    //   label: "Open Position",
    //   icon: "ri-briefcase-line",
    //   link: "/open-position",
    //   stateVariables: isOpenPosition,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsOpenPosition(!isOpenPosition);
    //     setIscurrentState("openPosition");
    //     updateIconSidebar(e);
    //     history('/open-position')
    //   },
    // },
    // {
    //   id: "history",
    //   label: "History",
    //   icon: "ri-history-line",
    //   link: "/history",
    //   stateVariables: isHistory,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsHistory(!isOpenPosition);
    //     setIscurrentState("History");
    //     updateIconSidebar(e);
    //     history('/history')
    //   },
    // },

    
    {
      id: "TradingAccounts",
      label: "Trading Accounts",
      icon: "ri-wallet-3-line",
      link: "/trading-accounts",
      stateVariables: isTradingAccounts,
      click: function (e) {
        e.preventDefault();
        setIsTradingAccounts(!isTradingAccounts);
        setIscurrentState("TradingAccounts");
        updateIconSidebar(e);
        history('/trading-accounts')
      },
    },
    // {
    //   id: "Trade",
    //   label: "Trade",
    //   icon: "ri-bar-chart-line",
    //   link: "/trade",
    //   stateVariables: isTrade,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsTrade(!isTrade);
    //     setIscurrentState("Trade");
    //     updateIconSidebar(e);
    //     history('/trade')
    //   },
    // },
    // {
    //   id: "InternalTransfer",
    //   label: "Internal Transfer",
    //   icon: "ri-exchange-dollar-line",
    //   link: "/internal-transfer",
    //   stateVariables: isInternalTransfer,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsInternalTransfer(!isInternalTransfer);
    //     setIscurrentState("InternalTransfer");
    //     updateIconSidebar(e);
    //     history('/internal-transfer')
    //   },
    // },
    // {
    //   id: "DemoAccounts",
    //   label: "Demo Accounts",
    //   icon: "ri-test-tube-line",
    //   link: "/demo-acounts",
    //   stateVariables: isDemoAccounts,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsDemoAccounts(!isDemoAccounts);
    //     setIscurrentState("DemoAccounts");
    //     updateIconSidebar(e);
    //     history('/demo-acounts')
    //   },
    // },
    {
      id: "MyReferrals",
      label: "My Referrals",
      icon: "ri-share-forward-line",
      link: "/my-referrals",
      stateVariables: isMyReferrals,
      click: function (e) {
        e.preventDefault();
        setIsMyReferrals(!isMyReferrals);
        setIscurrentState("MyReferrals");
        updateIconSidebar(e);
        history('/my-referrals')
      },
    },
    {
      id: "Deposit",
      label: "Deposit",
      icon: "ri-bank-card-line",
      link: "/deposit",
      stateVariables: isDeposit,
      click: function (e) {
        e.preventDefault();
        setIsDeposit(!isDeposit);
        setIscurrentState("Deposit");
        updateIconSidebar(e);
        history('/deposit')
      },
    },
    {
      id: "Withdraw",
      label: "Withdraw",
      icon: "ri-bank-line",
      link: "/withdraw-funds",
      stateVariables: isWithdraw,
      click: function (e) {
        e.preventDefault();
        setIsWithdraw(!isWithdraw);
        setIscurrentState("Withdraw");
        updateIconSidebar(e);
        history('/withdraw-funds')
      },
    },
    // {
    //   id: "Transactions",
    //   label: "Transactions",
    //   icon: "ri-exchange-box-line",
    //   link: "/transactions",
    //   stateVariables: isTransactions,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsTransactions(!isTransactions);
    //     setIscurrentState("Transactions");
    //     updateIconSidebar(e);
    //     history('/transactions')
    //   },
    // },
    {
      id: "kyc",
      label: "KYC",
      icon: "ri-shield-check-line",
      link: "/kyc",
      stateVariables: isKyc,
      click: function (e) {
        e.preventDefault();
        setIsKyc(!isKyc);
        setIscurrentState("KYC");
        updateIconSidebar(e);
        history('/kyc')
      },
    },
    {
      id: "supportTickets",
      label: "Support Tickets",
      icon: "ri-ticket-2-line",
      link: "/support-tickets",
      stateVariables: isSupportTickets,
      // isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsSupportTickets(!isSupportTickets);
        setIscurrentState("SupportTickets");
        updateIconSidebar(e);
        history('/support-tickets')
      },
    //   // parentId: "apps",
    //   // childItems: [
    //   //   { id: 1, label: "List View", link: "/apps-tickets-list" },
    //   //   { id: 2, label: "Ticket Details", link: "/apps-tickets-details" },
    //   // ],
    // },
    // {
    //   id: "2FA",
    //   label: "2FA",
    //   icon: "ri-fingerprint-line",
    //   link: "/two-factor-authentication",
    //   stateVariables: is2FA,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIs2FA(!is2FA);
    //     setIscurrentState("2FA");
    //     updateIconSidebar(e);
    //     history('/two-factor-authentication')
    //   },
    },
    {
      id: "profile",
      label: "Profile",
      icon: "ri-user-line",
      link: "/profile",
      stateVariables: isProfile,
      // isChildItem: true,
      click: function (e) {
        e.preventDefault();
        setIsProfile(!isProfile);
        setIscurrentState("profile");
        updateIconSidebar(e);
        history('/profile')
      },
      // parentId: "pages",
      // childItems: [
      //   {
      //     id: 1,
      //     label: "Simple Page",
      //     link: "/pages-profile",
      //     parentId: "pages",
      //   },
      //   {
      //     id: 2,
      //     label: "Settings",
      //     link: "/pages-profile-settings",
      //     parentId: "pages",
      //   },
      // ],
    },
    // {
    //   id: "passwordReset",
    //   label: "Change Password",
    //   icon: "ri-lock-unlock-line",
    //   link: "/auth-pass-change",
    //   stateVariables: isPasswordReset,
    //   // isChildItem: true,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsPasswordReset(!isPasswordReset);
    //     setIscurrentState("passwordReset");
    //     updateIconSidebar(e);
    //     history('/auth-pass-change')
    //   },
    //   // parentId: "authentication",

    //   // childItems: [
    //   //   { id: 1, label: "Basic", link: "/auth-pass-reset-basic" },
    //   //   { id: 2, label: "Cover", link: "/auth-pass-reset-cover" },
    //   // ],
    // },

    {
      id: "logout",
      label: "Logout",
      icon: "ri-logout-box-line",
      // link: "/#",
      // stateVariables: isDashboard,
      click: function (e) {
        // console.log("logout side bar");
        handleLogout()
        // e.preventDefault();
        // setIsDashboard(!isDashboard);
        // setIscurrentState("Dashboard");
        // updateIconSidebar(e);
      },
    },

  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
