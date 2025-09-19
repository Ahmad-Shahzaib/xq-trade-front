import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
const Help = () => {
  const { t } = useTranslation();
      const isMobile = window.innerWidth <= 768;

  // useEffect(() => {
  //   window.$crisp = [];
  //   window.CRISP_WEBSITE_ID = "1492ac6a-f1f1-4bef-8d4d-97d7df428df2";

  //   const script = document.createElement("script");
  //   script.src = "https://client.crisp.chat/l.js";
  //   script.async = true;
  //   document.head.appendChild(script);

  //   script.onload = () => {
  //     // Wait until Crisp is loaded, then apply styling
  //     window.CRISP_READY_TRIGGER = () => {
  //       const crispChatBox = document.querySelector(".cc-1m2mf");
  //       if (crispChatBox) {
  //         crispChatBox.style.bottom = "100px"; // Adjust chat box position
  //       }
  //     };
  //   };

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, []);
  return (
    <div className="page-content"
   
    style={{
                backgroundImage: `url(${trading})`,
                backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
                borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                height: isMobile ? "90vh" : "89vh"
            }}
  
    >
      <Container fluid >
        <h4 style={{ fontWeight: '800', fontSize: '27px' }}>{t('Help')}</h4>


        {/* <Link to='/profile'>
        <Card className="mb-1">
          <CardBody className="d-flex align-items-center gap-2">
            <i className="ri-message-2-line fs-3"></i>
            <div>
              <h6 className="mb-0">Chat</h6>
              <small className="text-muted">Our chatbot and support team are here to help</small>
            </div>
          </CardBody>
        </Card>
      </Link>
      <Link >
        <Card >
          <CardBody className="d-flex align-items-center gap-2">

            <i className="ri-mail-line fs-3"></i>
            <div>
              <h6 className="mb-0">English Support</h6>
              <small className="text-muted">support-en@lemontrade.com</small>
            </div>

          </CardBody>
        </Card>
      </Link> */}

        <div className="cor-w-panel__content-wrapper">
          <div data-test="help-tab" dir="ltr" style={{ margiTop: "8px" }}>
            <div className="iWQztLldWB"
              style={{
                width: "100%",
                padding: "0px",
                display: "grid",
                gap: "12px",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 1fr",
                gridAutoFlow: "row",
                alignItems: "initial",
                borderRadius: "12px",
              }}
            >
              <Link to='/chat' className="_14NmGwfthK TS4-iVM2yH YZzfCAAheO _5iBZUy61LM" data-test="help-tab_support" tabIndex="0" style={{
                padding: "0px",
                borderRadius: "12px",
                width: "100%",
                height: "100%"
              }}
              >
                <div className="iWQztLldWB" style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "138px",
                  padding: "12px 16px",
                  display: "grid",
                  gap: "12px",
                  gridAutoFlow: "row",
                  justifyContent: "space-between",
                  alignItems: "initial",
                  background: 'linear-gradient(rgb(31, 14, 39))',
                  borderRadius: '8px',

                  borderRadius: '8px',
                }}
                >
                  <svg aria-hidden="true" className="ohGHbMkZKR" focusable="false" role="presentation" viewBox="0 0 24 24"
                    data-icon="icon-support">
                    <path fill="rgba(236,249,249,1)"
                      d="M9 10c-.772-.094-1.097-.727-1-1.5C8.17 7.15 9.835 6 11.96 6c2.126 0 4.24 1 4.24 3.5 0 1.483-1.035 2.282-1.928 2.971-.677.523-1.272.982-1.272 1.629 0 .5-.3.9-.9.9-.8 0-1.1-.45-1.1-1.15 0-1.248.75-1.809 1.474-2.35.675-.504 1.326-.991 1.326-2 0-.992-.82-1.6-1.8-1.6-.98 0-1.37.598-1.5 1.1l-.006.023c-.157.605-.292 1.123-1.494.977ZM12 18.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"></path>
                    <path fill="rgba(236,249,249,1)" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10h7.913a1.2 1.2 0 0 0 1.178-1.431l-.605-3.075c.218-.428.61-1.224.806-1.794.262-.765.708-2.338.708-3.7 0-5.523-4.477-10-10-10ZM4 12a8 8 0 1 1 16 0c0 1.025-.358 2.346-.6 3.05-.19.551-.672 1.493-.816 1.768a1.2 1.2 0 0 0-.114.788L18.94 20H12a8 8 0 0 1-8-8Z" clipRule="evenodd"></path></svg>
                  <div className="iWQztLldWB" style={{
                    display: "grid",
                    gap: "4px",
                    gridAutoFlow: "row",
                    alignItems: "initial"
                  }}
                  >
                    <p className="_44tV67dU25" data-align="start" data-size="M Compact" data-style="Regular" data-test="Text"
                      style={{
                        color: "rgba(236,249,249,1)",
                        display: "block"
                      }}
                    >
                      <span data-trans="support" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Support')}</span>
                    </p>
                    <p className="_44tV67dU25" data-align="start" data-size="S Compact" data-style="Regular" data-test="Text"
                      style={{
                        color: "rgba(229,255,255,0.56)",
                        display: "block"
                      }}>
                      <span data-trans="support_description" style={{ fontSize: '13px', fontWeight: 'bold' }}>{t("We’re here for you 24/7")}</span>
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/faqs" className="_14NmGwfthK TS4-iVM2yH YZzfCAAheO _5iBZUy61LM" data-test="help-tab_help-center" tabIndex="0"
                style={{
                  padding: "0px",
                  borderRadius: "12px",
                  width: "100%",
                  height: "100%"
                }}
              >
                <div className="iWQztLldWB" style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "138px",
                  padding: "12px 16px",
                  display: "grid",
                  gap: "12px",
                  gridAutoFlow: "row",
                  justifyContent: "space-between",
                  alignItems: "initial",
                  background: 'linear-gradient(rgb(31, 14, 39))',
                  borderRadius: '8px',

                }}
                >
                  <svg aria-hidden="true" className="ohGHbMkZKR" focusable="false" role="presentation" viewBox="0 0 24 24" data-icon="icon-information">
                    <path fill="rgba(236,249,249,1)"
                      d="M13.25 8a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM13 16v-6h-2.5a.5.5 0 0 0 0 1h.5v5h-.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H13Z">
                    </path>
                    <path fill="rgba(236,249,249,1)" fillRule="evenodd"
                      d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm10-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
                      clipRule="evenodd">
                    </path>
                  </svg>
                  <div className="iWQztLldWB"
                    style={{
                      display: "grid",
                      gap: "4px",
                      gridAutoFlow: "row",
                      alignItems: "initial"
                    }}
                  >
                    <p className="_44tV67dU25" data-align="start" data-size="M Compact" data-style="Regular" data-test="Text" style={{
                      color: "rgba(236, 249, 249, 1)",
                      display: "block"
                    }}>
                      <span data-trans="ct_helpcenter_title" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Help Center')}</span>
                    </p>
                    <p className="_44tV67dU25" data-align="start" data-size="S Compact" data-style="Regular" data-test="Text" style={{
                      color: "rgba(229, 255, 255, 0.56)",
                      display: "block"
                    }}>
                      <span data-trans="navigation_item_faq_desc_new" style={{ fontSize: '13px', fontWeight: 'bold' }}>{t('Get to know the platform')}</span>
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/education-center" className="_14NmGwfthK TS4-iVM2yH YZzfCAAheO _5iBZUy61LM" data-test="help-tab_education" tabIndex="0" style={{
                padding: "0px",
                borderRadius: "12px",
                width: "100%",
                height: "100%"
              }}
              >
                <div className="iWQztLldWB" style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "138px",
                  padding: "12px 16px",
                  display: "grid",
                  gap: "12px",
                  gridAutoFlow: "row",
                  justifyContent: "space-between",
                  alignItems: "initial",
                  background: 'linear-gradient(rgb(31, 14, 39))',
                  borderRadius: '8px',

                }}
                >
                  <svg aria-hidden="true" className="ohGHbMkZKR" focusable="false" role="presentation" viewBox="0 0 24 24" data-icon="icon-education"><path fill="rgba(236,249,249,1)" fillRule="evenodd" d="M4 11.236V16a1 1 0 1 1-2 0V9h.015c0-.706.365-1.412 1.095-1.783l7.984-4.057a2 2 0 0 1 1.812 0l7.984 4.057c1.46.741 1.46 2.825 0 3.566L18 12.252V16.5c0 1.382-.802 2.532-1.891 3.294C15.017 20.56 13.561 21 12 21c-1.56 0-3.017-.441-4.109-1.206C6.801 19.032 6 17.882 6 16.5v-4.248l-2-1.017Zm8-6.293L4.016 9 12 13.057 19.985 9 12 4.943ZM8 16.5v-3.232l3.094 1.572a2 2 0 0 0 1.812 0L16 13.268V16.5c0 .55-.318 1.151-1.038 1.656-.717.502-1.761.844-2.962.844-1.2 0-2.245-.342-2.962-.844C8.318 17.65 8 17.05 8 16.5Z" clipRule="evenodd"></path></svg><div className="iWQztLldWB" style={{
                    display: "grid",
                    gap: "4px",
                    gridAutoFlow: "row",
                    alignItems: "initial"
                  }}
                  >
                    <p className="_44tV67dU25" data-align="start" data-size="M Compact" data-style="Regular" data-test="Text" style={{
                      color: "rgba(236, 249, 249, 1)",
                      display: "block"
                    }}>
                      <span data-trans="navigation_item_education_title" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Education')}</span>
                    </p>
                    <p className="_44tV67dU25" data-align="start" data-size="S Compact" data-style="Regular" data-test="Text" style={{
                      color: "rgba(229, 255, 255, 0.56)",
                      display: "block"
                    }}>
                      <span data-trans="navigation_item_education_desc" style={{ fontSize: '13px', fontWeight: 'bold' }}>{t('Expand your knowledge')}</span>
                    </p>
                  </div>

                </div>
              </Link>
              <Link to="/xq-trade-tutorial" className="_14NmGwfthK TS4-iVM2yH YZzfCAAheO _5iBZUy61LM" data-test="help-tab_trading-tutorials" tabIndex="0" style={{
                padding: "0px",
                borderRadius: "12px",
                width: "100%",
                height: "100%"
              }}
              >
                <div className="iWQztLldWB" style={{
                  width: "100%",
                  height: "100%",
                  minHeight: "138px",
                  padding: "12px 16px",
                  display: "grid",
                  gap: "12px",
                  gridAutoFlow: "row",
                  justifyContent: "space-between",
                  alignItems: "initial",
                  background: 'linear-gradient(rgb(31, 14, 39))',
                  borderRadius: '8px',

                }}
                >
                  <svg aria-hidden="true" className="ohGHbMkZKR" focusable="false" role="presentation" viewBox="0 0 24 24" data-icon="icon-platform"><path fill="rgba(236,249,249,1)" fillRule="evenodd" d="M7 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7Zm13 10V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v8h1.441l1.495-2.429A1.2 1.2 0 0 1 7.958 12h3.402l2.333-5.055a1.2 1.2 0 0 1 2.147-.066L18.597 12H20ZM4 17h1.888a1.2 1.2 0 0 0 1.022-.571L8.405 14h3.467a1.2 1.2 0 0 0 1.09-.697l1.876-4.066 2.225 4.132a1.2 1.2 0 0 0 1.056.631H20v3a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" clipRule="evenodd"></path></svg><div className="iWQztLldWB" style={{
                    display: "grid",
                    gap: "4px",
                    gridAutoFlow: "row",
                    alignItems: "initial"
                  }}
                  >
                    <p className="_44tV67dU25" data-align="start" data-size="M Compact" data-style="Regular" data-test="Text" style={{
                      color: "rgba(236, 249, 249, 1)",
                      display: "block"
                    }}>
                      <span data-trans="navigation_item_onboarding_title_new" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Trading Tutorials')}</span>
                    </p>
                    <p className="_44tV67dU25" data-align="start" data-size="S Compact" data-style="Regular" data-test="Text" style={{
                      color: "rgba(229, 255, 255, 0.56)",
                      display: "block"
                    }}>
                      <span data-trans="navigation_item_onboarding_desc_new" style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('Learn how to open a trade')}</span>
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Help;
