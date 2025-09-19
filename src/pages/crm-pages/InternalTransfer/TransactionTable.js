import React, { useEffect, useState } from 'react';
import { Table, Pagination, PaginationItem, PaginationLink, Spinner, Alert } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { internalTransferList } from '../../../rtk/slices/InternalTransferSlice/listInternalTransfer';
import { useTranslation } from 'react-i18next';
import BackButton from '../../../Layouts/BackButton';
const TransactionTable = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector(state => state.internalTransferList);
    const { t } = useTranslation(); // Initialize translation function
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 50; // Set the number of rows per page

    useEffect(() => {
        dispatch(internalTransferList());
    }, [dispatch]);

    // Handle pagination
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = data.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='page-content'
        style={{height:"89vh"}}>
            <BackButton />
            <div className='container-fluid'>
                <div>
                    {loading && <Spinner color="light" />}
                    {error && <Alert color="danger">{error}</Alert>}

                    {!loading && !error && data.length > 0 ? (
                        <>
                            <Table hover responsive>
                                <thead>
                                    <tr>
                                        <th>{t('ID')}</th>
                                        <th>{t('Date')}</th>
                                        <th>{t('Amount')}</th>
                                        <th>{t('Charge')}</th>
                                        <th>{t('Post Balance')}</th>
                                        <th>{t('Detail')}</th>
                                        <th>{t('Trade Account')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTransactions.map((transaction, index) => (
                                        <tr key={transaction.id || index}>
                                            <td>{transaction.id}</td>
                                            <td>{new Date(transaction.created_at).toLocaleString()}</td>
                                            <td>{Number(transaction.amount)}</td>
                                            <td>{Number(transaction.charge)}</td>
                                            <td>{Number(transaction.post_balance)}</td>
                                            <td>{transaction.details || 'N/A'}</td>
                                            <td>{transaction.trade_account_id || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* Pagination */}
                            <Pagination className="justify-content-center mt-3">
                                {[...Array(Math.ceil(data.length / transactionsPerPage)).keys()].map((page) => (
                                    <PaginationItem key={page} active={page + 1 === currentPage}>
                                        <PaginationLink onClick={() => paginate(page + 1)}>
                                            {page + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                            </Pagination>
                        </>
                    ) : (
                        !loading && !error && <Alert color="warning">{t('No transactions found.')}</Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionTable;