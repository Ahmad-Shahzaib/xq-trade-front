import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { changeSidebarVisibility } from "../rtk/slices/thunks";
import { selectOpenPositions } from "../rtk/slices/openPositionsSlice/openPositionsSlice";
import LightDark from "../Components/Common/LightDark";
import { setSelectedAccount, toggleModal } from "../rtk/slices/accountTypeSlice/accountTypeSlice";


import { logoSm } from "../utils/config";
import { logoDark } from "../utils/config";
import { logoLight } from "../utils/config";

// Import components
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LanguageDropdown from "../Components/Common/LanguageDropdown";
import useWindowSize from "../Components/Hooks/useWindowSize";
import PaymentsPanel from "./PaymentsPanel";
import ProfileSidebar from "./ProfileSidebar";
import { tradeAccountsList } from "../rtk/slices/crm-slices/trade/tradeAccountsList";
import { tradeGroups } from "../rtk/slices/crm-slices/trade/tradeGroups";
import { getUser } from "../rtk/slices/crm-slices/user/getUserSlice";
import LanguageSwitcher from "../Components/LanguageSwitcher";
import { useTranslation } from 'react-i18next';
import sqlogo from "../../src/assets/images/xq_logo.png"
import wallet from "../../src/assets/images/Wallet.png";
import profile from "../../src/assets/images/Group 14.png";
import xqlogomobile from "../../src/assets/images/XQ 02.png";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isProfleSidebarOpen, setIsProfleSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { t } = useTranslation();

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  const { tP } = useSelector(selectOpenPositions);
  const selectedAccount = useSelector((state) => state.accountType.selectedAccount) ||
    JSON.parse(localStorage.getItem("selectedAccount")) || {};

  const { tradeAccount, status } = useSelector((state) => state.tradeAccountsList)
  const tradeAccontsSelected = useSelector((state) => state.accountType.selectedAccount)
  const { tradeAccounts } = useSelector((state) => state.accountType);

  const localSelectedAccount = JSON.parse(localStorage.getItem("selectedAccount"))

  const terminalPath = location.pathname === "/dashboard";


  // console.log('selected account  in redux', tradeAccontsSelected);
  // console.log('localSelectedAccount', localSelectedAccount);
  // console.log('all trade accounts ', tradeAccounts);
  

  const appSettings = JSON.parse(localStorage.getItem('appSettings')) || {};
  const isHiddenBalance = appSettings.hiddenBalances ?? false;


  const handleRefresh = () => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(tradeAccountsList(token)); // Fetch updated data
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      dispatch(tradeAccountsList(storedToken));
    }
  }, [dispatch]);

  const totalProfit = tP;
  const { width } = useWindowSize();


  const binaryLogo = require("../assets/images/appIcon.png");

  const selectDashboardData = createSelector(
    (state) => state.Layout,
    (state) => ({
      sidebarVisibilitytype: state.sidebarVisibilitytype,
    })
  );

  const { sidebarVisibilitytype } = useSelector(selectDashboardData);

  const [search, setSearch] = useState(false);
  const toogleSearch = () => {
    setSearch(!search);
  };

  const toogleMenuBtn = () => {
    const windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));

    if (windowSize > 767)
      document.querySelector(".hamburger-icon").classList.toggle("open");

    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.toggle("menu");
    }

    if (
      sidebarVisibilitytype === "show" &&
      (document.documentElement.getAttribute("data-layout") === "vertical" ||
        document.documentElement.getAttribute("data-layout") === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.setAttribute(
          "data-sidebar-size",
          document.documentElement.getAttribute("data-sidebar-size") === "sm"
            ? ""
            : "sm"
        );
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.setAttribute(
          "data-sidebar-size",
          document.documentElement.getAttribute("data-sidebar-size") === "sm"
            ? "sm"
            : "sm"
        );
        // document.documentElement.setAttribute('data-sidebar-size', document.documentElement.getAttribute('data-sidebar-size') === 'lg' ? 'sm' : 'sm');
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "sm");
        // document.documentElement.setAttribute('data-sidebar-size', 'lg');
      }
    }

    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.toggle("twocolumn-panel");
    }
  };

  const isDashboardTab1 = location.pathname === "/dashboard";
  const isDashboardTab2 =
    location.pathname === "/trade" && location.search === "?tab=2";
  const isDashboardTab5 =
    location.pathname === "/trade" && location.search === "?tab=5";

  const handleBackNavigate = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    if (selectedAccount) {
      localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));
    }
  }, [selectedAccount]); // Runs whenever selectedAccount changes

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleOpenProfileSidebar = () => {
    const storedToken = localStorage.getItem("token");
    // dispatch(getUser(storedToken))
    setIsProfleSidebarOpen(true)
  }

  return (
    <React.Fragment>
      <style>{`
        @media (max-width: 768px) {
          #page-topbar {
            min-height: 54px !important;
            padding: 0 !important;
            background: #1F0E27 !important;
            box-shadow: 0 2px 12px rgba(0,0,0,0.10);
            position: fixed;
            top: 0;
          }
          .layout-width {
            // padding: 0 6px !important;
            width: 100vw !important;
            min-width: 0 !important;
          }
          .navbar-header {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 0 !important;
            min-height: 54px !important;
            padding: 0 !important;
          }
          .logo-img {
            width: 90px !important;
            height: 70px !important;
            margin-left: 0 !important;
            margin-right: 0px !important;
          }
          .dflex, .d-flex.align-items-center.gap-2 {
            gap: 2px !important;
            margin-left: 0 !important;
          }
          .d-flex.align-items-center {
            gap: 4px !important;
          }
          .d-flex.align-items-center > button > img[alt="wallet"] {
            width: 120px !important;
            min-width: 0 !important;
            margin: 0 2px !important;
          }
          .d-flex.align-items-center > div[style*="border-radius: 50%"] {
            width: 28px !important;
            height: 28px !important;
            min-width: 0 !important;
            margin-left: 2px !important;
          }
          .d-flex.align-items-center > div[style*="border-radius: 50%"] img {
            width: 100% !important;
            height: 100% !important;
            min-width: 0 !important;
          }
          .dflex p, .d-flex.align-items-center.gap-2 p {
            font-size: 11px !important;
            line-height: 1.1 !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
          }
          .dflex strong, .d-flex.align-items-center.gap-2 strong {
            font-size: 11px !important;
            font-weight: 600 !important;
          }
          .d-flex.align-items-center.gap-2 span {
            font-size: 13px !important;
            margin-left: 2px !important;
          }
        }
      `}</style>
      <header
        id="page-topbar"
      >
        <div className="layout-width">
          <div className="navbar-header">
            {/* <Link to="/" className="logo "> */}
            {/* <span>
                                <img src={binaryLogo} alt="" height="22" width="32" />
                            </span> */}
            {/* <i className="ri-user-line"></i> */}

            {/* Always show logo button, clicking logo navigates to /dashboard */}
            <button
              className="Ws3yi76Z46 _0H5QNHpHcI -ClIVZvrPn"
              data-test="header-avatar"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <div className="e9cau5CvLL">
                <div style={{ backgroundColor: "transparent"
                  , padding : isMobile ? "0px" : "10px"
                 }}>
                  {isMobile ? (
                    <img
                      src={xqlogomobile}
                      alt="XQTrade Mobile Logo"
                      className="logo-img"
                      style={{ cursor: "pointer", width: "90px", height: "70px" }}
                      onClick={() => navigate("/dashboard")}
                    />
                  ) : (
                    <img
                      src={sqlogo}
                      alt="XQTrade Logo"
                      className="logo-img"
                      style={{ cursor: "pointer", width: "150px", height: "25px" }}
                      onClick={() => navigate("/dashboard")}
                    />
                  )}
                </div>
              </div>
            </button>

            {/* </Link> */}

            <div className="d-none">
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={binaryLogo} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={binaryLogo} alt="" height="30" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={binaryLogo} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={binaryLogo} alt="" height="30" />
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger d-none"
                id="topnav-hamburger-icon"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>

            {/* <LightDark
                            layoutMode={layoutModeType}
                            onChangeLayoutMode={onChangeLayoutMode}
                        /> */}

            <div className="dflex">
              {tradeAccount?.data?.length > 0 && selectedAccount ? (
                <div className="d-flex align-items-center gap-2">

                  <p className="text-center mb-0 cursor-pointer" onClick={() => dispatch(toggleModal())}>
                    <strong style={{ color: "#ffffff", fontWeight: 500, fontSize: "1rem" }}>
                      {!isHiddenBalance ? (
                        <>
                          {t(selectedAccount.trade_group_detail?.name)}{" "}
                          {selectedAccount?.balance === null ? "0" : Number(selectedAccount?.balance).toFixed(2)}
                        </>
                      ) : (
                        <span>****</span> // Hide balance when hiddenBalances is active
                      )}

                    </strong>
                    <br />
                    {
                      !isMobile && (
                        <strong style={{ color: "#ffffff", fontWeight: 600 }}>
                          {t(selectedAccount?.name)}
                        </strong>
                      )
                    }

                  </p>

                  {/* 🔄 Refresh Button with Redux Loading State */}
                  <span onClick={handleRefresh} style={{ cursor: "pointer" }}>
                    {status === "loading" ? (
                      <i className="ri-loader-4-line ri-spin"></i> // ⏳ Spinner when loading
                    ) : (
                      <i className="ri-refresh-line"></i> // 🔄 Normal refresh icon
                    )}
                  </span>
                </div>
              ) : (
                <p className="text-center mb-0" style={{ color: "#ffffff", fontWeight: 500, cursor: "pointer" }}
                  onClick={() => dispatch(toggleModal())}>
                  {t('Create Account')}
                </p>
              )}
            </div>

            <div className="d-flex align-items-center ">


              <button
                className=""
                data-test="recharge-tooltip-toggle-button-icon"
                type="button"
                onClick={() => setIsPanelOpen(true)}

              >
                <img src={wallet} alt="wallet" style={{ width: "180px", background: "transparent" }} />



              </button>
              {/* <LanguageDropdown/> */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",

                }}
                onClick={() => handleOpenProfileSidebar()}
              >
                <img
                  src={profile}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              {/* <ProfileDropdown /> */}
            </div>
          </div>
        </div>
      </header>
      <PaymentsPanel
        isOpen={isPanelOpen}
        toggle={() => setIsPanelOpen(false)}
      />

      <ProfileSidebar
        isOpen={isProfleSidebarOpen}
        toggle={() => setIsProfleSidebarOpen(false)}
      />
    </React.Fragment>
  );
};

export default Header;
