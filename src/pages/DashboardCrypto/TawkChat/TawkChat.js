import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { Container, Card, CardBody, CardTitle, Badge, Button, Spinner, Col } from "reactstrap";
import { fetchTawkData } from "../../../rtk/slices/tawkSlice/tawkSlice";
import { fetchTickets } from "../../../rtk/slices/supportTicketSlices/ticketListSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { fetchTicketDetails } from "../../../rtk/slices/supportTicketSlices/ticketShowSlice";

import { useTranslation } from 'react-i18next';
import BackButton from "../../../Layouts/BackButton";
// Ticket Status Mapping with Badge Colors
 
const STATUS_MAP = {
    0: { label: "Open", color: "warning" },
    1: { label: "Answered", color: "success" },
    2: { label: "Replied", color: "info" },
    3: { label: "Closed", color: "danger" },
};

// Priority Mapping with Badge Colors
const PRIORITY_MAP = {
    1: { label: "Low", color: "secondary" },
    2: { label: "Medium", color: "primary" },
    3: { label: "High", color: "danger" },
};

const TawkChat = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tickets, loading, error } = useSelector((state) => state.tickets);
    const { t } = useTranslation();
    // console.log('support tickets,', tickets); // Removed console.log


    useEffect(() => {
        dispatch(fetchTickets()); // Fetch tickets when the component mounts
    }, [dispatch]);

const handleViewTicket = (ticketId) => {
        dispatch(fetchTicketDetails(ticketId)).then(() => {
            navigate(`/ticket-show/${ticketId}`);
        });
    };

    return (
        <div className="page-content" style={{
            background: 'rgb(29, 10, 37)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            height: "89vh"
        }}>
            <BackButton />
            
            <Container className="mt-4">
                <div className="d-flex align-items-center justify-content-between">
                    <h4 className="fw-bold" style={{ fontSize: '27px', }}>{t('Support')}</h4>
                    <button className="actionButtonLite" 
                    style={{
                        background:'linear-gradient(90deg, #c41a6b, #390452)',
                        color: 'white',
                        fontSize: '16px',
                        padding: '5px 10px',
                    }}

                        onClick={()=>{
                            navigate('/support-tickets/create')
                        }}
                    >{t('New Ticket')}</button>
                </div>
                <p className="mb-3" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t("Want to get in touch? Here's how you can reach us.")}</p>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Spinner color="light" /> <span className="ml-2" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Loading')}...</span>
                    </div>
                ) : tickets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tickets.map((ticket) => (
                            <Col key={ticket.id} md={6} lg={4} className="mb-4">
                                <Card className="h-100 shadow-sm border-0 hover-shadow">
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                <i className="ri-ticket-2-line text-primary me-2 ri-lg"></i>
                                                <CardTitle tag="h5" className="mb-0" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                                    {ticket.subject} [#{ticket.ticket}]
                                                </CardTitle>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mb-3">
                                            <Badge
                                                color={STATUS_MAP[ticket.status]?.color}
                                                className="d-flex align-items-center gap-1"
                                                style={{ fontSize: '13px', }}
                                            >
                                                <i className={STATUS_MAP[ticket.status]?.icon}></i>
                                                {STATUS_MAP[ticket.status]?.label}
                                            </Badge>
                                            <Badge color={PRIORITY_MAP[ticket.priority]?.color} style={{ fontSize: '13px', }}>
                                                <i className="ri-flag-2-line me-1"></i>
                                                {PRIORITY_MAP[ticket.priority]?.label}
                                            </Badge>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted fw-bold" style={{ fontSize: '13px', }}>
                                                <i className="ri-time-line me-1"></i>
                                                {t('Last updated')}: {new Date(ticket.updated_at).toLocaleDateString()}
                                            </small>
                                            <Button
                                            style={{
                                                background:'linear-gradient(90deg, #c41a6b, #390452)',
                                                color: 'white',
                                                fontSize: '13px',
                                            }}
                                                color="link"
                                                className="p-0 d-flex align-items-center gap-1 text-decoration-none"
                                                onClick={() => handleViewTicket(ticket.ticket)}
                                            >
                                                {t('View Details')}
                                                <i className="ri-arrow-right-line"></i>
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-lg fw-bold" style={{ fontSize: '13px', }}>{t('No tickets found.')}</div>
                )}

            </Container>
        </div>
    );
};

export default TawkChat;


