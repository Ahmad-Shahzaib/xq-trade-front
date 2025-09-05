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

const XQTradeTutorial = () => {
    const [open, setOpen] = useState('');

    const { t } = useTranslation()

    const toggle = (id) => {
        setOpen(open === id ? '' : id);
    };

    const steps = [
        {
            id: '1',
            title: 'Register and Install the App',
            content: (
                <>
                    <ul>
                        <li>{t("Visit the official XQ Trade website.")}</li>
                        <li>{t("Download the XQ Trade APK for Android devices.")}</li>
                        <li>{t("Install the app and complete the registration form.")}</li>
                    </ul>
                </>
            ),
        },
        {
            id: '2',
            title: 'Fund Your Account',
            content: (
                <>
                    <p>{t("Deposit a minimum of $10 to start trading.")}</p>
                    <p>{t("Available payment methods")}:</p>
                    <ul>
                        <li>{t("Bank Card (Visa, MasterCard)")}</li>
                        <li>{t("USDT (TRC20)")}</li>
                    </ul>
                    <p>{t("Your funds will appear shortly after the transaction is completed.")}</p>
                </>
            ),
        },
        {
            id: '3',
            title: 'Explore the Trading Interface',
            content: (
                <ul>
                    <li>{t("Asset selection panel (currencies, cryptocurrencies, commodities)")}</li>
                    <li>{t("Price charts and technical indicators")}</li>
                    <li>{t("Trade amount and expiry time settings")}</li>
                    <li>{t("Trade direction buttons Up and Down")}</li>
                </ul>
            ),
        },
        {
            id: '4',
            title: 'Choose an Asset to Trade',
            content: (
                <>
                    <p>{t("Select an asset (e.g., BTC/USD or EUR/USD).")}</p>
                    <p>{t("Study price charts and trends to make informed predictions.")}</p>
                </>
            ),
        },
        {
            id: '5',
            title: 'Set Your Trade Parameters',
            content: (
                <>
                    <ul>
                        <li>{t("Minimum trade amount is $1")}</li>
                        <li>{t("Choose expiry time (1 min, 5 min, 1 hour)")}</li>
                    </ul>
                </>
            ),
        },
        {
            id: '6',
            title: 'Make Your Prediction',
            content: (
                <p>{t("Predict whether the price will go")} <strong className="text-success">{t("Up")}</strong> {t("or")} <strong className="text-danger">{t("Down")}</strong> {t("by expiry time. Tap the button to confirm.")}</p>
            ),
        },
        {
            id: '7',
            title: 'Monitor Your Trade',
            content: (
                <p>{t("Watch the live chart to track progress. You’ll see potential payout and profit during the trade.")}</p>
            ),
        },
        {
            id: '8',
            title: 'Check the Outcome',
            content: (
                <p>
                    {t("Once expired, your profit (up to 98%) will be added if correct. Otherwise, the invested amount will be deducted.")}
                </p>
            ),
        },
        {
            id: '9',
            title: 'Practice with a Demo Account',
            content: (
                <p>{t("Use the Demo Account to practice without risk. Easily switch between demo and live modes in the app.")}</p>
            ),
        },
        {
            id: '10',
            title: 'Withdraw Your Profits',
            content: (
                <ul>
                    <li>{t("Only via USDT (TRC20)")}</li>
                    <li>{t("Enter amount and TRC20 wallet address")}</li>
                    <li>{t("Withdrawals process within 1–3 business days")}</li>
                </ul>
            ),
        },
        {
            id: '11',
            title: 'Tips for Successful Trading',
            content: (
                <ul>
                    <li>{t("Start small and scale gradually")}</li>
                    <li>{t("Use technical analysis tools")}</li>
                    <li>{t("Set limits and avoid emotional decisions")}</li>
                    <li>{t("Learn through the XQ Trade Education Center")}</li>
                </ul>
            ),
        },
    ];

    return (
        <div className="page-content" style={{
            background: 'rgb(29, 10, 37)',
            color: 'white',
            padding: '5px',
            borderRadius: '10px',
            overflowY: window.innerWidth <= 768 ? 'scroll' : 'auto',
            height: window.innerWidth <= 768 ? 'calc(100% - 10px)' : '89vh',
        }}>
            <BackButton />
            <Container className="">
                <h2 className="text-white mb-4 text-center">
                    <i className="remixicon ri-bar-chart-grouped-line me-2"></i>
                    {t("XQ Trade – Trading Tutorial")}
                </h2>
                <h5 className="mt-3 text-center">{t("Welcome to XQ Trade!")}</h5>
                <p className="text-muted text-center">
                    {t("Start your journey to becoming a confident trader with this simple guide. Follow the steps below to learn how to trade binary options on our platform.")}

                </p>
                <div className="text-center mb-4"></div>

                <Accordion open={open} toggle={toggle} >
                    {steps.map(({ id, title, content }) => (
                        <AccordionItem key={id} style={{
                            background: 'rgb(29, 10, 37)',
                            color: 'white',
                        }}>
                            <AccordionHeader targetId={id} className={open === id ? 'text-white' : 'text-white'}>
                                <i className="text-white ri-arrow-right-s-line me-2"></i>
                                <span className="text-white"> {t(title)}</span>
                            </AccordionHeader>
                            <AccordionBody accordionId={id}>{content}</AccordionBody>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </div>
    );
};

export default XQTradeTutorial;
