import React from "react";
import { TabContent, TabPane } from "reactstrap";
import { useSearchParams } from "react-router-dom";
import MarketGraph from '../../pages/DashboardCrypto/MarketGraph/MarketGraph2'
import Settings from "../../pages/DashboardCrypto/Settings";
import Events from "../../pages/DashboardCrypto/Events/Events";
import Help from "../../pages/DashboardCrypto/Help/Helps";
import Trades from "../../pages/DashboardCrypto/TradesHistory/Trades";
import Market from "../../pages/DashboardCrypto/Market/Market";

const TabContentComponent = () => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "1"; // Use URL for active tab

    return (
        <TabContent activeTab={activeTab} className="text-muted h-100">
            <TabPane tabId="1">
                <MarketGraph />
            </TabPane>
            <TabPane tabId="2">
                <Trades/>
            </TabPane>
            <TabPane tabId="3">
                <Market/>
            </TabPane>
            <TabPane tabId="4">
                <Events/>
            </TabPane>
            <TabPane tabId="5" className="h-100">
                <Help/>

            </TabPane>
            <TabPane tabId="6">
                <Settings />
            </TabPane>
        </TabContent>
    );
};

export default TabContentComponent;
