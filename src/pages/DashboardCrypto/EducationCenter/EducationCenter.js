import { divide, isSymbol } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Container,
} from 'reactstrap';
import BackButton from '../../../Layouts/BackButton';

const EducationCenter = () => {
  const [open, setOpen] = useState('');
  const { t } = useTranslation();

  const toggle = (id) => {
    setOpen(open === id ? '' : id);
  };
  const isMobile = window.innerWidth <= 768;

  const sections = [
    {
      id: '1',
      title: 'Trading Basics',
      content: (
        <ul>
          <li>{t("What is Binary Options?")}</li>
          <li>{t("How XQ Trade works")}</li>
          <li>{t("Understanding “Up” and “Down” predictions")}</li>
          <li>{t("Demo vs. Real account trading")}</li>
        </ul>
      ),
    },
    {
      id: '2',
      title: 'How to Use the XQ Trade App (APK)',
      content: (
        <ul>
          <li>{t("Installing the app via APK from our website")}</li>
          <li>{t("Creating and verifying your account")}</li>
          <li>{t("Making deposits using Bank Cards or USDT (TRC20)")}</li>
          <li>{t("Placing your first trade")}</li>
          <li>{t("Withdrawing profits via USDT (TRC20)")}</li>
        </ul>
      ),
    },
    {
      id: '3',
      title: 'Market Analysis Tools',
      content: (
        <ul>
          <li>{t("Price charts")}</li>
          <li>{t("Indicators (Moving Averages, RSI, Bollinger Bands)")}</li>
          <li>{t("Market trends")}</li>
          <li>{t("Candlestick patterns")}</li>
        </ul>
      ),
    },
    {
      id: '4',
      title: 'Trading Strategies',
      content: (
        <>
          <ul>
            <li>{t("Trend Following Strategy")}</li>
            <li>{t("Breakout Strategy")}</li>
            <li>{t("Reversal Trading")}</li>
            <li>{t("News-Based Trading")}</li>
            <li>{t("Support & Resistance Strategy")}</li>
          </ul>
          <p>
            {t("Each strategy includes, Explanation, Setup in XQ Trade, and Risk Tips")}
          </p>
        </>
      ),
    },
    {
      id: '5',
      title: 'Risk Management',
      content: (
        <ul>
          <li>{t("Setting trade limits")}</li>
          <li>{t("Using stop-loss rules")}</li>
          <li>{t("Managing your balance responsibly")}</li>
          <li>{t("Avoiding emotional trading")}</li>
        </ul>
      ),
    },
    {
      id: '6',
      title: 'Frequently Asked Questions (FAQs)',
      content: (
        <p>{t("Quick answers to the most common trading and platform-related questions.")}</p>
      ),
    },
    {
      id: '7',
      title: 'Start Learning Now',
      content: (
        <ul>
          <li>{t("Demo Account, Practice with virtual funds before using real money.")}</li>
          <li>{t("Interactive Lessons, In-app modules and visual guides.")}</li>
          <li>{t("24/7 Support, Get help any time as you learn.")}</li>
          <li>{t("Coming Soon, Live Webinars, Daily Market Analysis, One-on-One Coaching")}</li>
        </ul>
      ),
    },
  ];

  return (
    <div className='page-content'
    >

      <Container className="" style={{
        background: 'rgb(29, 10, 37)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
         overflowY: window.innerWidth <= 768 ? 'scroll' : 'auto',
        height: window.innerWidth <= 768 ? 'calc(100% - 100px)' : '89vh',
        paddingBottom: '40px',
        maxWidth: '100%',

      }}>
        <BackButton />

        <div className="text-center mb-4">
          <h2 className="text-white">
            <i className="remixicon ri-graduation-cap-line me-2"></i>
            {t('XQ Trade – Education Center')}
          </h2>
          <h5 className="mt-3">{t('Learn. Practice. Trade with Confidence.')}</h5>
          <p className="text-muted">
            {t("At XQ Trade, we believe that knowledge is the key to successful trading.Whether you're new to binary options or looking to sharpen your strategies,our Education Center offers the tools and guidance you need to trade smarter and more confidently.")}
          </p>
        </div>

        <Accordion open={open} toggle={toggle} >
          {sections.map(({ id, title, content }) => (
            <AccordionItem key={id}

              // change accordion item arrow and background color
              flush
              style={{
                background: 'rgb(29, 10, 37)',
                color: 'white',
              }}>
              <AccordionHeader
                targetId={id}
                className={open === id ? 'text-secondary' : ''}
                style={open === id ? { backgroundColor: 'rgba(93, 119, 237, 0.1)' } : {}}
              >
                <span className="me-2">
                  <i className="ri-arrow-right-s-line" style={{ color: 'white' }}></i>
                </span>
                <span className="text-white">
                  {t(title)}
                </span>
              </AccordionHeader>
              <AccordionBody style={{
                padding: isMobile ? '10px' : '',
              }} accordionId={id}>{content}</AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};

export default EducationCenter;
