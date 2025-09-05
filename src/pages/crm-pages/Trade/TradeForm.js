import React from 'react'
import { Card, CardHeader, CardBody, Col, Input, Row, Button } from 'reactstrap';
import Select from "react-select";

const TradeForm = () => {
    const options = [
        { value: 'XAUUSD', label: 'XAUUSD' },
        { value: 'GOLD.DEC.24', label: 'GOLD.DEC.24' }
    ];

    return (
        <>
            <Card>
                <CardHeader className="align-items-center border-0 d-flex">
                    <h4 className="card-title mb-0 flex-grow-1 text-secondary">Trade</h4>
                </CardHeader>
                <CardBody className='pt-0'>
                    <h6 className="fw-semibold">Symbols</h6>
                    <Select
                        options={options}
                        placeholder="Select a symbol"
                        isClearable
                    />

                    <h6 className="fw-semibold mt-2">Price</h6>
                    <Input
                        type="text"
                        className="form-control"
                        id="price"
                    />

                    <h6 className="fw-semibold mt-2">Volume</h6>
                    <Input
                        type="number"
                        className="form-control"
                        id="volume"
                    />

                    <Row className='mt-2'>
                        <Col xs={6}>
                            <Button color="danger"> Sell </Button>
                        </Col>
                        <Col xs={6} className='text-end'>
                            <Button color="secondary" > Buy </Button>
                        </Col>
                    </Row>

                </CardBody>
            </Card>
        </>
    )
}

export default TradeForm;
