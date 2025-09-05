import React from "react";
import { Container, Button } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
import { useTranslation } from 'react-i18next';

const ContactsScreen = ({ isOpen, toggle }) => {
     const { t } = useTranslation();
    return (
        <div style={{
            ...styles.panel,
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            background: 'rgb(29, 10, 37)',
        }} >
            <Container className="py-3" style={{ maxWidth: "400px" }}>
                <div className="w-100" style={styles.header}>
                    <h4 className="mb-0">{t('Verification')}</h4>
                    <button style={styles.closeBtn} onClick={toggle}>
                        ✕
                    </button>
                </div>

                {/* <h6 className="text-muted">{t('CONTACTS')}</h6> */}
                {/* <ListGroup className="mb-3">
                    <ListGroupItem className="d-flex justify-content-between align-items-center bg-dark text-white border-0 rounded-3 mb-2">
                        <div>
                            <i className="ri-mail-line me-2"></i> {t('Confirm Email')}
                        </div>
                        <i className="ri-error-warning-line text-warning"></i>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between align-items-center bg-dark text-white border-0 rounded-3">
                        <div>
                            <i className="ri-phone-line me-2"></i> {t('Confirm Phone Number')}
                        </div>
                        <i className="ri-error-warning-line text-warning"></i>
                    </ListGroupItem>
                </ListGroup> */}

                <h6 className="text-muted">{t('CONNECTIONS')}</h6>
                <ListGroup>
                    <ListGroupItem className="d-flex justify-content-between align-items-center bg-dark text-white border-0 rounded-3 mb-2">
                        <div>
                            <i className="ri-facebook-box-fill me-2"></i> {t('Connect Facebook')}
                        </div>
                        <i className="ri-arrow-right-s-line"></i>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between align-items-center bg-dark text-white border-0 rounded-3">
                        <div>
                            <i className="ri-google-fill me-2"></i> {t('Google')}
                            <div className="text-success small">{t('Connected')}</div>
                        </div>
                        <i className="ri-check-line text-success"></i>
                    </ListGroupItem>
                </ListGroup>
            </Container>
        </div>
    );
};

export default ContactsScreen;

const styles = {
    panel: {
        position: "fixed",
        top: "0",
        right: "0",
        width: "100%",
        maxWidth: "100%",
        height: "100vh",
        background: "#111",

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
}