import React from 'react';
import { Table, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
const DemoAccountTable = () => {

    const { t } = useTranslation(); // Initialize translation function
    const dummyData = [
        {
            account: '12345',
            mainPassword: '******',
            investorPassword: '******',
            group: 'A',
            balance: '1000.00',
            equity: '1050.00',
            leverage: '1:100',
            liveStatus: 'Active',
        },
        {
            account: '67890',
            mainPassword: '******',
            investorPassword: '******',
            group: 'B',
            balance: '1500.00',
            equity: '1600.00',
            leverage: '1:200',
            liveStatus: 'Inactive',
        },
        {
            account: '11223',
            mainPassword: '******',
            investorPassword: '******',
            group: 'C',
            balance: '2000.00',
            equity: '2200.00',
            leverage: '1:50',
            liveStatus: 'Active',
        },
    ];


    return (
        <>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>{t('Account')}</th>
                        <th>{t('Main Password')}</th>
                        <th>{t('Investor Password')}</th>
                        <th>{t('Group')}</th>
                        <th>{t('Balance')}</th>
                        <th>{t('Equity')}</th>
                        <th>{t('Leverage')}</th>
                        <th>{t('Live Status')}</th>
                        <th>{t('Action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.account}</td>
                            <td>{data.mainPassword}</td>
                            <td>{data.investorPassword}</td>
                            <td>{data.group}</td>
                            <td>{data.balance}</td>
                            <td>{data.equity}</td>
                            <td>{data.leverage}</td>
                            <td>{data.liveStatus}</td>
                            <td>
                                <Button color="primary" size="sm">{t('Edit')}</Button>
                                <Button color="danger" size="sm" className="ml-2">{t('Delete')}</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default DemoAccountTable
