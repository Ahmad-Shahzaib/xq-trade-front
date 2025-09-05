import React from 'react';
import { Col, Container,Row} from "reactstrap";

import useWindowSize from '../../Components/Hooks/useWindowSize';
// import MarketGraph from './MarketGraph/MarketGraph';
import MarketGraph from './MarketGraph/MarketGraph2';
import Trading from './Trading/Trading';


import UserCheckModal from './UserCheckModal';

import TabContentComponent from '../../Layouts/BottomNavTabs/TabContentComponent';

const DashboardCrypto = () => {
    document.title = "Trading Application";

    // Detect screen size
    const { width } = useWindowSize();
    const isMobile = width <= 767; // Mobile breakpoint

    return (
        <React.Fragment>
            <div className="page-content p-0" >
                <Container id='containFluid' fluid >

                    {/* Hide content on mobile */}
                    {!isMobile && (
                        <>
                            <UserCheckModal message="To proceed with trading, please select your trading account first." />
                      
                            <Row className="mb-0" style={{ height: "70vh", flexWrap: 'nowrap' }}>
                                <Col xs={8} id='dc-card' className='border-all border-left-none h-100'>
                                    {/* <MarketGraph /> */}
                                </Col>
                                <Col xs={4} id='dp-card' className='border-all border-left-none h-100' style={{ overflow: 'auto', scrollbarWidth: 'thin' }}>
                                    {/* <Trading /> */}
                                </Col>
                            </Row>
                            <Row className='tt-row' style={{ height: "30vh", position: 'relative', overflow: 'auto' }}>
                                <Col xs={12} className='border-all border-top-none border-left-none' style={{ position: 'relative' }}>
                                    {/* <TradeTabs /> */}
                                </Col>
                            </Row>
                        </>
                    )}

                    {/* Show tabs on mobile only */}
                    {isMobile && (
                        <>

                            <TabContentComponent/>
                          
                        </>
                    )}
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardCrypto;
