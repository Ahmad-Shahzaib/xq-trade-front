import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardBody, Col, Input, Row, Button, Nav, NavItem, NavLink, TabContent, TabPane, Toast, ToastHeader, ToastBody, Label, Form, FormGroup } from 'reactstrap';
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import { setClickedSymbolAsk, setClickedSymbolBid, setClickedSymbolData } from '../../../rtk/slices/tradingSlice/tradingSlice';
import { useLocation } from 'react-router-dom';
import classnames from "classnames";
import { handleLimitOrder, handleOrder, handleStopOrder, saveVolume } from './functions';


const Trading = () => {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const account = user ? user.account : null;

    const dispatch = useDispatch();
    const symbols = useSelector((state) => state.trading.symbols);
    const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData);
    const selectedSymbolAsk = useSelector((state) => state.trading.clickedSymbolAsk);
    const selectedSymbolBid = useSelector((state) => state.trading.clickedSymbolBid);

    const orderStatus = useSelector((state) => state.order.orderStatus);
    const { orderMessage } = useSelector((state) => state.order)
    const pendingOrderStatus = useSelector((state) => state.pendingOrder.pendingOrderStatus);
    const orderData = useSelector((state) => state.order.orderData);
    const orderError = useSelector((state) => state.order.error);
    const pendingOrderMessage = useSelector((state) => state.pendingOrder.pendingOrderMessage);

    const [volume, setVolume] = useState(() => {
        const storedVolume = localStorage.getItem('tradingVolume');
        return storedVolume ? parseFloat(storedVolume) : 0.01; // Default value is 0.10
    });
    const [trigger, setTrigger] = useState('');
    const [sl, setSl] = useState('');
    const [tp, setTp] = useState('');
    const [comment, setComment] = useState('');
    const [buyAbove, setBuyAbove] = useState('');
    const [target, setTarget] = useState('');
    const [activeTab, setActiveTab] = useState("1");

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const [isOneClickTrading, setIsOneClickTrading] = useState(false);

    const currentPath = location.pathname
    const isBaseUrl = currentPath === "/trade";
    // Optimized memoization for options
    const options = useMemo(() => (
        symbols ? Object.keys(symbols).map(symbolKey => ({
            value: symbolKey,
            label: symbolKey
        })) : []
    ), [symbols]);
    // Optimized dispatch only when symbol is different
    const handleSelectChange = (selectedOption) => {
        if (selectedSymbol !== selectedOption.value) {
            dispatch(setClickedSymbolData(selectedOption.value));
        }
    };

    useEffect(() => {
        if (!selectedSymbol && options.length) {
            dispatch(setClickedSymbolData(options[0].value));
        }
    }, [options, selectedSymbol, dispatch]);

    // If the selectedSymbol changes, update the ask/bid from the symbols state
    useEffect(() => {
        if (selectedSymbol && symbols[selectedSymbol]) {
            const { ask, bid } = symbols[selectedSymbol];
            dispatch(setClickedSymbolAsk(ask));
            dispatch(setClickedSymbolBid(bid));
        }
    }, [selectedSymbol, symbols, dispatch]);


    const toggle = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        if (pendingOrderStatus === 'succeeded') {
            setToastMessage(pendingOrderMessage);
            setToastType('success');
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
        } else if (orderStatus === 'succeeded') {
            setToastMessage(orderMessage);
            setToastType('success');
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds

        } else if (orderStatus === 'failed') {
            setToastMessage("Error placing order. Please try again");
            setToastType('error');
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
        }
    }, [pendingOrderStatus, orderStatus, pendingOrderMessage]);

    return (
        <Card className='h-100 mb-0' >
            {
                isBaseUrl ? <>
                    <CardHeader className="align-items-center border-0 d-flex border-bottom">
                        <h4 className="card-title mb-0 flex-grow-1">Trade</h4>
                        <Form>
                            <FormGroup
                                switch
                                inline
                            >
                                {/* <Input
                                    type="checkbox"
                                    id="one-click-trading"
                                    checked={isOneClickTrading}
                                    onChange={(e) => setIsOneClickTrading(e.target.checked)} // Update state
                                /> */}
                                <Input
                                    type="switch"
                                    checked={isOneClickTrading}
                                    onChange={() => setIsOneClickTrading(!isOneClickTrading)} // Update state
                                />
                                <Label check>
                                    One Click Trading
                                </Label>
                            </FormGroup>

                        </Form>
                    </CardHeader>

                </> : <></>
            }

            <CardBody className='pt-0 trading-form-card'>
                <Nav tabs className='trading-form-tabs'>

                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === "1" })}
                            onClick={() => toggle("1")}
                            style={{ cursor: "pointer" }}
                        >
                            Market
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === "2" })}
                            onClick={() => toggle("2")}
                            style={{ cursor: "pointer" }}
                        >
                            Limit
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === "3" })}
                            onClick={() => toggle("3")}
                            style={{ cursor: "pointer" }}
                        >
                            Stop
                        </NavLink>
                    </NavItem>
                </Nav>

                <TabContent activeTab={activeTab} style={{ height: '90%', paddingTop: '13px' }}>
                    <TabPane tabId="1" className='h-100'>
                        <div className='d-flex flex-column justify-content-between h-100 trading-form'>
                            <div>
                                <h6 className="fw-semibold trading-input-lable">Symbols</h6>
                                <Select
                                    options={options}
                                    value={options.find(option => option.value === selectedSymbol)}
                                    onChange={handleSelectChange}
                                    placeholder="Select a symbol"
                                />
                                <h6 className="fw-semibold mt-4 trading-input-lable">Volume</h6>
                                <Input
                                    type="number"
                                    className="form-control"
                                    id="volume"
                                    value={volume}
                                    onChange={(e) => saveVolume(e.target.value, setVolume)}

                                />

                                <Row>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Stop Loss</h6>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="limit-sl"
                                            value={sl}
                                            onChange={(e) => setSl(e.target.value)}
                                            onFocus={() => setSl(selectedSymbolAsk)}
                                        />
                                    </Col>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Take Profit</h6>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="tp"
                                            value={tp}
                                            onChange={(e) => setTp(e.target.value)}
                                            onFocus={() => setTp(selectedSymbolAsk)}
                                        />
                                    </Col>
                                </Row>

                            </div>
                            <Row className='mt-4'>
                                <Col xs={6} className='p-1'>
                                    <Button color="primary" className='w-100' onClick={() => handleOrder('SELL', selectedSymbol, volume, dispatch, orderData, orderError)} disabled={!isOneClickTrading && orderStatus === 'loading'}>
                                        Sell
                                        <span className='ms-1'>{selectedSymbolAsk}</span>
                                    </Button>
                                </Col>
                                <Col xs={6} className='text-end p-1'>
                                    <Button color="secondary" className='w-100' onClick={() => handleOrder('BUY', selectedSymbol, volume, dispatch, orderData, orderError)} disabled={!isOneClickTrading && orderStatus === 'loading'}>
                                        Buy
                                        <span className='ms-1'>{selectedSymbolBid}</span>
                                    </Button>
                                </Col>
                            </Row>
                        </div>

                    </TabPane>

                    <TabPane tabId="2" className='h-100'>
                        <div className='d-flex flex-column justify-content-between h-100 trading-form'>
                            <div>
                                <h6 className="fw-semibold trading-input-lable">Symbols</h6>
                                <Select
                                    options={options}
                                    value={options.find(option => option.value === selectedSymbol)}
                                    onChange={handleSelectChange}
                                    placeholder="Select a symbol"
                                    isClearable
                                />

                                <Row>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Volume</h6>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="limit-volume"
                                            value={volume}
                                            onChange={(e) => saveVolume(e.target.value, setVolume)}
                                        />
                                    </Col>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Price</h6>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="limit-trigger"
                                            value={trigger}
                                            onChange={(e) => setTrigger(e.target.value)}
                                            autoFocus
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Stop Loss</h6>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="limit-sl"
                                            value={sl}
                                            onChange={(e) => setSl(e.target.value)}
                                            onFocus={() => setSl(selectedSymbolAsk)}
                                        />
                                    </Col>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Target</h6>
                                        <Input
                                            type="number"
                                            className="form-control"
                                            id="limit-target"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            onFocus={() => setTarget(selectedSymbolAsk)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <Row className='mt-4'>
                                <Col xs={6} className='p-1'>
                                    <Button color="primary" className='w-100' onClick={() => handleLimitOrder(3, selectedSymbol, volume, trigger, selectedSymbolAsk, selectedSymbolBid, dispatch, orderData, orderError)} disabled={pendingOrderStatus === 'loading'}>
                                        Sell
                                        <span className='ms-1'>{selectedSymbolAsk}</span>
                                    </Button>
                                </Col>
                                <Col xs={6} className='text-end p-1'>
                                    <Button color="secondary" className='w-100' onClick={() => handleLimitOrder(2, selectedSymbol, volume, trigger, selectedSymbolAsk, selectedSymbolBid, dispatch, orderData, orderError)} disabled={pendingOrderStatus === 'loading'}>
                                        Buy
                                        <span className='ms-1'>{selectedSymbolBid}</span>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>

                    <TabPane tabId="3" className='h-100'>
                        <div className='d-flex flex-column justify-content-between h-100 trading-form'>
                            <div>
                                <h6 className="fw-semibold trading-input-lable">Symbols</h6>
                                <Select
                                    options={options}
                                    value={options.find(option => option.value === selectedSymbol)}
                                    onChange={handleSelectChange}
                                    placeholder="Select a symbol"
                                    isClearable
                                />

                                <Row>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Volume</h6>
                                        <Input type="number" className="form-control" id="stop-volume" value={volume} onChange={(e) => saveVolume(e.target.value, setVolume)}
                                        />
                                    </Col>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Price</h6>
                                        <Input type="number" className="form-control" id="stop-buyAbove" value={buyAbove} onChange={(e) => setBuyAbove(e.target.value)}
                                            autoFocus
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">Stop Loss</h6>
                                        <Input type="number" className="form-control" id="stop-sl" value={sl} onChange={(e) => setSl(e.target.value)}
                                            onFocus={() => setSl(selectedSymbolAsk)}
                                        />
                                    </Col>
                                    <Col xs={6} className='p-1'>
                                        <h6 className="fw-semibold mt-4 trading-input-lable">TP</h6>
                                        <Input type="number" className="form-control" id="stop-tp" value={tp} onChange={(e) => setTp(e.target.value)}
                                            onFocus={() => setTp(selectedSymbolAsk)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            <Row className='mt-4'>
                                <Col xs={6} className='p-1'>
                                    <Button color="primary" className='w-100' onClick={() => handleStopOrder(3, selectedSymbol, volume, buyAbove, selectedSymbolAsk, selectedSymbolBid, dispatch,
                                        orderData, orderError)} disabled={orderStatus === 'loading'}>
                                        Sell
                                        <span className='ms-1'>{selectedSymbolAsk}</span>
                                    </Button>
                                </Col>
                                <Col xs={6} className='text-end p-1'>
                                    <Button color="secondary" className='w-100' onClick={() => handleStopOrder(2, selectedSymbol, volume, buyAbove, selectedSymbolAsk, selectedSymbolBid, dispatch,
                                        orderData, orderError)} disabled={orderStatus === 'loading'}>
                                        Buy
                                        <span className='ms-1'>{selectedSymbolBid}</span>
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </TabPane>
                </TabContent>
                {toastVisible && (
                    <div className="toast-container position-fixed end-0 p-3" style={{ bottom: '5%' }}>
                        <Toast style={{ width: '250px' }} color={toastType === 'success' ? 'success' : 'danger'} delay={300}>
                            <ToastHeader icon={toastType === 'success' ? 'success' : 'danger'}>
                                {toastType === 'success' ? 'Success' : 'Error'}
                            </ToastHeader>
                            <ToastBody>
                                {toastMessage}
                            </ToastBody>
                        </Toast>
                    </div>
                )}
            </CardBody>
        </Card >
    );
};

export default Trading;
