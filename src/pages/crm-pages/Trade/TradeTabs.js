import React, { useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';
import OpenPositions from './OpenPositions'
import TradeHistory from './TradeHistory';

const TradeTabs = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <Card>
        <CardBody>
          <div>
            <Nav tabs className="border-top-0">
              <NavItem className='ursor-pointer'>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => { toggle('1'); }}
                >
                  Open Positions
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{ cursor: "pointer" }}
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => { toggle('2'); }}
                >
                  Trade History
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} className="mt-2">
              <TabPane tabId="1">
                <OpenPositions />
              </TabPane>
              <TabPane tabId="2">
                <TradeHistory />
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    </>

  );
};

export default TradeTabs;
