import React from "react";
import { Container, Button } from "reactstrap";
import { useTranslation } from 'react-i18next';


const VerificationScreen = ({ isOpen, toggle }) => {

    const { t } = useTranslation();
    
    return (
        <div style={{
            ...styles.panel,
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }} >
            <Container className="d-flex flex-column justify-content-between align-items-center text-center h-100">
                <div className="w-100" style={styles.header}>
                    <h5 className="mb-0">{t('Verification')}</h5>
                    <button style={styles.closeBtn} onClick={toggle}>
                        ✕
                    </button>
                </div>
                <div>
                    <i className="ri-user-follow-line" style={{ fontSize: "60px", color: "gray" }}></i>
                    <h5 className="mt-3 font-weight-bold">{t("You don't need to get verified for now")}</h5>
                    <p className="text-muted px-3">
                        {t("We'll let you know once you need to get verified. Verification is a mandatory process for financial market participants. With its help, we're able to create a safe space for trading where you can be sure that your funds are secure.")}
                    </p>
                </div>

                <Button color="dark" className="w-100 mt-3">{t('Learn More')}</Button>
            </Container>
        </div>
    );
};

export default VerificationScreen;

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
}