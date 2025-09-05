import React from 'react';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import TransactionTable from './TransactionTable';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';
const Index = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(); // Initialize translation function
    const handleButtonClick = () => {
        navigate('/internal-transfer/create');
    };

    return (
        <div className='page-content'
            style={{
                backgroundImage: `url(${trading})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '20px 0',
                borderRadius: 16,
                boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                height: "100%"
            }}
        >
            <BackButton />
            <div className='container-fluid'>
                <Card>
                    <CardHeader style={{ background: "transparent" }}>
                        <Button
                            color='primary'
                            className=''
                            style={{
                                  background: "linear-gradient(90deg, #c41a6b, #390452)",
                                    border: "none",
                                    borderRadius: 10,
                                    padding: "12px 28px",
                                    fontWeight: 600,
                                    fontSize: 18,
                                    boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                                    color: "#fff"
                            }}
                            onClick={handleButtonClick}
                        >
                            {t('New Transfer')}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <TransactionTable />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Index;
