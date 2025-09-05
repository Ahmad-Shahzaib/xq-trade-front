import React, { useState } from 'react';
import { Table, Button } from 'reactstrap';

const CopyRequest = () => {
    const copyRequests = [
        { copierAccount: '1110240', masterAccount: '1010139', initialAmount: '100000', approvedAt: '10-10-2014', closingAmount: '240000', closedAt: '02-03-2017', status: 'close' },
        { copierAccount: '1110320', masterAccount: '1010139', initialAmount: '570000', approvedAt: '27-11-2021', closingAmount: '565020', closedAt: '02-12-2021', status: 'active' },
        { copierAccount: '1110250', masterAccount: '1010120', initialAmount: '300000', approvedAt: '14-05-2022', closingAmount: '350000', closedAt: '22-08-2023', status: 'close' },
        { copierAccount: '1110450', masterAccount: '1010155', initialAmount: '750000', approvedAt: '30-07-2021', closingAmount: '800000', closedAt: '19-02-2022', status: 'close' },
        { copierAccount: '1110555', masterAccount: '1010110', initialAmount: '120000', approvedAt: '12-09-2023', closingAmount: '130000', closedAt: '15-10-2023', status: 'active' }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    // Calculate total pages
    const totalPages = Math.ceil(copyRequests.length / rowsPerPage);

    // Get current page data
    const currentCopyRequests = copyRequests.slice(
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
                        <th>Copier Account</th>
                        <th>Master Account</th>
                        <th>Initial Amount</th>
                        <th>Approved At</th>
                        <th>Closing Amount</th>
                        <th>Closed At</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCopyRequests.map((data, index) => (
                        <tr key={index}>
                            <td>{data.copierAccount}</td>
                            <td>{data.masterAccount}</td>
                            <td>${data.initialAmount}</td>
                            <td>{data.approvedAt}</td>
                            <td>${data.closingAmount}</td>
                            <td>{data.closedAt}</td>
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

export default CopyRequest;
