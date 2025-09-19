import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import VerificationScreen from "./VerificationScreen";
import ContactsScreen from "./ContactsScreen.";
import NotificationsSIdebar from "../../../Layouts/NotificationsSIdebar";
import { handleLogout } from "../../../utils/menuUtils";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from "../../../Layouts/BackButton";

const ProfileSettings = () => {
  const dispatch = useDispatch()
  const [isVarificationbarOpen, setIsVarificationbarOpen] = useState(false);
  const [isCOntactbarOpen, setIsCOntactbarOpen] = useState(false);

  const [isNotiSidebarOpen, setIsNotiSidebarOpen] = useState(false);
  const navigate = useNavigate()

  const { t } = useTranslation();

  return (
    <div className="page-content pb-5"
      style={{
        backgroundImage: `url(${trading})`,
        backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
        borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
        height: window.innerWidth <= 768 ? 'calc(100% - 10px)' : '89vh',
      }}>
      <BackButton />
      <Container fluid >
        <h4 className="mb-3 fw-bold">{t('Settings')}</h4>

        <h6 className="fw-bold text-uppercase">{t('Profile')}</h6>
        <div className="mb-3">
          <Link to='/profile'>
            <Card className="mb-0" style={{ borderRadius: '8px 8px 0 0' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-user-line me-2 fs-3 pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Personal Information')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link onClick={() => setIsCOntactbarOpen(true)}>
            <Card className="mb-0" style={{ borderRadius: '0px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">

                <i className="ri-mail-line me-2 fs-3 fw-bold pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3 ">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Contacts')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>

              </CardBody>
            </Card>
          </Link>

          {/* <Link onClick={() => setIsVarificationbarOpen(true)}>
            <Card className="mb-0" style={{ borderRadius: '0 0 8px 8px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">

                <i className="ri-shield-user-line me-2 fs-3 fw-bold pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Account Verification')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>

              </CardBody>
            </Card>
          </Link> */}


        </div>


        <h6 className=" fw-bold text-uppercase">{t('Security')}</h6>
        <div className="mb-3">
          <Link to='/change-password'>
            <Card className="mb-0" style={{ borderRadius: '8px 8px 0 0' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-lock-password-line me-2 fs-3 pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3 ">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Password')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>
              </CardBody>
            </Card>
          </Link>
          {/* <Link to="/two-factor-authentication">
            <Card className="mb-0" style={{ borderRadius: '0px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-lock-2-line me-2 fs-3 fw-bold pb-3"></i>
                <div className="d-flex align-items-center flex-grow-1 pb-3 pe-3 border-bottom">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Two-factor Authentication')}</h6>

                  <i className="ri-error-warning-line text-warning me-2"></i>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>

              </CardBody>
            </Card>
          </Link> */}
          <Link to='/app-pin'>
            <Card className="mb-0" style={{ borderRadius: '0px 0px 8px 8px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-apps-2-line me-2 fs-3 pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('App PIN')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>

        <h6 className="text-grey fw-bold text-uppercase">{t('General')}</h6>
        <div className="mb-3">
          <Link to='/platform-settings'>
            <Card className="mb-0" style={{ borderRadius: '8px 8px 0px 0px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-settings-3-line me-2 fs-3 pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Trading Platform')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>
              </CardBody>
            </Card>
          </Link>
          {/* <Link to='/platform-settings'>
            <Card className="mb-0" style={{ borderRadius: '0px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-layout-masonry-line me-2 fs-3 pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3 border-bottom">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Appearance & Sound')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>
              </CardBody>
            </Card>
          </Link> */}
          {/* <Link onClick={() => setIsNotiSidebarOpen(true)}>
            <Card className="mb-0" style={{ borderRadius: '0px 0px 8px 8px' }}>
              <CardBody className="d-flex align-items-center pe-0 pb-0">
                <i className="ri-notification-3-line me-2 fs-3 pb-3"></i>
                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3">
                  <h6 className="mb-0 fw-bold flex-grow-1">{t('Notifications')}</h6>
                  <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                </div>
              </CardBody>
            </Card>
          </Link> */}
        </div>
        <Button
          size="lg"
          className="mb-2 fw-bold d-flex w-100 border-0 "
          style={{
            background: "linear-gradient(90deg, #c41a6b, #390452)",
            border: "none",
            borderRadius: 10,
            padding: "12px 28px",
            fontWeight: 600,
            fontSize: 18,
            boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          onClick={() => handleLogout(dispatch, navigate)} // ✅ Correct: Pass function inside arrow function
        >
          <i className="ri-logout-box-line me-2 fw-bold" style={{ color: "rgba(255, 87, 101, 1)" }}></i>
          <span className="fw-bold">{t('Log out')}</span>
          <span></span>
        </Button>
        {/* <p className="text-center mb-5 fw-bold">{t('Delete Profile')}</p> */}
      </Container>

      <VerificationScreen
        isOpen={isVarificationbarOpen}
        toggle={() => setIsVarificationbarOpen(false)}
      />
      <ContactsScreen
        isOpen={isCOntactbarOpen}
        toggle={() => setIsCOntactbarOpen(false)}
      />

      <NotificationsSIdebar
        isOpen={isNotiSidebarOpen}
        toggle={() => setIsNotiSidebarOpen(false)}
      />
    </div>
  );
};

export default ProfileSettings;
