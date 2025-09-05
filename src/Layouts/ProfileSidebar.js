import React, { useEffect, useState } from "react";
import avatar from '../assets/images/users/avatar-1.jpg'

import { useNavigate } from "react-router-dom";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Progress,
    Button,
    CardHeader,
} from "reactstrap";
import NotificationsSIdebar from "./NotificationsSIdebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUser } from "../rtk/slices/crm-slices/user/getUserSlice";

import { useTranslation } from 'react-i18next';
import { hasIn } from "lodash";
import { BathIcon } from "lucide-react";

const taradeBadgeURL = require("../images/background/trade-img.jpg");


const ProfileSidebar = ({ isOpen, toggle }) => {
    const dispatch = useDispatch();
    const [copied, setCopied] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 767);


    const { t } = useTranslation();

    const selectedAccount = JSON.parse(localStorage.getItem("selectedAccount"))
    const user = JSON.parse(localStorage.getItem("crm-user"))
    const userfromApi = useSelector(state => state.user);
    const { registeredDays, totalTrades, username, status, error } = useSelector((state) => state.user)
    const ID = selectedAccount?.account
    // console.log('reg', registeredDays);

    // console.log('user.user',userfromApi?.user);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(ID.toString()).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
        }).catch(err => console.error("Failed to copy: ", err));
    };

    const [isNotiSidebarOpen, setIsNotiSidebarOpen] = useState(false);
    const navigate = useNavigate()


    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 767);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);




    return (
        isOpen && (
            <>
                <div style={styles.overlay} onClick={toggle}>
                    <div
                        className="profile-sidebar p-6 text-white backdropeffect"
                        style={{
                            ...styles.panel,
                            transform: isOpen ? "translateX(0)" : "translateX(100%)",
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <Container>
                            <div style={styles.header}>
                                <button style={{ background: "transparent", border: "none", color: "white" }} onClick={() => setIsNotiSidebarOpen(true)}>
                                    <i className="ri-notification-2-line"></i>
                                </button>
                                <button style={styles.closeBtn} onClick={toggle}>
                                    ✕
                                </button>
                            </div>
                            <div>
                                <h3 className="fw-bold mb-3">{t('Profile')}</h3>
                                <Row className="justify-content-between align-items-center mb-4">
                                    <Col xs={8}>
                                        <h5 className="fw-bold">{user?.user?.name}</h5>
                                        <p className="small mb-0">
                                            ID <span style={{ color: "white" }}>{username ?? '...'}</span>{" "}
                                            <Button className="p-0 bg-transparent border-0" onClick={copyToClipboard}>
                                                <i className="ri-file-copy-line text-green"></i>
                                            </Button>

                                        </p>
                                    </Col>
                                    <Col xs={4} className="profile-avatar mb-2 text-end">
                                        {/* <i style={styles.avatar} className="ri-user-line"></i> */}
                                        <img style={styles.avatar} src={userfromApi?.user?.image_path || avatar} alt="user image" />
                                    </Col>

                                </Row>
                                {/* <div
                                    className="trade-badge position-relative mb-3"
                                    style={styles.tradeBadge}
                                >
                                    <small
                                        style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "5px",
                                            fontSize: "15px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {t('Trade with confidence')}
                                    </small>
                                </div> */}
                            </div>

                            <Card className="text-white mb-3  " >
                                <CardBody className="" style={{
                                    background: "transparent",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "10px",
                                    color: "white",
                                    boxShadow: "0 4px 24px rgba(82, 3, 113, 0.12)"
                                }}>
                                    <p className="mb-1 d-flex justify-content-between align-items-center fw-bold">
                                        <span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="me-3"
                                            >
                                                <path
                                                    d="M5 10.1L12 8l7 2.1V15l-7-2.1L5 15v-4.9z"
                                                    fill="#eef0f2ff"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 12.9l7 2.1v-4.9L12 8l-7 2.1V15l7-2.1zm-6.3 1.16l6.3-1.89 6.3 1.89v-3.44L12 8.73l-6.3 1.89v3.44z"
                                                    fill="url(#prefix__prefix__paint0_linear)"
                                                />
                                                <defs>
                                                    <linearGradient
                                                        id="prefix__prefix__paint0_linear"
                                                        x1="2.667"
                                                        y1="14.3"
                                                        x2="7.307"
                                                        y2="7.614"
                                                        gradientUnits="userSpaceOnUse"
                                                    >
                                                        <stop stopColor="#fff" />
                                                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            {t('Starter')}
                                        </span>
                                        <span className="text-muted fw-bold">
                                            {registeredDays ?? '...'} {t('days')}
                                        </span>

                                    </p>
                                    <small className="d-flex justify-content-between align-items-center mb-1 fw-bold" style={{ color: "white" }}>
                                        <span className="fw-bold">{t('Level')} 1</span>
                                        <span className="fw-bold">{totalTrades ?? '...'}
                                        </span>
                                    </small>
                                    <Progress value={0} max={50} color="white" className="xp-bar" />

                                </CardBody>
                            </Card>

                            <Row className="justify-content-between mb-2">
                                <Col xs={6} style={{ height: "150px", }}>
                                    <Card className="text-white p-3 d-flex flex-column justify-content-between h-100 cursor-pointer"
                                        style={{ background: "transparent", backdropFilter: "blur(20px)", borderRadius: "15px" }}
                                        onClick={() => {
                                            navigate("/wallets")
                                            toggle()
                                        }}
                                    >
                                        <i className="ri-links-line mb-2" style={{ fontSize: "25px" }}></i>
                                        <p className="mb-0 fw-bold">{t('Referral Program')}</p>
                                    </Card>
                                </Col>
                                <Col xs={6} style={{ height: "150px", }}>
                                    <Card className="text-white p-3 d-flex flex-column justify-content-between h-100 cursor-pointer"
                                        style={{ backdropFilter: "blur(20px)", background: "transparent", borderRadius: "15px" }}>
                                        <i className="ri-gift-line mb-2" style={{ fontSize: "25px" }}></i>
                                        <p className="mb-0 fw-bold">{t('Boost Cubes')}</p>
                                    </Card>
                                </Col>

                            </Row>
                            {/* {
                                isDesktop && (
                                    <>
                                        <Button size="lg" block className="text-white border-0 mt-1 d-flex align-items-center justify-content-between"
                                            style={{ backgroundColor: "#1e90ff", borderRadius: "15px" }}
                                            onClick={() => {
                                                navigate('/active-trades')
                                                toggle()
                                            }}
                                        >
                                            <i className="ri-swap-line"></i>
                                            <span className="fw-bold">{t('Trades')}</span>
                                            <span> </span>
                                        </Button>
                                        <Button size="lg" block className="text-white border-0 mt-1 d-flex align-items-center justify-content-between"
                                            style={{ backgroundColor: "#1e90ff", borderRadius: "15px" }}
                                            onClick={() => {
                                                navigate('/market')
                                                toggle()
                                            }}
                                        >
                                            <i className="ri-exchange-box-line"></i>
                                            <span className="fw-bold">{t('Market')}</span>
                                            <span> </span>
                                        </Button>
                                        <Button size="lg" block className="text-white border-0 mt-1 d-flex align-items-center justify-content-between"
                                            style={{ backgroundColor: "#1e90ff", borderRadius: "15px" }}
                                            onClick={() => {
                                                navigate('/events')
                                                toggle()
                                            }}
                                        >
                                            <i className="ri-calendar-event-line"></i>
                                            <span className="fw-bold">{t('Events')}</span>
                                            <span> </span>
                                        </Button>

                                        <Button size="lg" block className="text-white border-0 mt-1 d-flex align-items-center justify-content-between"
                                            style={{ backgroundColor: "#1e90ff", borderRadius: "15px" }}
                                            onClick={() => {
                                                navigate('/help')
                                                toggle()
                                            }}
                                        >
                                            <i class="ri-question-line"></i>
                                            <span className="fw-bold">{t('Help')}</span>
                                            <span> </span>
                                        </Button>

                                    </>
                                )
                            } */}



                            <Button size="lg" block className="text-white border-0 mt-1 d-flex align-items-center justify-content-between"
                                style={{
                                    background: "linear-gradient(90deg,  #c41a6b, #390452)",
                                    borderRadius: "15px"
                                }}
                                onClick={() => {
                                    navigate('/profile-settings')
                                    toggle()
                                }}
                            >
                                <i className="ri-settings-3-line"></i>
                                <span className="fw-bold">{t('Settings')}</span>
                                <span> </span>
                            </Button>
                        </Container >
                    </div >
                </div>
                {copied && <span className="text-secondary ms-2 position-absolute" style={{ zIndex: 99999, left: '0px', bottom: '100px', right: '0px', textAlign: 'center' }}>Copied!</span>
                }
            </>
        )
    );
};

export default ProfileSidebar;

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        zIndex: 99998,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
    },
    panel: {
        position: "fixed",
        top: "60px",
        right: "10px",
        width: "100%",
        maxWidth: "100%",
        height: "76vh",
        borderRadius: "20px",
        background: "rgba(1, 8, 14, 0.15)", // transparent dark
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "20px",
        transition: "transform 0.3s ease-in-out",
        zIndex: 99999,
        boxShadow: "10px 0px 10px rgba(0, 0, 0, 0.5)",
        overflow: "auto",
        scrollbarWidth: "none"
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
        color: "#1e90ff", // project accent color
        fontSize: "20px",
        cursor: "pointer",
    },
    closeBtn: {
        background: "none",
        border: "none",
        color: "#ff4c4c", // project error/accent color
        fontSize: "20px",
        cursor: "pointer",
    },
    avatar: {
        fontSize: "25px",
        padding: "10px",
        background: "rgba(30, 144, 255, 0.15)", // accent color with transparency
        borderRadius: "50%",
        width: '90px',
        height: '90px',
        border: "2px solid #1e90ff"
    },
    tradeBadge: {
        width: "150px",
        height: "150px",
        border: "2px solid #1e90ff",
        borderRadius: "10px",
        backgroundImage: `url(${taradeBadgeURL})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        boxShadow: "0 4px 16px rgba(30,144,255,0.2)"
    },
};
