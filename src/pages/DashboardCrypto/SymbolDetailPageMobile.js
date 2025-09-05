import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Col, Input, Row, Button, Container } from 'reactstrap';
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import { setClickedSymbolData } from '../../rtk/slices/tradingSlice/tradingSlice';
import { placeOrder } from '../../rtk/slices/orderSlice/orderSlice'; // Import the thunk
import { apiKey } from '../../utils/config';
import { Link, useNavigate } from 'react-router-dom';
import { subscribeToOrderChannel, unsubscribeFromOrderChannel } from '../../utils/pusher-2';
import { placePendingOrder } from '../../rtk/slices/pendingOrderSlice/pendingOrderSlice';
import { fetchOpenPositions } from '../../rtk/slices/openPositionsSlice/openPositionsSlice';



const SymbolDetailPageMobile = () => {
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user'));
    const account = user ? user.account : null;

    const slRef = useRef(null)
    const tpRef = useRef(null)

    const [selectedOption, setSelectedOption] = useState('option1');

    const dispatch = useDispatch();
    // const symbols = useSelector((state) => state.PriceTrading.symbols);
    const symbols = useSelector((state) => state.trading.symbols);

    // const selectedSymbol = useSelector((state) => state.PriceTrading.selectedSymbol);
    const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData);
    const orderStatus = useSelector((state) => state.order.orderStatus);
    const orderData = useSelector((state) => state.order.orderData); // Get the order data from Redux state
    const orderError = useSelector((state) => state.order.error);    // Get the error message from Redux state
    const selectedSymbolAsk = useSelector((state) => state.trading.clickedSymbolAsk);
    const selectedSymbolBid = useSelector((state) => state.trading.clickedSymbolBid);
    const pendingOrderStatus = useSelector((state) => state.order.pendingOrderStatus);

    // Get ask and bid prices for the selected symbol
    const askPrice = selectedSymbol ? symbols[selectedSymbol].ask : null;
    const bidPrice = selectedSymbol ? symbols[selectedSymbol].bid : null;

    // const [volume, setVolume] = useState('0');
    const [volume, setVolume] = useState(() => {
        const storedVolume = localStorage.getItem('tradingVolume');
        return storedVolume ? parseFloat(storedVolume) : 0.01; // Default value is 0.10
    });
    const [sl, setSl] = useState('0');
    const [tp, setTp] = useState('0');
    const [trigger, setTrigger] = useState('');
    const [buyAbove, setBuyAbove] = useState('');


    const accountId = account; // Replace with the actual account ID dynamically if needed

    // const options = Object.keys(symbols).map(symbolKey => ({
    //     value: symbols[symbolKey].symbol,
    //     label: symbols[symbolKey].symbol
    // }));

    const options = useMemo(() => {
        return Object.keys(symbols).map(symbolKey => ({
            value: symbolKey,  // Use symbol name as value
            label: symbolKey   // Use symbol name as label
        }));
    }, [symbols]);

    const handleSelectChangeContent = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        if (selectedSymbol) {
            const symbolData = symbols[selectedSymbol];
            setClickedSymbolData(symbolData);
        }
    }, [selectedSymbol, symbols]);


    useEffect(() => {
        subscribeToOrderChannel(account, (data) => {
            console.log('New order in Tradinggg:');
            // Handle the order data as needed
        });

        return () => {
            unsubscribeFromOrderChannel(account);
        };
    }, [account]);

    const handleSelectChange = (selectedOption) => {
        dispatch(setClickedSymbolData(selectedOption.value));
    };

    const saveVolume = (newVolume) => {
        localStorage.setItem('tradingVolume', newVolume);
        // setVolume(newVolume);
    };

    const handleOrder = (type) => {
        if (selectedSymbol && volume) {
            // Sending both static and dynamic values
            const orderPayload = {
                api_key: apiKey,  // Static
                account: account,          // Dynamic
                symbol: selectedSymbol,      // Dynamic
                volume: volume,              // Dynamic
                price: "0",                  // Static
                type: type,                  // Dynamic (SELL or BUY)
                tp: tp, // Ensure tp is a number or empty
                sl: sl,                   // Static
                comment: ""                  // Static
            };


            dispatch(placeOrder(orderPayload)).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    console.log("Order API response:"); // Log the successful response
                } else if (response.meta.requestStatus === 'rejected') {
                    console.error("Order API error:", orderError); // Log the error if it fails
                }
            });

            dispatch(fetchOpenPositions(account));
            setTimeout(() => {
                navigate('/success-trade',);

            }, 1000);
            // success-trade
            // /trade?tab=3
        }
    };






    // Helper function to ensure value is never negative
    const preventNegative = (value) => (value < 0 ? 0 : value);

    // Volume increment and decrement handlers
    const handleVolumeChange = (change) => {
        setVolume(prevVolume => preventNegative(parseFloat((parseFloat(prevVolume) + change).toFixed(2))));
    };

    // Update volume directly from input field
    const handleVolumeInputChange = (e) => {
        const newValue = e.target.value;
        setVolume(preventNegative(newValue ? parseFloat(newValue) : 0));  // Allow custom input, prevent negative
        saveVolume(newValue)
    };

    // Stop Loss increment and decrement handlers
    const handleSLChange = (change) => {
        setSl((prevSL) => {
            // If it's the first interaction, set tp to askPrice; otherwise, apply the change
            const initialValue = prevSL === "0" || prevSL === 0 ? askPrice : parseFloat(prevSL);
            return preventNegative(parseFloat((initialValue + change).toFixed(1)));
        });
        if (slRef.current) {
            slRef.current.focus(); // Focus the input field
        }
    };

    // Update SL directly from input field
    const handleSLInputChange = (e) => {
        const newValue = e.target.value;
        setSl(preventNegative(newValue ? parseFloat(newValue) : askPrice));  // Allow custom input, prevent negative
    };

    const handleSLFocus = () => {
        setSl((pevSl) => (pevSl === "0" || pevSl === 0 ? askPrice : pevSl));
    };


    // Take Profit increment and decrement handlers
    const handleTPChange = (change) => {
        setTp((prevTP) => {
            // If it's the first interaction, set tp to askPrice; otherwise, apply the change
            const initialValue = prevTP === "0" || prevTP === 0 ? askPrice : parseFloat(prevTP);
            return preventNegative(parseFloat((initialValue + change).toFixed(1)));
        });
        if (tpRef.current) {
            tpRef.current.focus(); // Focus the input field
        }
    };

    // Update TP directly from input field
    const handleTPInputChange = (e) => {
        const newValue = e.target.value;
        setTp(preventNegative(newValue ? parseFloat(newValue) : askPrice)); // Use askPrice as the default if no value
    };

    const handleTPFocus = () => {
        setTp((prevTP) => (prevTP === "0" || prevTP === 0 ? askPrice : prevTP));
    };

    const handleLimitOrder = (type) => {
        if (selectedSymbol && volume && trigger) {
            const isValidTrigger =
                (type === 3 && parseFloat(trigger) > parseFloat(selectedSymbolAsk)) ||
                (type === 2 && parseFloat(trigger) < parseFloat(selectedSymbolBid));

            if (!isValidTrigger) {
                console.error('Invalid trigger price!');
                return alert(
                    `For a ${type} order, the trigger price must be ${type === 'SELL' ? 'greater than the current ask price' : 'less than the current bid price'
                    }.`
                );
            }

            const orderPayload = {
                api_key: apiKey,
                account: account,
                symbol: selectedSymbol,
                volume: volume,
                price: "0",
                type: type,
                tp: "0",
                sl: "0",
                comment: "",
                price_trigger: trigger,
            };

            dispatch(placePendingOrder(orderPayload)).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    console.log("Order API response:",);
                } else if (response.meta.requestStatus === 'rejected') {
                    console.error("Order API error:", orderError);
                }
            });
        } else {
            console.error("Missing required fields for limit order.");
            alert("Please fill in all required fields.");
        }
    };

    const handleStopOrder = (type) => {
        if (selectedSymbol && volume && trigger) {
            const isValidTrigger =
                (type === 3 && parseFloat(buyAbove) < parseFloat(selectedSymbolAsk)) ||
                (type === 2 && parseFloat(buyAbove) > parseFloat(selectedSymbolBid));

            if (!isValidTrigger) {
                console.error('Invalid trigger price!');
                return alert(
                    `For a ${type} order, the trigger price must be ${type === 'SELL' ? 'less than the current ask price' : 'greater than the current bid price'
                    }.`
                );
            }

            const orderPayload = {
                api_key: apiKey,
                account: account,
                symbol: selectedSymbol,
                volume: volume,
                price: "0",
                type: type,
                tp: "0",
                sl: "0",
                comment: "",
                price_trigger: buyAbove,
            };

            dispatch(placePendingOrder(orderPayload)).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    console.log("Order API response:"
                    );
                } else if (response.meta.requestStatus === 'rejected') {
                    console.error("Order API error:", orderError);
                }
            });
        } else {
            console.error("Missing required fields for limit order.");
            alert("Please fill in all required fields.");
        }
    };

    return (

        <>
            <div className="page-content">
                <Container id="containFluid" fluid>
                    <Row className="align-items-center border-bottom pb-1">
                        <Col xs={2}>
                            <Link to="/trade?tab=2" style={{ cursor: 'pointer', fontSize: "23px" }}>
                                <i className="ri-arrow-left-s-line"></i>
                            </Link>
                        </Col>
                        <Col xs={10}>

                            <Select
                                options={options}
                                value={options.find(option => option.value === selectedSymbol)}
                                onChange={handleSelectChange}
                                placeholder="Select a symbol"
                            />
                        </Col>
                    </Row>

                    {/* Dropdown for selecting options */}
                    <Row>
                        <Col xs={12}>
                            <select
                                className="form-select my-2"
                                value={selectedOption}
                                onChange={handleSelectChangeContent}
                            >
                                {/* <option value="" disabled hidden>
                                    Select an option
                                </option> */}
                                <option value="option1">Market Execution</option>
                                <option value="option2">Limit</option>
                                <option value="option3">Stop</option>
                            </select>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12}>
                            {selectedOption === 'option1' && (
                                <>
                                    <Card className="mt-3 p-1">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(-0.5)}
                                            >-0.5</button> {/* decrement by 0.5 */}
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(-0.1)}
                                            >-0.1</button> {/* decrement by 0.1 */}
                                            <Input
                                                type="number"
                                                className="form-control text-center"
                                                style={{ maxWidth: "85px", border: "none" }}
                                                id="volume"
                                                value={volume}
                                                onChange={handleVolumeInputChange}
                                            />
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(0.1)}
                                            >+0.1</button> {/* increment by 0.1 */}
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(0.5)}
                                            >+0.5</button> {/* increment by 0.5 */}
                                        </div>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={3}><span>Stop Loss</span></Col>
                                            <Col xs={9}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button onClick={() => handleSLChange(-0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-subtract-fill"></i>
                                                    </button> {/* decrement by 0.1 */}
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ maxWidth: "105px", border: "none" }}
                                                        id="sl"
                                                        value={sl}
                                                        ref={slRef}
                                                        onChange={handleSLInputChange}
                                                        onFocus={handleSLFocus}
                                                    />
                                                    <button onClick={() => handleSLChange(0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-add-line"></i>
                                                    </button>  {/* increment by 0.1 */}
                                                </div>
                                            </Col >
                                        </Row>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={3}>Take Profit</Col>
                                            <Col xs={9}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button onClick={() => handleTPChange(-0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-subtract-fill"></i>
                                                    </button> {/* decrement by 0.1 */}
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ maxWidth: "105px", border: "none" }}
                                                        id="tp"
                                                        value={tp}
                                                        ref={tpRef}
                                                        onChange={handleTPInputChange}
                                                        onFocus={handleTPFocus}
                                                    />
                                                    <button onClick={() => handleTPChange(0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-add-line"></i>
                                                    </button> {/* increment by 0.1 */}
                                                </div>
                                            </Col >
                                        </Row>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={5}>Fill Policy</Col>
                                            <Col xs={7}>
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <span>fill or kill</span>
                                                </div>
                                            </Col >
                                        </Row>
                                    </Card>

                                    <Row>
                                        <Col xs={6} className="p-0">
                                            <h4 className="text-center">{askPrice.toFixed(4)}</h4>
                                            <div className="d-grid">
                                                <Button
                                                    style={{ borderRadius: "0" }}
                                                    color="primary" onClick={() => handleOrder('SELL')} disabled={orderStatus === 'loading'}> Sell </Button>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="p-0">
                                            <h4 className="text-center">{bidPrice.toFixed(4)}</h4>
                                            <div className="d-grid">
                                                <Button
                                                    style={{ borderRadius: "0" }}
                                                    color="secondary" onClick={() => handleOrder('BUY')} disabled={orderStatus === 'loading'}> Buy </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )}

                            {selectedOption === 'option2' && (
                                <>
                                    <Card className="mt-3 p-1">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(-0.5)}
                                            >-0.5</button> {/* decrement by 0.5 */}
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(-0.1)}
                                            >-0.1</button> {/* decrement by 0.1 */}
                                            <Input
                                                type="number"
                                                className="form-control"
                                                style={{ maxWidth: "85px", border: "none" }}
                                                id="volume"
                                                value={volume}
                                                onChange={handleVolumeInputChange}
                                            />
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(0.1)}
                                            >+0.1</button> {/* increment by 0.1 */}
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(0.5)}
                                            >+0.5</button> {/* increment by 0.5 */}
                                        </div>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={4}>Stop Loss</Col>
                                            <Col xs={8}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button onClick={() => handleSLChange(-0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-subtract-fill"></i>
                                                    </button> {/* decrement by 0.1 */}
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ maxWidth: "85px", border: "none" }}
                                                        id="sl"
                                                        value={sl}
                                                        onChange={handleSLInputChange}
                                                        ref={slRef}
                                                        onFocus={handleSLFocus}
                                                    />
                                                    <button onClick={() => handleSLChange(0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-add-line"></i>
                                                    </button>  {/* increment by 0.1 */}
                                                </div>
                                            </Col >
                                        </Row>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={4}>Take Profit</Col>
                                            <Col xs={8}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button onClick={() => handleTPChange(-0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-subtract-fill"></i>
                                                    </button> {/* decrement by 0.1 */}
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ maxWidth: "85px", border: "none" }}
                                                        id="tp"
                                                        value={tp}
                                                        onChange={handleTPInputChange}
                                                        ref={tpRef}
                                                        onFocus={handleTPFocus}
                                                    />
                                                    <button onClick={() => handleTPChange(0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-add-line"></i>
                                                    </button> {/* increment by 0.1 */}
                                                </div>
                                            </Col >
                                        </Row>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={5}>Trigger</Col>
                                            <Col xs={7}>
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        id="limit-trigger"
                                                        value={trigger}
                                                        onChange={(e) => setTrigger(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                            </Col >
                                        </Row>
                                    </Card>

                                    <Row>
                                        <Col xs={6} className="p-0">
                                            <h4 className="text-center">{askPrice.toFixed(4)}</h4>
                                            <div className="d-grid">
                                                <Button
                                                    style={{ borderRadius: "0" }}
                                                    color="primary" onClick={() => handleLimitOrder(3)} disabled={orderStatus === 'loading'}> Sell </Button>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="p-0">
                                            <h4 className="text-center">{bidPrice.toFixed(4)}</h4>
                                            <div className="d-grid">
                                                <Button
                                                    style={{ borderRadius: "0" }}
                                                    color="secondary" onClick={() => handleLimitOrder(2)} disabled={orderStatus === 'loading'}> Buy </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )}
                            {selectedOption === 'option3' && (
                                <>
                                    <Card className="mt-3 p-1">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(-0.5)}
                                            >-0.5</button> {/* decrement by 0.5 */}
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(-0.1)}
                                            >-0.1</button> {/* decrement by 0.1 */}
                                            <Input
                                                type="number"
                                                className="form-control"
                                                style={{ maxWidth: "85px", border: "none" }}
                                                id="volume"
                                                value={volume}
                                                onChange={handleVolumeInputChange}
                                            />
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(0.1)}
                                            >+0.1</button> {/* increment by 0.1 */}
                                            <button type="button" className="border-0 bg-transparent"
                                                onClick={() => handleVolumeChange(0.5)}
                                            >+0.5</button> {/* increment by 0.5 */}
                                        </div>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={4}>Stop Loss</Col>
                                            <Col xs={8}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button onClick={() => handleSLChange(-0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-subtract-fill"></i>
                                                    </button> {/* decrement by 0.1 */}
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ maxWidth: "85px", border: "none" }}
                                                        id="sl"
                                                        value={sl}
                                                        onChange={handleSLInputChange}
                                                        ref={slRef}
                                                        onFocus={handleSLFocus}
                                                    />
                                                    <button onClick={() => handleSLChange(0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-add-line"></i>
                                                    </button>  {/* increment by 0.1 */}
                                                </div>
                                            </Col >
                                        </Row>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={4}>Take Profit</Col>
                                            <Col xs={8}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <button onClick={() => handleTPChange(-0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-subtract-fill"></i>
                                                    </button> {/* decrement by 0.1 */}
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ maxWidth: "85px", border: "none" }}
                                                        id="tp"
                                                        value={tp}
                                                        onChange={handleTPInputChange}
                                                        ref={tpRef}
                                                        onFocus={handleTPFocus}
                                                    />
                                                    <button onClick={() => handleTPChange(0.1)}
                                                        type="button" className="border-0 bg-transparent">
                                                        <i className="ri-add-line"></i>
                                                    </button> {/* increment by 0.1 */}
                                                </div>
                                            </Col >
                                        </Row>
                                        <Row className="align-items-center mt-2">
                                            <Col xs={5}>Price</Col>
                                            <Col xs={7}>
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <Input
                                                        type="number"
                                                        className="form-control"
                                                        id="stop-buyAbove"
                                                        value={buyAbove}
                                                        onChange={(e) => setBuyAbove(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                            </Col >
                                        </Row>
                                    </Card>

                                    <Row>
                                        <Col xs={6} className="p-0">
                                            <h4 className="text-center">{askPrice.toFixed(4)}</h4>
                                            <div className="d-grid">
                                                <Button
                                                    style={{ borderRadius: "0" }}
                                                    color="primary" onClick={() => handleStopOrder(3)} disabled={orderStatus === 'loading'}> Sell </Button>
                                            </div>
                                        </Col>
                                        <Col xs={6} className="p-0">
                                            <h4 className="text-center">{bidPrice.toFixed(4)}</h4>
                                            <div className="d-grid">
                                                <Button
                                                    style={{ borderRadius: "0" }}
                                                    color="secondary" onClick={() => handleStopOrder(2)} disabled={orderStatus === 'loading'}> Buy </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            )}

                        </Col>
                    </Row>

                </Container>
            </div>
        </>

    );
};

export default SymbolDetailPageMobile;
