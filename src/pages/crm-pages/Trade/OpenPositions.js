import React, { useState } from 'react';
import { Table, Card, CardHeader, CardBody, Button, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import AccountDetails from './AccountDetails';

const OpenPositions = () => {

    const data = [
        { symbol: 'XAUUSD', ticket: '1001', time: '2023-01-01 14:00', type: 'Buy', volume: 1.0, price: 1800, sl: 1780, tp: 1820, profit: 200 },
        { symbol: 'EURUSD', ticket: '1002', time: '2023-01-01 15:00', type: 'Sell', volume: 0.5, price: 1.12, sl: 1.13, tp: 1.10, profit: 50 },
        { symbol: 'GBPUSD', ticket: '1003', time: '2023-01-01 16:00', type: 'Buy', volume: 2.0, price: 1.30, sl: 1.28, tp: 1.32, profit: 150 },
        { symbol: 'USDJPY', ticket: '1004', time: '2023-01-01 17:00', type: 'Sell', volume: 0.8, price: 109.5, sl: 110.0, tp: 108.0, profit: 80 },
        { symbol: 'AUDUSD', ticket: '1005', time: '2023-01-01 18:00', type: 'Buy', volume: 1.5, price: 0.75, sl: 0.74, tp: 0.76, profit: 60 },
        { symbol: 'USDCAD', ticket: '1006', time: '2023-01-01 19:00', type: 'Sell', volume: 1.0, price: 1.25, sl: 1.26, tp: 1.24, profit: 40 },
        { symbol: 'NZDUSD', ticket: '1007', time: '2023-01-01 20:00', type: 'Buy', volume: 1.2, price: 0.71, sl: 0.70, tp: 0.72, profit: 70 },
    ];

    // Pagination states
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    // Calculate paginated data
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const goToPage = (page) => {
        setCurrentPage(page);
    };
    return (
        <>
            <div className="open-positions">
                <Table striped hover responsive>
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th>Symbol</th>
                            <th>Ticket</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Volume</th>
                            <th>Price</th>
                            <th>SL</th>
                            <th>TP</th>
                            <th>Profit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.symbol}</td>
                                <td>{item.ticket}</td>
                                <td>{item.time}</td>
                                <td>{item.type}</td>
                                <td>{item.volume}</td>
                                <td>{item.price}</td>
                                <td>{item.sl}</td>
                                <td>{item.tp}</td>
                                <td>{item.profit}</td>
                                <td>
                                    <Button color="primary" size="sm">Details</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Pagination */}
                <Pagination className="justify-content-center">
                    <PaginationItem disabled={currentPage <= 0}>
                        <PaginationLink previous onClick={() => goToPage(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem active={index === currentPage} key={index}>
                            <PaginationLink onClick={() => goToPage(index)}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage >= totalPages - 1}>
                        <PaginationLink next onClick={() => goToPage(currentPage + 1)} />
                    </PaginationItem>
                </Pagination>
            </div>
            <AccountDetails />

        </>
    )
}

export default OpenPositions
