import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setSelectedSymbols, setClickedSymbolData, setClickedSymbolAsk, setClickedSymbolBid, toggleTradingModal,
    // setSymbols, selectFilteredStaticSymbols, setFilteredStaticSymbols
} from '../../../rtk/slices/tradingSlice/tradingSlice';
import { Card, CardBody, CardHeader, Input, Table, Modal, ModalBody, Button, ListGroup, ListGroupItem } from 'reactstrap';
import useWindowSize from '../../../Components/Hooks/useWindowSize';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStaticSymbols } from '../../../rtk/slices/tradingSlice/tradingSlice';
import TableRow from './TableRow';
import ListItem from './ListItem';
import { handleTouchStart } from './functions';
import { useTranslation } from 'react-i18next';

const Pricing = ({ toggleTab }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [isPlusModalOpen, setPlusModalOpen] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState("");
    const [tableSearchQuery, setTableSearchQuery] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-GB')); // 24-hour format
    const [longPressedSymbol, setLongPressedSymbol] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previousPrices, setPreviousPrices] = useState({});
    const [priceColors, setPriceColors] = useState({});
    const [percentageChanges, setPercentageChanges] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [symbolSpread, setSymbolSpread] = useState({});
    const [decimalDigits, setDecimalDigits] = useState({});

    const symbols = useSelector((state) => state.trading.symbols);
    const { staticSymbols } = useSelector(state => state.trading)
    const selectedSymbols = useSelector((state) => state.trading.selectedSymbols);

    const currentPath = location.pathname
    const isBaseUrl = currentPath === "/" || currentPath === "/trade";
    const { width } = useWindowSize();
    const isMobile = width <= 768;

    const serverTimezone = staticSymbols[0]?.time_zone;

    const filteredStaticSymbols = staticSymbols.filter(({ Symbol }) =>
        selectedSymbols.includes(Symbol)
    );

    const openTradingModal = () => dispatch(toggleTradingModal());

    const handleSelectAll = () => {
        if (selectAll) {
            // Unselect all symbols
            dispatch(setSelectedSymbols([]));
        } else {
            // Select all symbols
            dispatch(setSelectedSymbols(filteredModalSymbols));
        }
        setSelectAll(!selectAll);
    };




    const togglePlusModal = () => setPlusModalOpen(!isPlusModalOpen);

    const handleCheckboxChange = (symbol) => {
        const updatedSymbols = selectedSymbols.includes(symbol)
            ? selectedSymbols.filter((s) => s !== symbol)
            : [...selectedSymbols, symbol];
        dispatch(setSelectedSymbols(updatedSymbols));
    };

    const filteredModalSymbols = useMemo(() =>
        Object.keys(symbols).filter((symbol) =>
            symbol.toLowerCase().includes(modalSearchQuery.toLowerCase())
        ), [symbols, modalSearchQuery]);

    const filteredTableSymbols = useMemo(() =>
        selectedSymbols.filter((symbol) =>
            symbol.toLowerCase().includes(tableSearchQuery.toLowerCase())
        ), [selectedSymbols, tableSearchQuery]);


    const getPriceColor = (currentBid, previousBid) => {
        if (currentBid > previousBid) {
            return 'text-primary'; // If price increased
        } else if (currentBid < previousBid) {
            return 'text-secondary'; // If price decreased
        }
        return null; // No color if there's no change (optional)
    };



    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-GB', { timeZone: serverTimezone }));
        }, 1000);

        return () => clearInterval(timerId);

    }, []);


    useEffect(() => {

        const lastBidPrices = filteredStaticSymbols.reduce((acc, symbolData) => {
            const { Symbol, last_bid_price } = symbolData;
            if (selectedSymbols.includes(Symbol)) {
                acc[Symbol] = last_bid_price; // Store last bid price for the symbol
            }
            return acc;
        }, {});

        const multiplyBy = filteredStaticSymbols.reduce((acc, symbolData) => {
            const { Symbol, Multiply } = symbolData;
            if (selectedSymbols.includes(Symbol)) {
                acc[Symbol] = Multiply;
            }
            return acc;
        }, {});

        const decimalDigits = filteredStaticSymbols.reduce((acc, symbolData) =>{
            const { Symbol, Digits } = symbolData;
            if (selectedSymbols.includes(Symbol)) {
                acc[Symbol] = Digits;
            }
            return acc;
        },{})

        selectedSymbols.forEach(symbol => {
            const { bid, ask, spread } = symbols[symbol] || {};
            const lastBidPrice = lastBidPrices[symbol];
            const multiply = multiplyBy[symbol];
            const digits = decimalDigits[symbol]

            if (multiply && ask && bid && spread) {
                const calculatedSpread = spread * multiply
                setSymbolSpread((prevState) => ({
                    ...prevState,
                    [symbol]: calculatedSpread,
                }));
            }

            if(digits && ask && bid ){
                setDecimalDigits((prevState)=> ({
                    ...prevState,
                    [symbol]:digits
                }))
                
            }

            if (lastBidPrice && bid) {
                const percentageChange = ((bid - lastBidPrice) / lastBidPrice) * 100;
                const priceChangeColor = getPriceColor(bid, lastBidPrice);

               
                if (priceChangeColor) {
                    setPriceColors((prevState) => ({
                        ...prevState,
                        [symbol]: priceChangeColor,
                    }));
                }

                
                setPreviousPrices((prevState) => ({
                    ...prevState,
                    [symbol]: { bid, ask },
                }));

                
                setPercentageChanges((prevState) => ({
                    ...prevState,
                    [symbol]: percentageChange.toFixed(2),
                }));
            }

            if (bid && ask) {
                
                const prevBid = previousPrices[symbol]?.bid || bid;

                
                const color = getPriceColor(bid, prevBid);

                if (color) {
                    setPriceColors((prevState) => ({
                        ...prevState,
                        [symbol]: color, 
                    }));
                }
                setPreviousPrices((prevState) => ({
                    ...prevState,
                    [symbol]: { bid, ask }, 
                }));
            }
        });
    }, [symbols, selectedSymbols]);

    const handleSymbolClick = (symbol) => {
        const { bid, ask } = symbols[symbol] || {};
        const decimalPlaces = decimalDigits[symbol] !== undefined && decimalDigits[symbol] >= 0 
            ? decimalDigits[symbol] 
            : 2; 
    
        // Safely format ask and bid
        const formattedAsk = ask ? Number(ask).toFixed(decimalPlaces) : "0.00";
        const formattedBid = bid ? Number(bid).toFixed(decimalPlaces) : "0.00";
    
        const symbolData = {
            symbol,
            bid: formattedBid,
            ask: formattedAsk,
        };
    
        if (!isBaseUrl && !isMobile) {
            openTradingModal();
        }
    
        // Dispatch clicked symbol data to Redux store
        dispatch(setClickedSymbolData(symbolData.symbol));
        dispatch(setClickedSymbolAsk(formattedAsk));
        dispatch(setClickedSymbolBid(formattedBid));
    
        if (isMobile) {
            navigate('/symbol-detail');
        }
    };
    
    
    
    const longPressTimeout = useRef(null);

   

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

    useEffect(() => {
        const allSelected = filteredModalSymbols.every((symbol) =>
            selectedSymbols.includes(symbol)
        );
        setSelectAll(allSelected);
    }, [filteredModalSymbols, selectedSymbols]);

    // useEffect(() => {
    //     dispatch(getStaticSymbols())
    // }, [dispatch])


    return (
        <>
            {/* <Card style={{ background: isMobile ? "transparent" : "", minHeight: !isMobile ? "100vh" : "auto", position: !isMobile ? 'sticky' : 'relative', width: !isMobile ? '100%' : '100%',height: !isMobile ? "100vh" : "auto", overflow:'auto', scrollbarWidth:'none' }} className='border-all pricing-card mb-0'> */}
            <Card style={{ background: isMobile ? "transparent" : "", minHeight: !isMobile ? "100vh" : "auto", position: !isMobile ? 'fixed' : 'relative', width: !isMobile ? '24.089%' : '100%' }} className='border-all pricing-card d-none'>
                {
                    !isMobile ? (
                        <CardHeader className="border-0 align-items-center d-flex border-bottom">
                            <h4 className="card-title mb-0 flex-grow-1">{t('Market')}</h4>
                        </CardHeader>
                    ) : <></>
                }
                <CardHeader className="align-items-center d-flex bg-transparent"
                    style={{ padding: "0", marginBottom: isMobile ? "5px" : "0", border: 'none' }}
                >
                    <button className='me-2 btn btn-soft-secondary' onClick={togglePlusModal}>
                        <i className="ri-add-line"></i>
                    </button>
                    <Input
                        id='tableSearchQuery'
                        type="text"
                        placeholder="Search symbol..."
                        value={tableSearchQuery}
                        onChange={(e) => setTableSearchQuery(e.target.value)}
                        style={{ width: '100%' }}
                    // style={{ width: isMobile ? '100%' : '300px',maxWidth:'100%' }}
                    />
                </CardHeader>
                <CardBody className='p-0 d-none'>
                    {isMobile ? (
                        // Render List View for Mobile
                        <ListGroup style={{paddingBottom:'1px'}}>
                            {filteredTableSymbols.map((symbol) => {
                                const { bid, ask, spread } = symbols[symbol] || {};
                                // const decimalPlaces = getDecimalPlaces(symbol); // Get decimal places
                                const decimalPlaces = decimalDigits[symbol]; // Get decimal places
                                const percentageChange = percentageChanges[symbol];
                                return (
                                    symbols[symbol] && (
                                        <ListItem
                                            key={symbol}
                                            symbol={symbol}
                                            bid={bid}
                                            ask={ask}
                                            time={currentTime}
                                            lowestBid={previousPrices[symbol]?.lowestBid || bid}
                                            highestBid={previousPrices[symbol]?.highestBid || bid}
                                            onClick={handleSymbolClick}
                                            onTouchStart={() => handleTouchStart(symbol,longPressTimeout,setLongPressedSymbol,setIsModalOpen)}
                                            onTouchEnd={handleTouchEnd}
                                            onContextMenu={handleContextMenu}
                                            color={priceColors}
                                            decimalPlaces={decimalPlaces}
                                            percentageChange={percentageChange}
                                            // spread={spread}
                                            spread={Number(symbolSpread[symbol]).toFixed(0)}
                                        />
                                    )
                                );
                            })}

                        </ListGroup>
                    ) : (
                        // Render Table View for Larger Screens
                        <div className="table-responsive fixed-header-table-wrapper" style={{ height: '100vh', overflow: 'auto', paddingBottom: '106px' }}>
                            <Table responsive hover className="fixed-header-table pricing-table-desktop">
                                <thead >
                                    <tr>
                                        <th>{t('Symbol')}</th>
                                        <th>{t('Bid')}</th>
                                        <th>{t('Ask')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTableSymbols.map((symbol) => {
                                        const { bid, ask, spread } = symbols[symbol] || {};
                                        // const decimalPlaces = getDecimalPlaces(symbol); // Get decimal places
                                        const percentageChange = percentageChanges[symbol];
                                        const decimalPlaces = decimalDigits[symbol];
                                        return (
                                            symbols[symbol] && (
                                                <TableRow
                                                    key={symbol}
                                                    symbol={symbol}
                                                    bid={bid}
                                                    ask={ask}
                                                    onClick={handleSymbolClick}
                                                    color={priceColors}
                                                    decimalPlaces={decimalPlaces? decimalPlaces : 2}
                                                    lowestBid={previousPrices[symbol]?.lowestBid || bid}
                                                    // lowestBid={Math.min(ask,bid)} 
                                                    highestBid={previousPrices[symbol]?.highestBid || bid}
                                                    // highestBid={Math.max(ask,bid)}
                                                    percentageChange={percentageChange}
                                                    time={currentTime}
                                                    // spread={spread}
                                                    spread={Number(symbolSpread[symbol]).toFixed(0)}
                                                />
                                            )
                                        );
                                    })}

                                </tbody>
                            </Table>
                        </div>
                    )}

                    <h3 className='text-center'>Trade</h3>
                </CardBody>
            </Card>

            <Modal isOpen={isPlusModalOpen} toggle={togglePlusModal} centered>
                <ModalBody>
                    <h5 className="text-center">{t('All Symbols')}</h5>
                    <Input
                        type="text"
                        placeholder="Search symbols..."
                        value={modalSearchQuery}
                        onChange={(e) => setModalSearchQuery(e.target.value)}
                        className="mb-3"
                    />
                    <div>
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            style={{ marginRight: '10px' }}
                        />
                        {t('Select All')}
                    </div>
                    <ListGroup style={{ maxHeight: "250px", overflowY: "auto" }}>
                        {filteredModalSymbols.map((symbolKey) => (
                            <ListGroupItem key={symbolKey} style={{ cursor: 'pointer' }} onClick={() => handleCheckboxChange(symbolKey)}>
                                <input
                                    type="checkbox"
                                    checked={selectedSymbols.includes(symbolKey)}
                                    onChange={() => handleCheckboxChange(symbolKey)}
                                    style={{ marginRight: '10px' }}
                                />
                                {symbolKey}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                    <Button color="danger" className="w-100 mt-3" onClick={togglePlusModal}>{t('Close')}</Button>
                </ModalBody>
            </Modal>

            <Modal
                isOpen={isModalOpen}
                toggle={toggleModal}
                centered
                id='symbolModelMenu'
                style={{ bottom: '0', position: 'fixed', width: '100%', margin: 0 }}
            >
                <ModalBody>
                    <h6 className="text-center mt-2 prevent-select">{longPressedSymbol}</h6>
                    <div className="action-btns">
                        <Button
                            className="w-100" color="secondary"
                            onClick={() => {
                                navigate('/symbol-detail');
                                dispatch(setClickedSymbolData(longPressedSymbol));
                                toggleModal();
                            }}>
                            Trade
                        </Button>
                        <Button className="w-100" color="secondary" onClick={() => {
                            toggleTab("3");
                            toggleModal();
                        }}>
                            Chart
                        </Button>
                        <Button className="w-100" color="secondary" onClick={() => { /* Handle action 2 */ }}>
                            Details
                        </Button>
                        <Button className="w-100" color="secondary" onClick={() => { /* Handle action 2 */ }}>
                            Statistics
                        </Button>
                        <Button className="w-100" color="primary" onClick={() => { /* Handle action 2 */ }}>
                            Delete
                        </Button>
                    </div>
                    <Button className="w-100" color="danger" onClick={toggleModal}>{t('Cancel')}</Button>
                </ModalBody>
            </Modal>
        </>
    );
};

export default Pricing;
