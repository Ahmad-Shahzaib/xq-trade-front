
import React from "react";
import { useEffect } from "react";
import { Modal, ModalBody } from "reactstrap";
import "./CustomHeaderModal.css";
const isMobile = window.innerWidth <= 768;


const CustomHeaderModal = ({
    isOpen,
    toggle,
    pair = "AUD/CAD OTC",
    forecast = "BUY",
    amount = "$1,000",
    title = "TRADE ORDER",
    subTitle = "PLACED",
    order = true,
    finalResult,
    buy


}) => {
    // console.log("CustomHeaderModal Rendered", { isOpen, pair, forecast, amount, title, subTitle, order, finalResult, buy });
    // Timer logic removed; should be handled by parent
    useEffect(() => {
        // console.log(pair, "selectedSymbol pairs"); // Removed console.log
    }, [pair]); // Only logs when `pair` changes
    return (
        <Modal isOpen={isOpen} toggle={toggle} className="custom-header-modal" contentClassName="trade-order-modal"
            style={{ width: isMobile ? '50%' : '', width: '50%' }}
        >
            <ModalBody style={{
                padding: 0, borderRadius: 20, background: "transparent", backdropFilter: "blur(10px)", minHeight: 200, color: '#fff', position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                <div style={{ padding: 24, borderRadius: 20, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Top: Trade Order + check */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 400, letterSpacing: 1 }}>{title}</div>
                            {
                                order && (
                                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 0 }}>{subTitle}</div>

                                )
                            }
                        </div>
                        <div style={{ background: 'rgba(60,255,100,0.15)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                buy || finalResult ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="10" fill="#3cff64" />
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <circle cx="10" cy="10" r="10" fill="#EF5350" />
                                        <path d="M6 10.5L9 13.5L14 8.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )
                            }
                        </div>
                    </div>
                    {/* Center: Pair + icon */}
                    <div style={{ textAlign: 'left', margin: '16px 0 10px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 40, letterSpacing: 1 }}>{pair}</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 17L10 11L14 15L20 9" stroke="#3cff64" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="20" cy="9" r="2" fill="#3cff64" /></svg>
                    </div>
                    {/* Bottom: Forecast & Amount */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
                        <div>
                            <div style={{ fontSize: 10, opacity: 0.7 }}>
                                {
                                    order ? "Forecast" : "PAYOUT"
                                }
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{forecast}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, opacity: 0.7 }}>AMOUNT</div>
                            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{amount}</div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default CustomHeaderModal;