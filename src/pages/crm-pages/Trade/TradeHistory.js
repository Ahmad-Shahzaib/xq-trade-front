import React, { useState } from 'react';
import { Table, Card, CardHeader, CardBody, Button, Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const TradeHistory = () => {
    const data = [
        { time: '2023-01-01 14:00', symbol: 'XAUUSD', type: 'Buy', volume: 1.0, openPrice: 1800, sl: 1780, tp: 1820, price: 1810, profit: 200 },
        { time: '2023-01-01 15:00', symbol: 'EURUSD', type: 'Sell', volume: 0.5, openPrice: 1.12, sl: 1.13, tp: 1.10, price: 1.11, profit: 50 },
        { time: '2023-01-01 16:00', symbol: 'GBPUSD', type: 'Buy', volume: 2.0, openPrice: 1.30, sl: 1.28, tp: 1.32, price: 1.31, profit: 150 },
        { time: '2023-01-01 17:00', symbol: 'USDJPY', type: 'Sell', volume: 0.8, openPrice: 109.5, sl: 110.0, tp: 108.0, price: 108.5, profit: 80 },
        { time: '2023-01-01 18:00', symbol: 'AUDUSD', type: 'Buy', volume: 1.5, openPrice: 0.75, sl: 0.74, tp: 0.76, price: 0.755, profit: 60 },
        { time: '2023-01-01 19:00', symbol: 'USDCAD', type: 'Sell', volume: 1.0, openPrice: 1.25, sl: 1.26, tp: 1.24, price: 1.24, profit: 40 },
        { time: '2023-01-01 20:00', symbol: 'NZDUSD', type: 'Buy', volume: 1.2, openPrice: 0.71, sl: 0.70, tp: 0.72, price: 0.715, profit: 70 },
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
            <div className="trade-history">
                <Table striped hover responsive>
                    <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
                        <tr>
                            <th>Time</th>
                            <th>Symbol</th>
                            <th>Type</th>
                            <th>Volume</th>
                            <th>Open Price</th>
                            <th>S/L</th>
                            <th>T/P</th>
                            <th>Price</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.time}</td>
                                <td>{item.symbol}</td>
                                <td>{item.type}</td>
                                <td>{item.volume}</td>
                                <td>{item.openPrice}</td>
                                <td>{item.sl}</td>
                                <td>{item.tp}</td>
                                <td>{item.price}</td>
                                <td>{item.profit}</td>
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
        </>
    )
}

export default TradeHistory
