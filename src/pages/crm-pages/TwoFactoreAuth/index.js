import React, { useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Row, Tooltip } from 'reactstrap'
import GoogleAuthenticator from './GoogleAuthenticator';
import GoogleAuthenticatorOTP from './GoogleAuthenticatorOTP';

const Index = () => {

    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Toggle tooltip visibility
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Card className='bg-transparent'>
                        {/* <CardHeader className='bg-transparent'>
                            <Row noGutters className="flex-nowrap align-items-center">
                                <Col xs={12}>
                                    <h3 className="mb-0">
                                        Two Factor Authentication
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
                                        Your account will be more secure if you use this feature.
                                        A 6-digit verification code from your Android Google Authenticator
                                        app must be entered whenever someone tries to log in to the account.
                                        So that the system could verify that, this is you. Additionally,
                                        the payout procedure will require this verification.
                                    </Tooltip>
                                </Col>

                            </Row>
                        </CardHeader> */}
                        <CardBody className='p-0'>
                            <Row>
                                <Col md={6}>
                                    <GoogleAuthenticator />
                                </Col>
                                <Col md={6}>
                                    <GoogleAuthenticatorOTP />
                                </Col>
                            </Row>
                            

                        </CardBody>
                    </Card>
                </Container>

            </div>
        </>
    )
}

export default Index
