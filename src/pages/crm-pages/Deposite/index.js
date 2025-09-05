import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Tooltip } from 'reactstrap';
import DepositeForm from './DepositeForm';
import MultiStepForm from './MultiStepForm';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';
import { isSymbol } from 'lodash';
const Index = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Toggle tooltip visibility
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    const handleDepositeHistory = () => {
        navigate('/deposit/history')
    }
    const isMobile = window.innerWidth <= 768;

    return (
        <>
            <div className="page-content" style={{
                backgroundImage: `url(${trading})`,
                backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
                borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                height:"89vh"
            }}>
                <BackButton />
                <Container fluid>
                    <Card className='bg-transparent'>
                        <CardHeader className='bg-transparent p-0 pb-2 mb-2'>
                            <Row noGutters className="flex-nowrap align-items-center">
                                <Col xs={6}>
                                    <h3 className="mb-0 fs-5">
                                        {t('Deposit Funds')}
                                        <span id="deposit-icon" className="ms-2">
                                            <i className="ri-questionnaire-fill"></i>
                                        </span>
                                    </h3>
                                    <Tooltip
                                        placement="top"
                                        isOpen={tooltipOpen}
                                        target="deposit-icon"
                                        toggle={toggleTooltip}
                                    >
                                        {t("Add funds using our system's gateway. The deposited amount will be credited to the account balance.")}
                                    </Tooltip>
                                </Col>
                                <Col xs={6} className='mb-0 d-flex justify-content-end'>
                                    <Button className='text-uppercase'
                                        style={{
                                            background: "linear-gradient(90deg,  #c41a6b, #390452)"
                                            , border: "1px solid #390452", padding: "10px 20px"
                                        }} onClick={handleDepositeHistory} >{t('deposit history')}</Button>

                                </Col>
                            </Row>
                        </CardHeader>
                        <CardBody className='p-0'>
                            {/* <DepositeForm/> */}
                            <MultiStepForm />
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </>
    );
};

export default Index;
