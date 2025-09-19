import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, CustomInput } from 'reactstrap';
import { useTranslation } from 'react-i18next';
const DepositeForm = () => {

    const { t } = useTranslation();

    const [gateway, setGateway] = useState('');
    const [tradeAccount, setTradeAccount] = useState('');
    const [amount, setAmount] = useState('');

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>

            <Form onSubmit={handleSubmit}>
                {/* Select Gateway */}
                <FormGroup>
                    <Label htmlFor="gateway">{t('Select Gateway')}</Label>
                    <Input
                        type="select"
                        id="gateway"
                        name="gateway"
                        value={gateway}
                        onChange={(e) => setGateway(e.target.value)}
                        required
                    >
                        <option value="">{t('Select Gateway')}</option>
                        <option value="Tether (USDT Trc20)">Tether (USDT Trc20)</option>
                    </Input>
                </FormGroup>

                {/* Select Trade Account */}
                <FormGroup>
                    <Label htmlFor="tradeAccount">{('Trade Account')}</Label>
                    <Input
                        type="select"
                        id="tradeAccount"
                        name="tradeAccount"
                        value={tradeAccount}
                        onChange={(e) => setTradeAccount(e.target.value)}
                        required
                    >
                        <option value="">{t('Select Account')}</option>
                        <option value="Wallet">{t('Wallet')}</option>
                    </Input>
                </FormGroup>

                {/* Input Number with USD */}
                <FormGroup>
                    <Label htmlFor="amount">{t('Amount')}</Label>
                    <Row className='align-items-stretch mx-0' style={{border:'1px solid #ced4da', borderRadius:'0.25rem'}}>
                        <Col xs={10} >
                            <Input
                                type="number"
                                id="amount"
                                name="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                placeholder="Enter amount"
                                className='border-0 rounded-0 px-0'
                                style={{borderRadius:"0"}}
                            />
                        </Col>
                        <Col xs={2} className='pe-0'>
                            <h3 className="mb-0 h-100 d-flex align-items-center justify-content-center bg-primary text-white">
                                {t('USD')}
                            </h3>
                        </Col>
                    </Row>
                </FormGroup>

                {/* Submit Button */}
                <Button color="primary" type="submit">
                    {t('Submit')}
                </Button>
            </Form>
        </>
    );
};

export default DepositeForm;
