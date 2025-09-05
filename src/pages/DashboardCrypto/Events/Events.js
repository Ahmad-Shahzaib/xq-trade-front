import React, { useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../rtk/slices/MarketAndEventsSlice/GetEventsSlice";
import { useTranslation } from 'react-i18next';
import TradingViewChart2 from "../MarketGraph/TradingViewChart";
import event from '../../../assets/images/markete/Event 01.png';

const Events = () => {
    const { t } = useTranslation();
    const link = 'https://www.google.com';
    const dispatch = useDispatch();
    const { events, isLoading, isError } = useSelector((state) => state.events);
    const isMobile = window.innerWidth <= 768;

    const stripHtml = (htmlString) => {
        const div = document.createElement("div");
        div.innerHTML = htmlString;
        return div.textContent || div.innerText || "";
    };

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    // useEffect(() => {
    //     if (link) {
    //         setTimeout(() => {
    //             window.open(link, '_blank'); // Opens in a new tab
    //         }, 5000); // Delay for 5 seconds

    //     }
    // }, [link]);


    // Import TradingViewChart2 as in Market.js
    // Use require to avoid breaking import

    // Responsive layout: left column for events, right for TradingViewChart2 (desktop only)
    return (
        <div className="page-content" style={{ gap: '10px', display: 'flex', paddingTop: window.innerWidth <= 768 ? '20px' : undefined }}>
            {/* Left section: visible on all devices */}
            <div
                style={{
                    width: '20%',
                    height: isMobile ? '77vh' : '89vh',
                    minWidth: '0px',
                    background: 'linear-gradient(rgb(31, 14, 39))',
                    maxWidth: '450px',
                    display: window.innerWidth <= 768 ? 'flex' : 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    paddingRight: '0px',
                    // marginRight: '7px',
                    borderRadius: '10px',
                    overflowY: isMobile ? 'hidden' : 'auto',
                    marginLeft: window.innerWidth <= 768 ? '' : '',
                    ...(window.innerWidth > 768 ? { display: 'flex' } : {
                        width: '100%', maxWidth: '100%', marginTop:

                            isMobile ? "10px" : "10px"
                    })
                }}
            >
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '16px',
                    alignItems: 'center', justifyContent: "center",
                    padding: '10px'
                }}>

                    <img src={event} alt="Event" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />

                </div>
            </div>
            {/* Right section: TradingViewChart2, only visible on desktop */}
            {window.innerWidth > 768 && (
                <div style={{ width: '80%' }}>
                    <TradingViewChart2 />
                </div>
            )}
        </div>
    );
};

export default Events;
