import React, { useState } from 'react';
import { Button, Card, CardHeader } from 'reactstrap';
import DashboardSummary from './DashboardSummary';
import Referrals from './Referrals';
import { useTranslation } from 'react-i18next';
const Index = () => {
    // State for tracking button click and visibility of the card
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [status, setStatus] = useState('pending');
    const { t } = useTranslation(); // Initialize translation function
    // Function to handle button click
    const handleButtonClick = () => {
        setIsCardVisible(true);  // Show the card
        // Simulate an API call or change of status after some time
        setTimeout(() => {
            setStatus('approved'); // Change status to 'approved' after 2 seconds
        }, 2000);
    };

    // Determine the status color
    const statusColor = status === 'pending' ? 'yellow' : 'blue';

    return (
        <div className="page-content">
            <div className="container-fluid">


                {/* The card will appear with fade-in animation once it is visible */}
                <Card

                >
                    <CardHeader>
                        <Button color="primary" className="btn-soft-primary" onClick={handleButtonClick}>
                            {t('Request for IB')}
                        </Button>
                        <div
                            className={`transition-card mt-3 ${isCardVisible ? 'fade-in' : ''} ibm-request-status mt-3 p-3`}
                            style={{ display: isCardVisible ? 'block' : 'none' }}
                        >
                            <p className="mb-2">
                                {t("Your IB request has been sent, you will get the referral link once it's approved by the Admin.")}
                            </p>
                            <h3 className='mb-0'>{t('Request Status')}</h3>
                            <p className="mb-0" style={{ color: statusColor }}>
                                <strong>{status}</strong>
                            </p>
                        </div>
                    </CardHeader>
                </Card>
                <DashboardSummary/>
                <Referrals/>
            </div>
        </div >
    );
};

export default Index;
