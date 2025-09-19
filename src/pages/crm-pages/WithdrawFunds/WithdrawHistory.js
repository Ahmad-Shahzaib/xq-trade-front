import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table, Spinner, Modal, ModalBody, ModalFooter } from 'reactstrap';
import { withdrawalList } from '../../../rtk/slices/crm-slices/withdraw/withdrawalListSlice';
import { token } from '../../../utils/config';
import { updateWithdrawalSummary } from '../../../rtk/slices/crm-slices/myPortfolio/myPortfolio';
import { getUser } from '../../../rtk/slices/crm-slices/user/getUserSlice';
import InvoiceDetails from '../Invoice/InvoiceDetails';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

const WithdrawHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { withdrawalList: withdrawalHistory, status } = useSelector((state) => state.withdrawalList);
    const { user } = useSelector(state => state.user);  // Access user data from Redux state


    const [modal, setModal] = useState(false);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

    const handleWithdrawNow = () => {
        navigate('/withdraw-funds');
    };

    useEffect(() => {
        if (token) {
            dispatch(withdrawalList(token));
            dispatch(getUser(token));
        }
    }, [dispatch, token]);


    const toggleModal = () => setModal(!modal);

    // Handle icon click to set selected deposit and open modal
    const handleIconClick = (item) => {
        setSelectedWithdrawal(item);
        toggleModal();
    };
    return (
        <div className="page-content"
        style={{
            backgroundImage: `url(${trading})`,
            backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
            borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
            height: "89vh"
        }}>
            <BackButton />
            <Container fluid>
                <Card className='bg-transparent'>
                    <CardHeader className='bg-transparent'>
                        <Row className="g-0 flex-nowrap align-items-center">
                            <Col xs={6}>
                                <h3 className="mb-0 fs-5">{t('Withdraw History')}</h3>
                            </Col>
                            <Col xs={6} className='mb-0 d-flex justify-content-end'>
                                <Button className='text-uppercase ' style={{
                                      background: "linear-gradient(90deg, #c41a6b, #390452)",
                                    border: "none",
                                    borderRadius: 10,
                                    padding: "12px 28px",
                                    fontWeight: 600,
                                    fontSize: 18,
                                    boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                                    color: "#fff"
                                }} onClick={handleWithdrawNow}>
                                    {t('Withdraw Now')}
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="d-none d-md-block">
                        <Table responsive className='text-center'>
                            <thead>
                                <tr className='opd-tr'>
                                <th>{t('TRX')}</th>
                                    <th>{t('Date')}</th>
                                    <th>{t('Amount')}</th>
                                    <th>{t('Currency')}</th>
                                    <th>{t('Charge')}</th>
                                    <th>{t('Rate')}</th>
                                    <th>{t('Final Amount')}</th>
                                    <th>{t('Status')}</th>
                                    <th>{t('Invoice')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {status === 'loading' ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <Spinner size="sm" color="primary" /> {t('Loading')}...
                                        </td>
                                    </tr>
                                ) : status === 'succeeded' && withdrawalHistory?.data?.length > 0 ? (
                                    withdrawalHistory.data.map((item, index) => (
                                        <tr key={item.id} className='opd-tr'>
                                            <td>{item.trx}</td>
                                            <td>
                                                {new Date(item.created_at).toLocaleDateString('en-US', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                                <span className='fw-bold mb-0'>{' '}||{' '}</span>
                                                {new Date(item.created_at).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: false, // Use 24-hour format
                                                })}
                                            </td>

                                            <td>{Number(item.amount)}</td>
                                            <td>{item.currency}</td>
                                            <td>{Number(item.charge)}</td>
                                            <td>{Number(item.rate)}</td>
                                            <td>{Number(item.final_amount)}</td>
                                            <td
                                                className={
                                                    item.status === 2
                                                        ? "text-warning"
                                                        : item.status === 1
                                                            ? "text-success"
                                                            : item.status === 3
                                                                ? "text-danger"
                                                                : ""
                                                }
                                            >
                                                {item.status === 2
                                                    ? "Pending"
                                                    : item.status === 1
                                                        ? "Completed"
                                                        : item.status === 3
                                                            ? "Rejected"
                                                            : ""}
                                            </td>
                                            <td>
                                                <i onClick={() => handleIconClick(item)} className="ri-file-list-line text-primary cursor-pointer fs-4"></i>
                                            </td>
                                        </tr>
                                    ))
                                ) : status === 'succeeded' && !withdrawalHistory?.data?.length ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {t('No data found')}
                                        </td>
                                    </tr>
                                ) : status === 'failed' ? (
                                    <tr>
                                        <td colSpan="8" className="text-center text-danger">
                                            {t('Failed to fetch data')}
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </Table>
                    </CardBody>

                    <div className="d-block d-md-none mt-1">
                        {status === 'loading' ? (
                            <p className="text-center">
                                <Spinner size="sm" color="primary" /> {t('Loading')}...
                            </p>
                        ) : status === 'succeeded' && withdrawalHistory?.data?.length > 0 ? (
                            withdrawalHistory.data.map((item, index) => (
                                <Card className="h-100 shadow-sm">
                                    <CardBody>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <p className="text-muted small mb-1">{t('Transaction ID')}</p>
                                                <p className="fw-medium mb-0">#{item.trx}</p>
                                            </div>
                                            <span className={
                                                item.status === 2
                                                    ? "text-warning"
                                                    : item.status === 1
                                                        ? "text-success"
                                                        : item.status === 3
                                                            ? "text-danger"
                                                            : ""
                                            }>
                                                {item.status === 2
                                                    ? "Pending"
                                                    : item.status === 1
                                                        ? "Completed"
                                                        : item.status === 3
                                                            ? "Rejected"
                                                            : ""}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <div className="d-flex align-items-center text-muted mb-2">
                                                <i className="ri-time-line me-2"></i>
                                                <small>
                                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="border-top pt-3 mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">{t('Amount')}</span>
                                                <span className="fw-medium">
                                                    {Number(item.amount).toFixed(3)} {item.method_currency}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">{t('Charge')}</span>
                                                <span className="text-danger">
                                                    {Number(item.charge).toFixed(3)} 
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-muted">{t('Final Amount')}</span>
                                                <span className="fw-bold text-success">
                                                {Number(item.final_amount)} {item.currency}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            color="light"
                                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                                            onClick={() => handleIconClick(item)}
                                        >
                                            <i className="ri-file-list-line"></i>
                                            {t('View Details')}
                                        </Button>
                                    </CardBody>
                                </Card>
                            ))
                        ) : status === 'succeeded' && !withdrawalHistory?.data?.length ? (

                            <p colSpan="8" className="text-center">
                                {t('No data found')}
                            </p>

                        ) : status === 'failed' ? (

                            <p colSpan="8" className="text-center text-danger">
                                {t('Failed to fetch data')}
                            </p>

                        ) : null}
                    </div>

                </Card>
                <Modal isOpen={modal} toggle={toggleModal} >
                    <ModalBody>
                        <InvoiceDetails type="Withdrawal" user={user} selectedRecord={selectedWithdrawal} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>Close</Button>
                    </ModalFooter>
                </Modal>
            </Container>
        </div>
    );
};

export default WithdrawHistory;
