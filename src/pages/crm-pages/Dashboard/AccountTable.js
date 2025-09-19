import React from "react";
import { Table, Spinner, Alert, Card } from "reactstrap";
import { useSelector } from 'react-redux';

const AccountTable = () => {
    const { tradeAccounts, status, error } = useSelector((state) => state.userDashboard);

    if (status === 'failed') {
        return <Alert color="danger">Error: {error}</Alert>;
    }

    return (

        <>
            <Card className="mb-0">
                <Table hover responsive className="text-center mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Account</th>
                            <th>Type</th>
                            <th>Server</th>
                            <th>Balance</th>
                            <th>Equity</th>
                            <th>Live Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === 'loading' ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <Spinner color="light" />
                                    <p>Loading...</p>
                                </td>
                            </tr>
                        ) : (
                            tradeAccounts.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.account}</td>
                                    <td>{item.trade_group_detail?.name || "N/A"}</td>
                                    <td>{item.server}</td>
                                    <td>{item.info?.leverage || "0"}</td>
                                    <td>{item.info?.Equity || "0"}</td>
                                    <td>{item.info?.liveStatus || "❌"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>
        </>
    );
};

export default AccountTable;