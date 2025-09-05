import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { Link } from 'react-router-dom';
import classnames from "classnames";

// Import your components
import Rankings from './Rankings';
import CopyRequest from './CopyRequest';
import UnSubscribeRequest from './UnSubscribeRequest';

const Index = () => {
    // Default active tab state
    const [activeTab, setActiveTab] = useState("1");

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>

                    <Row>
                        <Col xxl={12}>
                            <h5 className="mb-3">Copy Trading Tabs</h5>
                            <Card>
                                <CardBody>
                                    <Nav tabs className="nav nav-tabs nav-border-top nav-border-top-primary mb-3">
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => toggleTab("1")}
                                            >
                                                Rankings
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => toggleTab("2")}
                                            >
                                                Copy Request
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({ active: activeTab === "3" })}
                                                onClick={() => toggleTab("3")}
                                            >
                                                Unsubscribe Request
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                style={{ cursor: "pointer" }}
                                                className={classnames({ active: activeTab === "4" })}
                                                onClick={() => toggleTab("4")}
                                            >
                                                Copier Area
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent activeTab={activeTab} className="text-muted">
                                        {/* Rankings Tab */}
                                        <TabPane tabId="1">
                                            <Rankings />
                                        </TabPane>

                                        {/* Copy Request Tab */}
                                        <TabPane tabId="2">
                                            <CopyRequest />
                                        </TabPane>

                                        {/* Unsubscribe Request Tab */}
                                        <TabPane tabId="3">
                                            <UnSubscribeRequest />
                                        </TabPane>

                                        {/* Copier Area Tab */}
                                        <TabPane tabId="4">
                                            <div className="d-flex">
                                                <div className="flex-grow-1 ms-2">
                                                    <h5>API Not Working</h5>
                                                    <p>There seems to be an issue with the copier area API. Please try again later.</p>
                                                </div>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Index;
