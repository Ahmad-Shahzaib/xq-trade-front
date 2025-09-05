import React, { useState } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col, Container } from 'reactstrap';
import { useTranslation } from 'react-i18next';
const DemoAccountForm = () => {
    const { t } = useTranslation(); // Initialize translation function
    const [accountType, setAccountType] = useState('DEMO'); // Default account type is 'DEMO'
    const [leverage, setLeverage] = useState('100'); // Default leverage
    const [demoBalance, setDemoBalance] = useState('1000'); // Default demo balance

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            accountType,
            leverage,
            demoBalance,
        });
    };


    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <Form onSubmit={handleSubmit}>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="accountType">{t('Account Type')}</Label>
                                    <div>
                                        <Input
                                            type="radio"
                                            id="demo"
                                            name="accountType"
                                            value="DEMO"
                                            checked={accountType === 'DEMO'}
                                            onChange={() => setAccountType('DEMO')}
                                        />{' '}
                                        <Label for="demo">{t('DEMO')}</Label>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="leverage">{t('Leverage')}</Label>
                                    <Input
                                        type="select"
                                        id="leverage"
                                        name="leverage"
                                        value={leverage}
                                        onChange={(e) => setLeverage(e.target.value)}
                                    >
                                        <option value="100">100</option>
                                        <option value="200">200</option>
                                        <option value="300">300</option>
                                        <option value="400">400</option>
                                        <option value="500">500</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="demoBalance">{t('Demo Balance')}</Label>
                                    <Input
                                        type="select"
                                        id="demoBalance"
                                        name="demoBalance"
                                        value={demoBalance}
                                        onChange={(e) => setDemoBalance(e.target.value)}
                                    >
                                        <option value="1000">1000</option>
                                        <option value="5000">5000</option>
                                        <option value="10000">10000</option>
                                        <option value="50000">50000</option>
                                        <option value="100000">100000</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Button color="secondary" type="submit">
                            {t('Create Account')}
                        </Button>
                    </Form>
                </Container>
            </div>

        </>
    )
}

export default DemoAccountForm
