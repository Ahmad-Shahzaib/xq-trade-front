import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Col, Input, Row, Button, Container } from 'reactstrap';
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
// import { setSelectedSymbol } from '../../rtk/slices/priceTradingSlice/priceTradingSlice';
import { setClickedSymbolData } from '../../rtk/slices/tradingSlice/tradingSlice';
import { placeOrder } from '../../rtk/slices/orderSlice/orderSlice'; // Import the thunk
import { closeOrder } from '../../rtk/slices/orderCloseSlice/orderCloseSlice'; // Import the closeOrder action
import { apiKey } from '../../utils/config';
// import { getPusherInstance, unbindPusherInstance } from '../../utils/pusher';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { subscribeToOrderChannel, unsubscribeFromOrderChannel } from '../../utils/pusher-2';

const CloseOrder = () => {
  const location = useLocation();
  const { position } = location.state || {};


  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'));
  const account = user ? user.account : null;

  const [selectedOption, setSelectedOption] = useState('option1');
  const { successMessage, errorMessage } = useSelector((state) => state.orderClose);

  const dispatch = useDispatch();
  const symbols = useSelector((state) => state.trading.symbols);
  const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData);
  const orderStatus = useSelector((state) => state.order.orderStatus);
  const orderData = useSelector((state) => state.order.orderData); // Get the order data from Redux state
  const orderError = useSelector((state) => state.order.error);

  const options = useMemo(() => {
    return Object.keys(symbols).map(symbolKey => ({
      value: symbolKey,  // Use symbol name as value
      label: symbolKey   // Use symbol name as label
    }));
  }, [symbols]);

  const isValidSymbol = selectedSymbol && options.some(option => option.value === selectedSymbol);

  // Get ask and bid prices for the selected symbol or default to 0
  const askPrice = isValidSymbol ? symbols[selectedSymbol]?.ask || 0 : 0;
  const bidPrice = isValidSymbol ? symbols[selectedSymbol]?.bid || 0 : 0;

  // Get the error message from Redux state
  const [volume, setVolume] = useState(position.volume);
  const [sl, setSl] = useState(position.sl);
  const [tp, setTp] = useState(position.tp);
  const [deviation, setDeviation] = useState(0);

  const slRef = useRef(null)
  const tpRef = useRef(null)
  const deviationRef = useRef(null)


  const accountId = account; // Replace with the actual account ID dynamically if needed
  const [closeButtonText, setCloseButtonText] = useState(` Close ${position.positionid} ${position.type} ${position.volume} at ${position.currentPrice} with Profit ${position.profit}`);




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
    const channel = subscribeToOrderChannel(account, (data) => {
      // Handle the order data as needed
    });

    return () => {
      unsubscribeFromOrderChannel(account);
    };
  }, [account]);

  const handleSelectChange = (selectedOption) => {
    dispatch(setClickedSymbolData(selectedOption.value));
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
      dispatch(closeOrder(orderData)).then((response) => {
        // Check if the order close action was successful
        if (response.meta.requestStatus === 'fulfilled') {
          // Assuming the payload has a success property or something similar
          if (response.payload && response.payload.success) {
            setCloseButtonText('Order Closed'); // Update button text on success
          } else {
            setCloseButtonText('Close Order'); // Reset button text on failure
          }
        } else {
          setCloseButtonText('Close Order'); // Reset button text on failure
        }
      });
    }
  };

  const handleOrderClose = (position) => {

    if (account) {
      const orderData = {
        account: account,
        symbol: position.symbol,
        volume: position.volume,
        price: position.price,
        type: position.type.toUpperCase(),
        tp: position.tp,
        sl: position.sl,
        comment: '',
        position_id: position.positionid
      };

      dispatch(closeOrder(orderData)).then((response) => {
        // Check if the order close action was successful
        if (response.meta.requestStatus === 'fulfilled') {
          setCloseButtonText('Order Closed'); // Update button text on success
        } else {
          setCloseButtonText('Close Order'); // Reset button text on failure
        }
      });
      setTimeout(() => {
        navigate('/trade?tab=3')
      }, 2000);
    }
  };






  const preventNegative = (value) => (value < 0 ? 0 : value);

  // Volume increment and decrement handlers
  const handleVolumeChange = (change) => {
    setVolume(prevVolume => preventNegative(parseFloat((parseFloat(prevVolume) + change).toFixed(2))));
  };

  // Update volume directly from input field
  const handleVolumeInputChange = (e) => {
    const newValue = e.target.value;
    setVolume(preventNegative(newValue ? parseFloat(newValue) : 0));  // Allow custom input, prevent negative
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



  // Deviation increment and decrement handlers
  const handleDeviationChange = (change) => {
    setDeviation((prevDev) => {
      // If it's the first interaction, set tp to askPrice; otherwise, apply the change
      const initialValue = prevDev === "0" || prevDev === 0 ? askPrice : parseFloat(prevDev);
      return preventNegative(parseFloat((initialValue + change).toFixed(1)));
    });
    if (deviationRef.current) {
      deviationRef.current.focus(); // Focus the input field
    }
  };

  // Update TP directly from input field
  const handleDeviationInputChange = (e) => {
    const newValue = e.target.value;
    setDeviation(preventNegative(newValue ? parseFloat(newValue) : askPrice)); // Use askPrice as the default if no value
  };

  const handleDeviationFocus = () => {
    setDeviation((prevDev) => (prevDev === "0" || prevDev === 0 ? askPrice : prevDev));
  };

  return (

    <>
      <div className="page-content">
        <Container id="containFluid" fluid>
          <Row className="align-items-center border-bottom pb-1">
            <Col xs={2}>
              <Link to="/trade?tab=3" style={{ cursor: 'pointer', fontSize: "23px" }}>
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
                <option value="option1">Instant Execution</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
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
                      <Col xs={4}>Deviation</Col>
                      <Col xs={8}>
                        <div className="d-flex align-items-center justify-content-between">
                          <button onClick={() => handleDeviationChange(-0.1)}
                            type="button" className="border-0 bg-transparent">
                            <i className="ri-subtract-fill"></i>
                          </button> {/* decrement by 0.1 */}
                          <Input
                            type="number"
                            className="form-control"
                            style={{ maxWidth: "105px", border: "none" }}
                            id="tp"
                            value={deviation}
                            ref={deviationRef}
                            onChange={handleDeviationInputChange}
                            onFocus={handleDeviationFocus}
                          />
                          <button onClick={() => handleDeviationChange(0.1)}
                            type="button" className="border-0 bg-transparent">
                            <i className="ri-add-line"></i>
                          </button> {/* increment by 0.1 */}
                        </div>
                      </Col >
                    </Row>
                  </Card>

                  <Row>
                    <Col xs={6} className="p-0">
                      <h4 className="text-center">{askPrice}</h4>
                      <div className="d-grid">
                        <Button
                          style={{ borderRadius: "0" }}
                          color="primary" onClick={() => handleOrder('SELL')} disabled={orderStatus === 'loading'}> Sell </Button>
                      </div>
                    </Col>
                    <Col xs={6} className="p-0">
                      <h4 className="text-center">{bidPrice}</h4>
                      <div className="d-grid">
                        <Button
                          style={{ borderRadius: "0" }}
                          color="secondary" onClick={() => handleOrder('BUY')} disabled={orderStatus === 'loading'}> Buy </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <div className="d-grid px-0 mt-2">
                      <Button
                        style={{ borderRadius: "0" }}
                        color="warning"
                        onClick={() => handleOrderClose(position)}
                        disabled={orderStatus === 'loading'}
                      >
                        {closeButtonText}
                      </Button>
                    </div>
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {/* {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} */}
                  </Row>
                </>
              )}
              {selectedOption === 'option2' && <div>Option 2 content</div>}
              {selectedOption === 'option3' && <div>Option 3 content</div>}
            </Col>
          </Row>
        </Container>
      </div>

    </>

  );
};

export default CloseOrder;
