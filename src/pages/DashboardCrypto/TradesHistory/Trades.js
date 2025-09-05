import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Accordion, AccordionBody, AccordionHeader, AccordionItem, Spinner, Alert, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Collapse } from 'reactstrap';
import { fetchBinaryTradeHistory } from '../../../rtk/slices/binaryTradeHistorySlice/binaryTradeHistorySlice';
import { removeTrade, updateTradeTime } from '../../../rtk/slices/orderSlice/orderSlice';
import { useTranslation } from 'react-i18next';
import { cancelPendingOrder } from '../../../rtk/slices/pendingOrderSlice/cancelPendingOrderSlice';
import pusher from '../../../helpers/pusher';
import { updateBalanceFromPusher } from '../../../rtk/slices/accountTypeSlice/accountTypeSlice';
import TradingViewChart2 from '../MarketGraph/TradingViewChart';

const Trades = () => {
    const storedToken = localStorage.getItem("token");
    const dispatch = useDispatch();
    const { binaryTrades, pendingTrades, loading, error } = useSelector((state) => state.binaryTradeHistory);
    const [activeTab, setActiveTab] = useState('1');
    const [open, setOpen] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [navAccordionOpen, setNavAccordionOpen] = useState('1'); // For navigation accordion
    const { selectedAccount } = useSelector((state) => state.accountType);
    const { t } = useTranslation();

    const activeTrades = useSelector(state => state.order.activeTrades);
    const historyRefreshKey = useSelector(state => state.order.historyRefreshKey);
    const [timers, setTimers] = useState({});

    const tabs = [
        { id: '1', label: t('XQ Trades'), title: t('Active Trades') },
        { id: '2', label: t('History'), title: t('History') },
        { id: '3', label: t('Pending'), title: t('Pending Orders') }
    ];

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            handleSwipe(isLeftSwipe);
        }
    };

    const handleSwipe = (isLeftSwipe) => {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

        if (isLeftSwipe && currentIndex < tabs.length - 1) {
            // Swipe left - go to next tab
            const nextTab = tabs[currentIndex + 1];
            setActiveTab(nextTab.id);
            setNavAccordionOpen(nextTab.id);
            handleTabChange(nextTab.id);
        } else if (!isLeftSwipe && currentIndex > 0) {
            // Swipe right - go to previous tab
            const prevTab = tabs[currentIndex - 1];
            setActiveTab(prevTab.id);
            setNavAccordionOpen(prevTab.id);
            handleTabChange(prevTab.id);
        }
    };

    const handleTabChange = (tabId) => {
        if (tabId === '2' || tabId === '3') {
            const storedToken = localStorage.getItem("token");
            dispatch(fetchBinaryTradeHistory({ startDate: formattedDate, token: storedToken }));
        }
    };

    const handleNavAccordionToggle = (tabId) => {
        setNavAccordionOpen(navAccordionOpen === tabId ? '' : tabId);
        setActiveTab(tabId);
        handleTabChange(tabId);
    };

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const filteredTrades = binaryTrades?.filter(trade => {
        if (filterType === 'win') return trade.result === 'win' || trade.win_status === 1;
        if (filterType === 'loss') return trade.result === 'loss' || trade.win_status === 0;
        return true;
    });

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggle = (id) => {
        setOpen(open === id ? '' : id);
    };

    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA');
    const formattedDate = formatter.format(date);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            dispatch(fetchBinaryTradeHistory({ startDate: formattedDate, token: storedToken }));
        }
    }, [historyRefreshKey, dispatch, formattedDate]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        Object.values(timers).forEach(clearInterval);

        const newTimers = {};

        activeTrades.forEach((trade) => {
            if (trade.remainingTime > 0) {
                newTimers[trade.id] = setInterval(() => {
                    dispatch(updateTradeTime({ id: trade.id, remainingTime: trade.remainingTime - 1 }));

                    if (trade.remainingTime - 1 <= 0) {
                        dispatch(removeTrade(trade.id));
                        clearInterval(newTimers[trade.id]);
                        dispatch(fetchBinaryTradeHistory({ startDate: formattedDate, token: storedToken }));
                    }
                }, 1000);
            }
        });

        setTimers(newTimers);

        return () => {
            Object.values(newTimers).forEach(clearInterval);
        };
    }, [activeTrades, dispatch]);

    const renderTabContent = (tabId) => {
        switch (tabId) {
            case '1':
                return (
                    <div className="no-trades text-center">
                        {activeTrades.length === 0 ? (
                            <>
                                <i className="ri-refresh-line big-icon" style={{ fontSize: "42px" }}></i>
                                <p className='text text-light fw-bold' style={{ fontSize: "16px" }}>{t('You have no open trades on this account')}</p>
                            </>
                        ) : (
                            activeTrades.map(trade => (
                                <div key={trade.id} className="cb d-flex justify-content-between align-items-center">
                                    <div className='d-flex'>
                                        <i className="ri-bit-coin-fill text-warning trade-icon"></i>
                                        <p className='mb-0'>
                                            <span className="ms-2">{trade.symbol} <br /> </span>
                                            <small className="ms-2">{trade.type || "--"}</small> <br />
                                            <div className="small ms-2" ><i className="ri-history-line"></i> {formatTime(trade.remainingTime)}</div>
                                        </p>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-danger">{trade.price}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );

            case '2':
                return (
                    <>
                        {loading && (
                            <div className="text-center my-3">
                                <Spinner color="white" />
                            </div>
                        )}
                        {error && <Alert color="danger">Error: {error}</Alert>}
                        {!loading && !error && (
                            <>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div></div>
                                    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                        <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={dropdownOpen} style={{ cursor: 'pointer' }}>
                                            <i className="ri-more-2-fill" style={{ fontSize: '24px' }}></i>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => setFilterType('all')}>{t("All Trades")}</DropdownItem>
                                            <DropdownItem onClick={() => setFilterType('win')}>{t("Winning Trades")}</DropdownItem>
                                            <DropdownItem onClick={() => setFilterType('loss')}>{t("Losing Trades")}</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <Row>
                                    <Col xs="12" className="p-0">
                                        <div style={{ height: isMobile ? '300px' : "390px",
                                            overflowY: 'auto', background: 'rgba(31,14,39,0.95)', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '8px' }}>
                                            <Accordion open={open} toggle={toggle} style={{ marginBottom: "70px", height: 'auto' }}>
                                                {filteredTrades?.map((trade) => (
                                                    <AccordionItem className='mb-2 fw-bold' key={trade.id}>
                                                        <AccordionHeader className="trade-card w-100 fw-bold" targetId={String(trade.id)} style={{
                                                            background: trade.result === 'win'
                                                                ? 'linear-gradient(rgb(31, 14, 39), rgb(60, 20, 80))'
                                                                : 'linear-gradient(rgba(46, 19, 58, 1), rgba(60, 20, 80, 1))',
                                                            color: "white"
                                                        }}>
                                                            <div className="cb d-flex justify-content-between align-items-center" style={{ color: 'white' }}>
                                                                <div className='d-flex' style={{ color: 'white' }}>
                                                                    <img src="https://cfcdn.olymptrade.com/assets1/instrument/vector/ASIA.c98e6b5283b2504d839b790a34a65587.svg" data-test="pair-name-ASIA_X" className="sc-gGuRsA cCVlOR" />
                                                                    <p className='mb-0 fw-bold' style={{ color: 'white' }}>
                                                                        <span className="ms-2 fw-bold" style={{ color: 'white' }}>{trade.symbol} {trade.accountType ? `- ${trade.accountType}` : ""} <br /> </span>
                                                                        <small className="ms-2 fw-bold" style={{ color: 'white' }}>{trade.percent || "--"}</small> <br />
                                                                        <div className="largeFontSize ms-2 fw-bold" style={{ color: 'white' }}><i className="ri-history-line"></i> {trade.duration}</div>
                                                                    </p>
                                                                </div>
                                                                <div className="text-end" style={{ color: 'white' }}>
                                                                    <div className=" fw-bold" style={{ color: 'white', fontSize: "12px" }}>
                                                                        <i className={trade.direction === "call" ? "ri-arrow-up-fill text-secondary" : "ri-arrow-down-fill text-danger"}></i>
                                                                        {Number(trade.amount)}
                                                                    </div>
                                                                    <div style={{
                                                                        fontSize: "14px", fontWeight: "500",
                                                                        color: trade.result === "win" ? "white" : "white", marginTop: "5px"
                                                                    }}>
                                                                        {trade.profit >= 0 ? `+${trade.profit}` : `-${Math.abs(trade.profit)}`}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AccordionHeader>
                                                        <AccordionBody accordionId={String(trade.id)} style={{ color: 'white' }}>
                                                            <div className="d-flex flex-column gap-3" style={{ color: 'white' }}>
                                                                <div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Income")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{Number(trade.profit).toFixed(2)}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Duration")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{trade.duration} sec</p>
                                                                    </div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Amount")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{Number(trade.amount).toFixed(2)}</p>
                                                                    </div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Opening quote")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{Number(trade.last_price).toFixed(2)}</p>
                                                                    </div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Closing quote")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{Number(trade.result_price).toFixed(2)}</p>
                                                                    </div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Trade ID")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{trade.trx}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Trade opened")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>
                                                                            {new Date(trade.created_at).toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ')}
                                                                        </p>
                                                                    </div>
                                                                    <div className="d-flex w-100 justify-content-start" style={{ color: 'white' }}>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{t("Trade Closed")}</p>
                                                                        <div className="PBFrHEcSzm"></div>
                                                                        <p className="fw-bold" style={{ color: 'white' }}>{trade.trade_ended_at}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </AccordionBody>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </>
                );

            case '3':
                return (
                    <>
                        {/* Added loading and error states for Pending tab */}
                        {loading && (
                            <div className="text-center my-3">
                                <Spinner color="white" />
                            </div>
                        )}
                        {error && <Alert color="danger">Error: {error}</Alert>}
                        {!loading && !error && (
                            <Row>
                                <Col xs="12" className="p-0">
                                    {/* Added empty state handling */}
                                    {(!pendingTrades || pendingTrades.length === 0) ? (
                                        <div className="no-trades text-center">
                                            <i className="ri-refresh-line big-icon" style={{ fontSize: "42px" }}></i>
                                            <p className='text text-light fw-bold' style={{ fontSize: "16px" }}>{t('You have no pending trades on this account')}</p>
                                        </div>
                                    ) : (
                                        <Accordion open={open} toggle={toggle} style={{ marginBottom: "70px" }}>
                                            {pendingTrades?.map((trade) => (
                                                <AccordionItem className='mb-2 fw-bold' key={trade.id}>
                                                    <AccordionHeader className="trade-card w-100 fw-bold" targetId={String(trade.id)}>
                                                        <div className="cb d-flex justify-content-between align-items-center">
                                                            <div className='d-flex'>
                                                                <img src="https://cfcdn.olymptrade.com/assets1/instrument/vector/ASIA.c98e6b5283b2504d839b790a34a65587.svg" data-test="pair-name-ASIA_X" className="sc-gGuRsA cCVlOR" />
                                                                <p className='mb-0 fw-bold'>
                                                                    <span className="ms-2 fw-bold">{trade.symbol} {trade.accountType ? `- ${trade.accountType}` : ""} <br /> </span>
                                                                    <small className="ms-2 fw-bold">{trade.percent || "--"}</small> <br />
                                                                    <div className="ms-2 fw-bold" style={{ fontSize: '1rem' }}><i className="ri-history-line"></i> {trade.duration}</div>
                                                                </p>
                                                            </div>
                                                            <div className="text-end">
                                                                <div className=" fw-bold" style={{ color: '#778383', fontSize: "12px" }}>
                                                                    <i className={trade.direction === "call" ? "ri-arrow-down-fill text-danger" : "ri-arrow-up-fill text-secondary"}></i>
                                                                    {Number(trade.amount)}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: "14px", fontWeight: "500",
                                                                    color: trade.result === "win" ? "white" : "red", marginTop: "5px"
                                                                }}>
                                                                    {trade.profit >= 0 ? `+${trade.profit}` : `-${Math.abs(trade.profit)}`}
                                                                </div>
                                                                <Button
                                                                    onClick={e => {
                                                                        e.stopPropagation();
                                                                        // Added error handling for cancel action
                                                                        dispatch(cancelPendingOrder({ order_id: trade.id }))
                                                                            .unwrap()
                                                                            .then(() => {
                                                                                const storedToken = localStorage.getItem("token");
                                                                                dispatch(fetchBinaryTradeHistory({ startDate: formattedDate, token: storedToken }));
                                                                            })
                                                                            .catch((err) => {
                                                                                console.error("Failed to cancel order:", err);
                                                                                // Optionally display an error alert
                                                                                alert(t("Failed to cancel order. Please try again."));
                                                                            });
                                                                    }}
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </AccordionHeader>
                                                    <AccordionBody accordionId={String(trade.id)}>
                                                        <div className="d-flex flex-column gap-3">
                                                            <div>
                                                                <div className="d-flex w-100 justify-content-start">
                                                                    <p className="fw-bold">{t("Closed")}</p>
                                                                    <div className="PBFrHEcSzm"></div>
                                                                    <p className="fw-bold">{t("early")}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="d-flex w-100 justify-content-start">
                                                                    <p className="fw-bold">{t("Duration")}</p>
                                                                    <div className="PBFrHEcSzm"></div>
                                                                    <p className="fw-bold">{trade.duration} sec</p>
                                                                </div>
                                                                <div className="d-flex w-100 justify-content-start">
                                                                    <p className="fw-bold">{t("Amount")}</p>
                                                                    <div className="PBFrHEcSzm"></div>
                                                                    <p className="fw-bold">{Number(trade.amount).toFixed(2)}</p>
                                                                </div>
                                                                <div className="d-flex w-100 justify-content-start">
                                                                    <p className="fw-bold">{t("Trade ID")}</p>
                                                                    <div className="PBFrHEcSzm"></div>
                                                                    <p className="fw-bold">{trade.trx}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="d-flex w-100 justify-content-start">
                                                                    <p className="fw-bold">{t("Trade opened")}</p>
                                                                    <div className="PBFrHEcSzm"></div>
                                                                    <p className="fw-bold">
                                                                        {new Date(trade.created_at).toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ')}
                                                                    </p>
                                                                </div>
                                                                <div className="d-flex w-100 justify-content-start">
                                                                    <p className="fw-bold">{t("Trade Closed")}</p>
                                                                    <div className="PBFrHEcSzm"></div>
                                                                    <p className="fw-bold">{trade.trade_ended_at || t("Pending")}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </AccordionBody>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    )}
                                </Col>
                            </Row>
                        )}
                    </>
                );

            default:
                return null;
        }
    };

    // Responsive layout: only show left section on mobile
    const isMobile = window.innerWidth <= 768;
    return (
        <div className="d-flex flex-row" style={{ width: '100%',
        

        height:isMobile ? "100%" : '94%', gap: '10px' }}>
            <Container
                style={{
                    paddingTop: isMobile ? '0px' : '25px',
                    width: isMobile ? '100%' : '20%',
                    maxWidth: isMobile ? '100%' : undefined,
                    // marginLeft: isMobile ? '0px' : 0,
                    // marginRight: isMobile ? '0px' : 'auto',
                    background: 'linear-gradient(rgb(31, 14, 39))',
                    borderRadius: '10px',
                    padding: '20px',
                    height: isMobile ? '80vh' : "89vh",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginTop: isMobile ? '0px' : '0',
                }}
            >
                <h4 className="mt-3 fw-bold" style={{ fontSize: "27px", color: 'white', margin: '10px' }}>{t('Trades')}</h4>
                {/* Navigation Accordion */}
                <div className="navigation-accordion mb-4" style={{ width: '100%' }}>
                    <Accordion open={navAccordionOpen} toggle={handleNavAccordionToggle}>
                        {tabs.map((tab) => (
                            <AccordionItem key={tab.id} className="mb-2">
                                <AccordionHeader
                                    targetId={tab.id}
                                    className="nav-accordion-header"
                                    style={{
                                        backgroundColor: navAccordionOpen === tab.id ? '#3b3040ff' : '#3b3040ff',
                                        color: navAccordionOpen === tab.id ? 'white' : 'white',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <span className="fw-bold">{tab.label}</span>
                                        <div className="d-flex align-items-center">
                                            {/* Count indicators */}
                                            {tab.id === '1' && activeTrades.length > 0 && (
                                                <span className="badge bg-warning text-dark me-2">{activeTrades.length}</span>
                                            )}
                                            {tab.id === '2' && filteredTrades && filteredTrades.length > 0 && (
                                                <span className="badge  me-2">{filteredTrades.length}</span>
                                            )}
                                            {tab.id === '3' && pendingTrades && pendingTrades.length > 0 && (
                                                <span className="badge bg-secondary me-2">{pendingTrades.length}</span>
                                            )}
                                        </div>
                                    </div>
                                </AccordionHeader>
                                <AccordionBody accordionId={tab.id}>
                                    <div
                                        className="tab-content-wrapper"
                                        onTouchStart={onTouchStart}
                                        onTouchMove={onTouchMove}
                                        onTouchEnd={onTouchEnd}
                                        style={{
                                            minHeight: '200px',
                                            position: 'relative'
                                        }}
                                    >
                                        {renderTabContent(tab.id)}
                                    </div>
                                </AccordionBody>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <style jsx>{`
                .navigation-accordion .accordion-header {
                    padding:0px;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-bottom: 4px;
                    transition: all 0.3s ease;
                }
                .navigation-accordion .accordion-header:hover {
                    color: white !important;
                }
                .navigation-accordion .accordion-body {
                    background: linear-gradient(90deg, rgb(31, 14, 39) 0%, rgb(31, 14, 39) 100%);
                    color: white;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    padding: 16px;
                    height: 450px;
                }
                    @media (max-width: 768px) {
                    .navigation-accordion .accordion-body {
                        height: calc(100vh - 400px);
                    }
                .tab-content-wrapper {
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }
                .badge {
                    font-size: 0.75rem;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                }
                @media (max-width: 768px) {
                    .navigation-accordion .accordion-header {
                        // padding: 10px 12px;
                        font-size: 14px;
                    }
                    .badge {
                        font-size: 0.65rem;
                        padding: 0.15rem 0.35rem;
                    }
                }
                .navigation-accordion .accordion-header.open {
                    background: linear-gradient(90deg, rgb(31, 14, 39) 0%, rgb(31, 14, 39) 100%);
                    color: white !important;
                }
            `}</style>
            </Container>
            {/* Only show right section on desktop */}
            {!isMobile && (
                <div style={{ width: '80%' }}>
                    <TradingViewChart2 />
                </div>
            )}
        </div>
    );
};

export default Trades;