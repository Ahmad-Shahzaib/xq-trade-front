import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
import useWindowSize from '../../../Components/Hooks/useWindowSize';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import OneClickTrading from './OneClickTrading';
// import LightweightChart from './TradingViewChart2';
// import AccountTypeModel from './AccountTypeModel';
import TradingViewChart from './TradingViewChart';


const MarketGraph = () => {
    const location = useLocation();
    const { width } = useWindowSize();
    const isMobile = width <= 768;
    // const layoutMode = useSelector((state) => state.Layout.layoutModeType);
    // const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData);

    const path = location.pathname;
    const currentPath = path === '/trade?tab=3'




    useEffect(() => {
        const mainCnt = document.getElementsByClassName('main-content')
        if (currentPath && isMobile) {


            mainCnt.style.height = "100vh"
        }


    }, [])

    // useEffect(() => {
    //     const container = document.getElementById("tradingview-widget-container");

    //     // Remove any existing scripts to prevent duplication
    //     container.innerHTML = '';

    //     // Safely handle selectedSymbol
    //     const symbol = typeof selectedSymbol === 'string' && selectedSymbol.includes('.')
    //         ? selectedSymbol.substring(0, selectedSymbol.indexOf('.'))
    //         : selectedSymbol || 'BTCUSD'// Fallback to a default value

    //     const script = document.createElement('script');
    //     script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    //     script.async = true;
    //     script.innerHTML = JSON.stringify({
    //         "autosize": true,
    //         "symbol": symbol,
    //         "interval": "D",
    //         "timezone": "Asia/Riyadh",
    //         "theme": layoutMode === "dark" ? 'dark' : 'light',
    //         "style": "1",
    //         "locale": "en",
    //         "allow_symbol_change": true,
    //         "calendar": false,
    //         "support_host": "https://www.tradingview.com"
    //     });

    //     container.appendChild(script);

    //     // Cleanup function
    //     return () => {
    //         container.innerHTML = '';
    //     };
    // }, [layoutMode, selectedSymbol]); // Re-run when layoutMode changes


    return (
        <React.Fragment>
            <div className="">
                <div className="container-fluid p-0" style={{ height: '100%',
                 }}>
                    <Card className='mb-0 dc-card h-100 position-relative'
                     >
                        {/* {!isMobile && (
                            <CardHeader className="border-0 align-items-center d-flex border-bottom">
                                <h4 className="card-title mb-0 flex-grow-1">Market Graph</h4>
                            </CardHeader>
                        )} */}
                        <CardBody style={{ height: '100%' }} className="p-0 symbols-chart ">

                            {/* <div id="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
                        <div className="tradingview-widget-container__widget"></div>
                    </div> */}
                            <TradingViewChart />
                            {/* <LightweightChart /> */}
                            {/* <ApexChart/> */}

                        </CardBody>
                        {/* <OneClickTrading/> */}
                    </Card>
                </div>

            </div>
        </React.Fragment>
    );
};

export default MarketGraph;