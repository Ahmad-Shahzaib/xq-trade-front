import React, { useState } from 'react';
import { Card, CardBody, Table, Button } from 'reactstrap';

const PamTable = () => {
   const tableData = [
        { serialNumber: 1, account: '1110240', totalCopier: '480000', totalInvestment: '100000', status: 'active' },
        { serialNumber: 2, account: '1110248', totalCopier: '2000', totalInvestment: '570000', status: 'close' },
        { serialNumber: 3, account: '1110240', totalCopier: '480000', totalInvestment: '100000', status: 'active' },
        { serialNumber: 4, account: '1110248', totalCopier: '2000', totalInvestment: '570000', status: 'active' },
        { serialNumber: 5, account: '1110249', totalCopier: '5000', totalInvestment: '900000', status: 'close' },
        { serialNumber: 6, account: '1110250', totalCopier: '10000', totalInvestment: '450000', status: 'active' },
        { serialNumber: 7, account: '1110251', totalCopier: '350000', totalInvestment: '150000', status: 'active' },
        { serialNumber: 8, account: '1110252', totalCopier: '2200', totalInvestment: '800000', status: 'close' },
        { serialNumber: 9, account: '1110253', totalCopier: '130000', totalInvestment: '250000', status: 'active' },
        { serialNumber: 10, account: '1110254', totalCopier: '9000', totalInvestment: '650000', status: 'close' }
   ];

   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 4;

   // Calculate total pages
   const totalPages = Math.ceil(tableData.length / rowsPerPage);

   // Get current page data
   const currentTableData = tableData.slice(
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
    <Card>
        <CardBody>
            <Table hover responsive>
                <thead>
                    <tr>
                        <th>Sr #</th>
                        <th>Account</th>
                        <th>Total Copier</th>
                        <th>Total Investment</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTableData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.serialNumber}</td>
                            <td>{data.account}</td>
                            <td>{data.totalCopier}</td>
                            <td>{data.totalInvestment}</td>
                            <td style={{ color: data.status === 'active' ? 'green' : 'red' }}>
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
        </CardBody>
    </Card>
   );
};

export default PamTable;
