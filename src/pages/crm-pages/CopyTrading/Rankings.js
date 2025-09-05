import React, { useState } from 'react';
import {Table, Button } from 'reactstrap';

const Rankings = () => {
    const rankings = [
        { name: 'Abdullah', gain: '40', commission: '25', minimumInvestment: '150', copiers: '1' },
        { name: 'Jack', gain: '10', commission: '5', minimumInvestment: '100', copiers: '1' },
        { name: 'Alice', gain: '0', commission: '20', minimumInvestment: '200', copiers: '2' },
        { name: 'Bob', gain: '-5', commission: '15', minimumInvestment: '120', copiers: '1' },
        { name: 'Charlie', gain: '50', commission: '30', minimumInvestment: '300', copiers: '3' },
        { name: 'David', gain: '15', commission: '10', minimumInvestment: '180', copiers: '2' }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    // Calculate total pages
    const totalPages = Math.ceil(rankings.length / rowsPerPage);

    // Get current page data
    const currentRankings = rankings.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Gain</th>
                        <th>Commission</th>
                        <th>Minimum Investment</th>
                        <th>Copiers</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRankings.map((data, index) => (
                        <tr key={index}>
                            <td>{data.name}</td>
                            <td
                                style={{
                                    color: parseInt(data.gain) > 0 ? 'green' : 'red'
                                }}
                            >
                                {data.gain}%
                            </td>
                            <td>{data.commission}</td>
                            <td>${data.minimumInvestment}</td>
                            <td>{data.copiers}</td>
                            <td>
                                <i class="ri-eye-line"></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <Button color="primary" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button color="primary" onClick={goToNextPage} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>
        </>
    );
};

export default Rankings;
