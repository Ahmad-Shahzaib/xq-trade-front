import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Spinner } from 'reactstrap';
import { tradeAccountsList } from '../../../rtk/slices/crm-slices/trade/tradeAccountsList';
import { token } from '../../../utils/config';
import { useNavigate } from 'react-router-dom';
import { setSelectedAccount } from '../../../rtk/slices/accountTypeSlice/accountTypeSlice';

const AccountDetailsTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tradeAccount, status } = useSelector((state) => state.tradeAccountsList) || {};
    const tradeAccountsData = tradeAccount?.data || [];

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            dispatch(tradeAccountsList(storedToken));
        }
    }, [dispatch]);

    return (
        <div className="account-details-table">
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        {/* <th>Main Password</th> */}
                        {/* <th>Investor Password</th> */}
                        <th>Group</th>
                        <th>Balance</th>
                        {/* <th>Equity</th> */}
                        {/* <th>Leverage</th> */}
                        {/* <th>Live Status</th> */}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {status === 'loading' ? (
                        <tr>
                            <td colSpan="11" className="text-center">
                                <Spinner size="sm" color="primary" /> Loading...
                            </td>
                        </tr>
                    ) : tradeAccountsData.length > 0 ? (
                        tradeAccountsData.map((account) => (
                            <tr key={account.id}>
                                <td>{account.name}</td>
                                {/* <td>{account.main_password}</td> */}
                                {/* <td>{account.investor_password}</td> */}
                                {/* <td>{account.trade_group_detail?.name || 'N/A'}</td> */}
                                <td>{account.trade_group_detail?.name}</td>
                                <td>{account.balance === null ? "0" : account.balance}</td>
                                {/* <td>{account.leverage}</td> */}
                                {/* <td>{account.status ? 'Active' : 'Inactive'}</td> */}
                                <td>
                                    <Button
                                        className=''
                                        style={{
                                            background: "linear-gradient(90deg, #c41a6b, #390452)",
                                            border: "none",
                                            borderRadius: 10,
                                            padding: "12px 28px",
                                            fontWeight: 600,
                                            fontSize: 18,
                                            boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                                            color: "#fff"
                                        }}
                                        size="sm"
                                        onClick={() => {
                                            dispatch(setSelectedAccount(account));
                                            localStorage.setItem("selectedAccount", JSON.stringify(account));
                                            localStorage.setItem('user', JSON.stringify({ account: account.account }));
                                            navigate('/dashboard');
                                        }}
                                    >
                                        Trade
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No Trade Accounts Available</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default AccountDetailsTable;
