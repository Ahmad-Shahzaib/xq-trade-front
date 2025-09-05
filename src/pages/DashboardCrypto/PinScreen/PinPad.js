import React, { useState } from 'react';
import { Button, Container, Row, Col, Alert } from 'reactstrap';
import BackButton from '../../../Layouts/BackButton';

export function PinPad({ onPinSubmit, error }) {
    const [pin, setPin] = useState('');

    const handleNumberClick = (number) => {
        if (pin.length < 4) {
            setPin((prev) => prev + number);
        }
    };

    const handleDelete = () => {
        setPin((prev) => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (pin.length === 4) {
            onPinSubmit(pin);
            setPin('');
        }
    };

    return (
        <div
            className="page-content  d-flex justify-content-center"

        >
            <BackButton />
            <Container className="text-center" style={{ maxWidth: '300px' }}>
                <Row className="mb-4 justify-content-center">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: '2px',
                                height: '8px',
                                borderRadius: '20px',
                                backgroundColor: pin[i] ? '#cf168b' : '#ccc',
                                margin: '0 6px',
                            }}
                        />
                    ))}
                </Row>

                {error && <Alert color="danger">{error}</Alert>}

                <Row className="mb-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                        <Col xs={4} key={number} className="mb-2">
                            <Button
                                onClick={() => handleNumberClick(number)}
                                block
                                style={{
                                    backgroundColor: 'transparent',
                                    border: '2px solid #cf168b',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '12px',
                                }}
                            >
                                {number}
                            </Button>
                        </Col>
                    ))}

                    <Col xs={4} className="mb-2">
                        <Button
                            onClick={handleDelete}
                            block
                            style={{
                                backgroundColor: 'transparent',
                                border: '2px solid #cf168b',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                            }}
                        >
                            <i className="ri-close-fill"></i>
                        </Button>
                    </Col>

                    <Col xs={4} className="mb-2">
                        <Button
                            onClick={() => handleNumberClick(0)}
                            block
                            style={{
                                backgroundColor: 'transparent',
                                border: '2px solid #cf168b',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                            }}
                        >
                            0
                        </Button>
                    </Col>

                    <Col xs={4} className="mb-2">
                        <Button
                            onClick={handleSubmit}
                            block
                            style={{
                                backgroundColor: '#cf168b',
                                border: '2px solid #cf168b',
                                color: '#fff',
                                fontWeight: 'bold',
                                borderRadius: '12px',
                            }}
                        >
                            →
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
