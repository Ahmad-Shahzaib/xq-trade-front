import React from 'react';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';
const Referrals = () => {
    const { t } = useTranslation(); // Initialize translation function
    // Example data
    const usersData = [
        { name: 'John Doe', created: '2024-01-01', balance: 1000.00, equity: 1500.00 },
        { name: 'Jane Smith', created: '2024-02-15', balance: 1500.00, equity: 1600.00 },
        { name: 'Ali Raza', created: '2024-03-01', balance: 1200.00, equity: 1250.00 },
        // Add more data as needed
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <h3 className="mb-0 text-secondary"> {t('Referrals')}</h3>
                </CardHeader>
                <CardBody>
                    <Table hover responsive>
                        <thead>
                            <tr>
                                <th>{t('Name')}</th>
                                <th>{t('Created')}</th>
                                <th>{t('Balance')}</th>
                                <th>{t('Equity')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.created}</td>
                                    <td>{user.balance.toFixed(2)}</td>
                                    <td>{user.equity.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>

        </>

    );
};

export default Referrals;
