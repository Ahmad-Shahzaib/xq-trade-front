import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Card, CardHeader, Col, Input, Modal, ModalBody, Button, ListGroup, ListGroupItem, Table } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSymbols, setSelectedSymbol, selectPreviousSymbols, setSymbolToShow } from '../../rtk/slices/priceTradingSlice/priceTradingSlice';
import Spinners from '../../Components/Common/Spinner';
import useWindowSize from '../../Components/Hooks/useWindowSize';
import { useNavigate } from 'react-router-dom';

const PriceList = ({ toggleTab }) => {
  const dispatch = useDispatch();
  const symbols = useSelector((state) => state.PriceTrading.symbols);
  const previousSymbols = useSelector(selectPreviousSymbols);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [longPressedSymbol, setLongPressedSymbol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB')); // 24-hour format
  
  // New state to manage checkbox selections
  const [checkedSymbols, setCheckedSymbols] = useState(() => {
    const saved = localStorage.getItem('selectedSymbols');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();
  const longPressTimeout = useRef(null);

  const selectedSymbols = useSelector((state) => state.PriceTrading.symbolsToShow);

  // New state for the plus button modal to show all symbols
  const [isPlusModalOpen, setIsPlusModalOpen] = useState(false);

  const togglePlusModal = () => {
    setIsPlusModalOpen(!isPlusModalOpen);
  };

  // State to store lowest and highest bid values for each symbol
  const [symbolStats, setSymbolStats] = useState({});

  // Detect screen size
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    const socket = io('abc');

    socket.on('new_data', (data) => {
      if (data && data.symbol && data.bid && data.ask) {
        // Check if the symbol is already in the state
        const existingSymbolData = symbols[data.symbol];

        // Only update if the data has changed
        if (!existingSymbolData || existingSymbolData.bid !== data.bid || existingSymbolData.ask !== data.ask) {
          dispatch(setSymbols({ [data.symbol]: data }));
          setLoading(false);

          // Update lowest and highest bid values
          setSymbolStats((prevStats) => {
            const currentStats = prevStats[data.symbol] || { lowestBid: data.bid, highestBid: data.bid };

            return {
              ...prevStats,
              [data.symbol]: {
                lowestBid: Math.min(currentStats.lowestBid, data.bid),  // Update lowest bid
                highestBid: Math.max(currentStats.highestBid, data.bid) // Update highest bid
              }
            };
          });
        }
      } else {
        console.error("Received data is not structured correctly:", data);
      }
    });

    socket.on('connect_error', (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, symbols]);


  useEffect(() => {
    // Load selected symbols from local storage on mount
    const storedSymbols = JSON.parse(localStorage.getItem('selectedSymbols')) || [];
    storedSymbols.forEach(symbol => {
      dispatch(setSymbolToShow(symbol));
    });
  }, [dispatch]);

  useEffect(() => {
    // Store selected symbols in local storage whenever they change
    localStorage.setItem('selectedSymbols', JSON.stringify(selectedSymbols));
  }, [selectedSymbols]);

  // Update the current time every second
  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC' })); // UTC format
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const handleTouchStart = (symbol) => {
    longPressTimeout.current = setTimeout(() => {
      setLongPressedSymbol(symbol);
      setIsModalOpen(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Filter symbols based on selected ones and search query
  const filteredSymbols = Object.keys(symbols).filter(symbolKey =>
    selectedSymbols.includes(symbolKey) &&
    checkedSymbols.includes(symbolKey) &&  // Filter by checked symbols
    symbolKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priceFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  const bidFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatPrice = (value, decimals = 2) => {
    const formatter = decimals === 2 ? priceFormatter : bidFormatter;
    const formattedValue = formatter.format(value);
    const parts = formattedValue.split('.');
    return {
      integer: parts[0],
      decimal: parts[1] ? `.${parts[1]}` : ''
    };
  }

  // New handler to toggle checkboxes
 const handleCheckboxChange = (symbol) => {
    const updatedCheckedSymbols = checkedSymbols.includes(symbol) 
      ? checkedSymbols.filter(item => item !== symbol)
      : [...checkedSymbols, symbol];
    
    setCheckedSymbols(updatedCheckedSymbols);
    dispatch(setSymbolToShow(symbol)); 
  };


  return (
    <Col xl={12}>
      <Card style={{ background: isMobile ? "transparent" : "", maxHeight: !isMobile ? "500px" : "auto" }}>
        <CardHeader className="align-items-center d-flex" style={{ padding: isMobile ? "0" : "1rem", marginBottom: isMobile ? "5px" : "0" }}>
          <button
            className='me-2 btn btn-soft-secondary '
            onClick={togglePlusModal}
          >
            <i className="ri-add-line"></i>
          </button>
          {/* Search Bar */}
          <Input
            type="text"
            placeholder="Search symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: isMobile ? '100%' : '300px' }}
          />
        </CardHeader>
        <div className="card-body pt">
          <div className="table-responsive table-card">
            {loading ? (
              <Spinners setLoading={setLoading} />
            ) : isMobile ? (
              <ListGroup>
                {filteredSymbols.map(symbolKey => {
                  const symbolData = symbols[symbolKey];
                  const previousData = previousSymbols[symbolKey] || {};
                  const stats = symbolStats[symbolKey] || { lowestBid: symbolData.bid, highestBid: symbolData.bid };

                  return (
                    <ListGroupItem
                      key={symbolKey}
                      onClick={() => {
                        navigate('/symbol-detail');
                        dispatch(setSelectedSymbol(symbolData.symbol));
                      }}
                      onTouchStart={() => handleTouchStart(symbolData.symbol)}
                      onTouchEnd={handleTouchEnd}
                      onContextMenu={handleContextMenu}
                      style={{ cursor: 'pointer', padding: "5px" }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="col-6">
                          <strong>{symbolData.symbol}</strong>
                          <div style={{ fontSize: '12px', color: 'gray' }}>
                            {currentTime}
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className='mb-0 fw-semibold' style={{
                                color: previousSymbols[symbolData.symbol]?.bid !== undefined
                                  ? (previousSymbols[symbolData.symbol].bid > symbolData.bid ? '#eb5254' : '#3577f1')
                                  : 'black'
                              }}>
                                <span style={{ fontSize: '13px' }}>{formatPrice(symbolData.bid).integer}</span>
                                <span style={{ fontSize: '16px' }}>{formatPrice(symbolData.bid).decimal}</span>
                              </p>
                              <p className='text-muted m-0' style={{ fontSize: "10px" }}>L: {stats.lowestBid}</p>  {/* Lowest bid value */}
                            </div>
                            <div>
                              <p className='mb-0 fw-semibold' style={{
                                color: previousSymbols[symbolData.symbol]?.ask !== undefined
                                  ? (previousSymbols[symbolData.symbol].bid > symbolData.bid ? '#eb5254' : '#3577f1')
                                  : 'black'
                              }}>
                                <span style={{ fontSize: '13px' }}>{formatPrice(symbolData.ask).integer}</span>
                                <span style={{ fontSize: '16px' }}>{formatPrice(symbolData.ask).decimal}</span>
                              </p>
                              <p className='text-muted m-0' style={{ fontSize: "10px" }}>H: {stats.highestBid}</p> {/* Highest bid value */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListGroupItem>
                  );
                })}
              </ListGroup>
            ) : (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>

                <Table striped responsive>
                  <thead className="text-white bg-primary">
                    <tr>
                      <th>Symbol</th>
                      <th>Bid</th>
                      <th>Ask</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSymbols.map(symbolKey => {
                      const symbolData = symbols[symbolKey];
                      const previousData = previousSymbols[symbolKey] || {};

                      const bidColor = previousData.bid ? (symbolData.bid < previousData.bid ? 'text-danger' : 'text-primary') : 'text-primary';
                      const askColor = previousData.ask ? (symbolData.ask < previousData.ask ? 'text-danger' : 'text-primary') : 'text-primary';

                      return (
                        <tr
                          key={symbolKey}
                          onClick={() => {
                            dispatch(setSelectedSymbol(symbolData.symbol));
                          }}
                          onTouchStart={() => handleTouchStart(symbolData.symbol)}
                          onTouchEnd={handleTouchEnd}
                          onContextMenu={handleContextMenu}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <strong>{symbolData.symbol}</strong>
                            <div style={{ fontSize: '12px', color: 'gray' }}>
                              {currentTime}
                            </div>
                          </td>
                          <td style={{
                            color: previousSymbols[symbolData.symbol]?.bid !== undefined
                              ? (previousSymbols[symbolData.symbol].bid > symbolData.bid ? '#eb5254' : '#3577f1')
                              : 'black'
                          }}>
                            <span style={{ fontSize: '13px' }}>{formatPrice(symbolData.ask).integer}</span>
                            <span style={{ fontSize: '16px' }}>{formatPrice(symbolData.ask).decimal}</span>
                          </td>
                          <td style={{
                            color: previousSymbols[symbolData.symbol]?.ask !== undefined
                              ? (previousSymbols[symbolData.symbol].ask > symbolData.ask ? '#eb5254' : '#3577f1')
                              : 'black'
                          }}>
                            <span style={{ fontSize: '13px' }}>{formatPrice(symbolData.ask).integer}</span>
                            <span style={{ fontSize: '16px' }}>{formatPrice(symbolData.ask).decimal}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

            )}
          </div>
        </div>
      </Card>


      <Modal isOpen={isPlusModalOpen} toggle={togglePlusModal} centered>
        <ModalBody>
          <h5 className="text-center">All Symbols</h5>
          <ListGroup style={{ maxHeight: "250px", overflowY: "auto" }}>
            {Object.keys(symbols).map((symbolKey) => (
              <ListGroupItem key={symbolKey} style={{ cursor: 'pointer' }}>
                <Input
                  type="checkbox"
                  checked={checkedSymbols.includes(symbolKey)}
                  onChange={() => handleCheckboxChange(symbolKey)}
                  style={{ marginRight: '10px' }}
                />
                {symbolKey}
              </ListGroupItem>
            ))}
          </ListGroup>
          <Button color="danger" className="w-100 mt-3" onClick={togglePlusModal}>Close</Button>
        </ModalBody>
      </Modal>

  

    </Col>
  );
};

export default PriceList;
