import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import AccountDetailsTable from './AccountDetailsTable';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

const Index = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleButtonClick = () => {
        navigate('/new-trading-account'); // Navigate to the specified route
    };

    return (
        <>
            <div className='page-content'
                style={{
                    backgroundImage: `url(${trading})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
                    borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                    height: "100%"
                }}>
                    <BackButton />
                <div className='container-fluid'>
                    <Card className='bg-transparent'>
                        <CardHeader className='bg-transparent'>
                            <Button
                                className='text-capitalize '
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
                                onClick={handleButtonClick} // Attach the click handler
                            >
                                Open New Real Account
                            </Button>
                        </CardHeader>
                        <CardBody>
                            <AccountDetailsTable />
                        </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Index;
