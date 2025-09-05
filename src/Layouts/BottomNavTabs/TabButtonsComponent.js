import React, { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import finance from "../../assets/images/Trades.png";
import signal from "../../assets/images/Terminals.png";
import markete from "../../assets/images/Market.png";
import Achivements from "../../assets/images/Event.png";
import help from "../../assets/images/Help.png";

import { useTab } from './TabContext';

const TabButtonsComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { activeTab, setActiveTab } = useTab();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const isMobile = window.innerWidth < 768;

    const toggleTab = (tab) => {
        const isMobile = window.innerWidth < 768;
        if (tab === "1") {
            navigate(`/dashboard`);
            setActiveTab("1");
        } else {
            if (activeTab === tab) {
                // If the tab is already active and clicked again, navigate to root
                navigate("/");
            } else {
                setActiveTab(tab);
                if (isMobile) {
                    setSearchParams({ tab });
                    navigate(`/trade?tab=${tab}`);
                } else {
                    let route = '';
                    switch (tab) {
                        case "2":
                            route = '/active-trades';
                            break;
                        case "3":
                            route = '/market';
                            break;
                        case "4":
                            route = '/events';
                            break;
                        case "5":
                            route = '/help';
                            break;
                        default:
                            route = '/trade';
                            break;
                    }
                    navigate(route);
                }
            }
        }
    };

    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && ['1', '2', '3', '4', '5'].includes(tabFromUrl)) {
            setActiveTab(tabFromUrl);
        } else {
            setActiveTab("1");
        }
        // eslint-disable-next-line
    }, [searchParams]);

    // Listen for navigation changes and set dashboard tab active if on /dashboard
    useEffect(() => {
        if (location.pathname === '/dashboard') {
            setActiveTab('1');
        }
    }, [location.pathname, setActiveTab]);

    const layout = useSelector(state => state.Layout);
    const layoutMode = layout?.layoutModeType;
    const bgClass = layoutMode === 'dark' ? 'bg-black' : 'bg-white';

    // Helper function to get active styles
    const getItemStyle = (tabId) => ({
        color: activeTab === tabId ? "#BE1984" : "#B8A9DC",
        background: activeTab === tabId ? "transparent" : "transparent",
        borderRadius: activeTab === tabId ? "12px" : "12px",
        textAlign: "center",
        fontSize: isMobile ? "9px" : "10px",
        fontWeight: "600",
        letterSpacing: "0.5px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        padding: isMobile ? "0 0 2px 0" : undefined,
        minHeight: isMobile ? "48px" : undefined,
        minWidth: isMobile ? "0" : undefined,
    });

    // Helper function to get image style
    const getImageStyle = (tabId) => ({
        height: isMobile ? "28px" : "50px",
        width: isMobile ? "28px" : undefined,
        filter: activeTab === tabId
            ? "brightness(0) saturate(100%) invert(17%) sepia(60%) saturate(7476%) hue-rotate(292deg) brightness(90%) contrast(98%)"
            : "none"
    });

    const getIconContainerStyle = (tabId) => ({
        background: "transparent",
        borderRadius: "12px",
        padding: isMobile ? "2px" : "4px",
        margin: isMobile ? "0 0 2px 0" : "2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    });

    return (
        <>
            <style>{`
                @media (max-width: 768px) {
                    .bottom-nav-mobile {
                        width: 100% !important;
                        height: 54px !important;
                        min-height: 0 !important;
                        background: linear-gradient(180deg, #1F0E27) !important;
                        border-radius: 0 0 12px 12px !important;
                        box-shadow: 0 -2px 12px rgba(0,0,0,0.12);
                        padding: 0 !important;
                        margin: 0 !important;
                        z-index: 1000;
                    }
                    .bottom-nav-mobile-row {
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: stretch !important;
                        justify-content: space-between !important;
                        width: 100% !important;
                        height: 100% !important;
                        gap: 0 !important;
                    }
                    .bottom-nav-mobile-item {
                        flex: 1 1 0 !important;
                        min-width: 0 !important;
                        min-height: 0 !important;
                        padding: 0 0 2px 0 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        justify-content: center !important;
                        font-size: 9px !important;
                        font-weight: 600 !important;
                        border-radius: 12px !important;
                        background: transparent !important;
                        margin: 0 !important;
                    }
                }
            `}</style>
            <div
                className={isMobile ? "bottom-nav-mobile" : undefined}
                style={{
                    width: isMobile ? "100%" : "70px",
                    marginLeft: isMobile ? 0 : "20px",
                    height: isMobile ? "54px" : "93%",
                    background: "#1D0A25",
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: "center",
                    justifyContent: isMobile ? "space-between" : "center",
                    borderRadius: isMobile ? "0 0 12px 12px" : "12px",
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: isMobile ? 0 : undefined,
                    paddingRight: isMobile ? 0 : undefined,
                    gap: isMobile ? 0 : undefined,
                    boxSizing: 'border-box',
                    zIndex: isMobile ? 1000 : undefined,
                }}
            >
                {/* All sidebar items in one row for mobile, column for desktop */}
                <div
                    className={isMobile ? "bottom-nav-mobile-row" : undefined}
                    style={{
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        alignItems: "center",
                        justifyContent: isMobile ? "space-between" : "center",
                        gap: isMobile ? 0 : "12px",
                        width: isMobile ? "100%" : "100%",
                        height: isMobile ? "100%" : undefined,
                    }}
                >
                    {/* SIGNALS - Tab 1 */}
                    <div
                        className={isMobile ? "bottom-nav-mobile-item" : undefined}
                        style={{ ...getItemStyle("1"), flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => toggleTab("1")}
                    >
                        <div style={getIconContainerStyle("1")}>
                            <img src={signal} alt="" style={getImageStyle("1")} />
                        </div>
                        <div>{t('Terminal')}</div>
                    </div>

                    {/* TRADES - Tab 2 */}
                    <div
                        className={isMobile ? "bottom-nav-mobile-item" : undefined}
                        style={{ ...getItemStyle("2"), flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => toggleTab("2")}
                    >
                        <div style={getIconContainerStyle("2")}>
                            <img src={finance} alt="" style={getImageStyle("2")} />
                        </div>
                        <div>{t('TRADES')}</div>
                    </div>

                    {/* MARKET - Tab 3 */}
                    <div
                        className={isMobile ? "bottom-nav-mobile-item" : undefined}
                        style={{ ...getItemStyle("3"), flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => toggleTab("3")}
                    >
                        <div style={getIconContainerStyle("3")}>
                            <img src={markete} alt="" style={getImageStyle("3")} />
                        </div>
                        <div>{t('MARKET')}</div>
                    </div>

                    {/* EVENTS - Tab 4 */}
                    <div
                        className={isMobile ? "bottom-nav-mobile-item" : undefined}
                        style={{ ...getItemStyle("4"), flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => toggleTab("4")}
                    >
                        <div style={getIconContainerStyle("4")}>
                            <img src={Achivements} alt="" style={getImageStyle("4")} />
                        </div>
                        <div>{t('EVENTS')}</div>
                    </div>

                    {/* HELP - Tab 5 (now in same row/column) */}
                    <div
                        className={isMobile ? "bottom-nav-mobile-item" : undefined}
                        style={{ ...getItemStyle("5"), flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => toggleTab("5")}
                    >
                        <div style={getIconContainerStyle("5")}>
                            <img src={help} alt="" style={getImageStyle("5")} />
                        </div>
                        <div>{t('HELP')}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TabButtonsComponent;