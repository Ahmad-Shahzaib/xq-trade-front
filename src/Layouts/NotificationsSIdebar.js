import React, { useState } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Progress,
    Button,
    CardHeader,
    Label, Input
} from "reactstrap";

const NotificationsSIdebar = ({ isOpen, toggle }) => {
    const [notifications, setNotifications] = useState({
        terminal: false,
        signals: false,
        activities: false,
        rewards: false,
        platform: false,
        education: false,
        tradingNews: false,
        pushNotifications: false,
    });

    const toggleNotification = (key) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    return (
        <div
            className="profile-sidebar p-3 text-white"
            style={{
                ...styles.panel,
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
            }}
        >
            <Container>
                <div style={styles.header}>
                    <button className='p-0' style={styles.closeBtn} onClick={toggle}>
                        <i class="ri-arrow-left-s-line"></i>
                    </button>
                </div>
                <div>
                    <h3 className="fw-bold mb-3">Notifications</h3>
                    <Row className="mt-3">
                        {Object.entries(notifications).map(([key, value]) => (
                            <Col xs={12} key={key} className="py-2 border-bottom d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0 text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</h6>
                                    <small className="text-muted">
                                        {key === "terminal" && "Price alerts and trade results"}
                                        {key === "signals" && "Alerts from Intraday or Swing signal subscriptions"}
                                        {key === "activities" && "Events you can participate in"}
                                        {key === "rewards" && "Rewards, progress alerts and new tasks"}
                                        {key === "platform" && "News and useful trading tips and information"}
                                        {key === "education" && "Webinars from our trading experts"}
                                        {key === "tradingNews" && "Economic and market news"}
                                        {key === "pushNotifications" && "Receive chosen alerts on your device"}
                                    </small>
                                </div>
                                <Label className="switch">
                                    <Input type="checkbox" checked={value} onChange={() => toggleNotification(key)} />
                                    <span className="slider round"></span>
                                </Label>
                            </Col>
                        ))}
                    </Row>

                </div>

                <style>
                    {`
          .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 34px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #1e90ff;
          }
          input:checked + .slider:before {
            transform: translateX(14px);
          }
        `}
                </style>
            </Container>
        </div>
    )
}

export default NotificationsSIdebar



const styles = {
    panel: {
        position: "fixed",
        top: "0",
        right: "0",
        width: "100%",
        maxWidth: "100%",
        height: "100vh",
        background: "#111",
        padding: "20px",
        transition: "transform 0.3s ease-in-out",
        zIndex: 9999,
        boxShadow: "4px 0px 10px rgba(0, 0, 0, 0.5)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        marginBottom: "20px",
    },
    title: {
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: "20px",
        cursor: "pointer",
    },
    closeBtn: {
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: "20px",
        cursor: "pointer",
    },


};
