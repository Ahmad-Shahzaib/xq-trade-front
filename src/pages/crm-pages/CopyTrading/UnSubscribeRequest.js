import React, { useState } from 'react';
import { Card, CardBody, Table, Button } from 'reactstrap';

const UnSubscribeRequest = () => {
    const unSubscribeRequest = [
        { copierAccount: '110258', masterAccount: '1110139', status: 'active' },
        { copierAccount: '110259', masterAccount: '1110140', status: 'inactive' },
        { copierAccount: '110260', masterAccount: '1110141', status: 'active' },
        { copierAccount: '110261', masterAccount: '1110142', status: 'inactive' }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    // Calculate total pages
    const totalPages = Math.ceil(unSubscribeRequest.length / rowsPerPage);

    // Get current page data
    const currentRequests = unSubscribeRequest.slice(
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
            <Table  hover responsive>
                <thead >
                    <tr>
                        <th>Copier Account</th>
                        <th>Master Account</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRequests.map((data, index) => (
                        <tr key={index}>
                            <td>{data.copierAccount}</td>
                            <td>{data.masterAccount}</td>
                            <td
                                style={{
                                    color: data.status === 'active' ? 'green' : 'red'
                                }}
                            >
                                {data.status}
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

export default UnSubscribeRequest;
