import React from 'react';
import { Card, CardBody, CardHeader, Row, Col } from 'reactstrap';

const DashboardSummary = () => {
    // Example data
    const stats = {
        totalUsers: 0,
        totalAccounts: 0,
        ibCommission: 0.00,
        totalDeposits: 0.00,
    };

    const renderMetricCard = (title, value) => (
        <Col lg={3} md={6} sm={12}>
            <Card>
                <CardHeader>
                    <h5 className="mb-0 text-secondary">{title}</h5>
                </CardHeader>
                <CardBody>
                    <h3>{value}</h3>
                </CardBody>
            </Card>
        </Col>
    );

    return (
        <>
            <Row>
                {renderMetricCard('Total Users', stats.totalUsers)}
                {renderMetricCard('Total Accounts', stats.totalAccounts)}
                {renderMetricCard('IB Commission', stats.ibCommission.toFixed(2))}
                {renderMetricCard('Total Deposits', stats.totalDeposits.toFixed(2))}
            </Row>
        </>

    );
};

export default DashboardSummary;
