import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap';
import { depositList } from '../../../rtk/slices/crm-slices/deposite/depositeListSlice';
import { token } from '../../../utils/config';
import { updateDepositSummary } from '../../../rtk/slices/crm-slices/myPortfolio/myPortfolio';
import { getUser } from '../../../rtk/slices/crm-slices/user/getUserSlice';
import InvoiceDetails from '../Invoice/InvoiceDetails';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

const DepositeHistory = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const depositeHistory = useSelector((state) => state.depositList.depositList); // Access data property if it's wrapped in `data`
    const { user } = useSelector(state => state.user);  // Access user data from Redux state

    const [modal, setModal] = useState(false);
    const [selectedDeposit, setSelectedDeposit] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            dispatch(depositList(storedToken));
            dispatch(getUser(storedToken));
        }
    }, [dispatch, token]);

    const navigate = useNavigate();
    const handleDepositeNow = () => {
        navigate('/deposit');
    };


    const toggleModal = () => setModal(!modal);

    const handleIconClick = (item) => {
        setSelectedDeposit(item);
        toggleModal();
    };

    return (
        <div className="page-content" style={{
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
                                <h3 className="mb-0 fs-5">{t('Deposit History')}</h3>
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
                                }}
                                    onClick={handleDepositeNow}>
                                    {t('Deposit Now')}
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="d-none d-md-block">
                        <Table responsive className='text-center'>
                            <thead>
                                <tr>
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
                                {depositeHistory && depositeHistory.length > 0 ? (
                                    depositeHistory
                                        .filter((item) => item.status !== 0)
                                        .map((item) => (
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

                                                <td>{Number(item.amount).toFixed(3)}</td>
                                                <td>{item.method_currency}</td>
                                                <td>{Number(item.charge).toFixed(3)}</td>
                                                <td>{Number(item.rate).toFixed(3)}</td>
                                                <td>{Number(item.final_amo).toFixed(3)}</td>
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
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            {t('No Deposit History Available')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </CardBody>

                    <div className="d-block d-md-none mt-1">
                        {depositeHistory && depositeHistory.length > 0 ? (
                            depositeHistory
                                .filter((item) => item.status !== 0)
                                .map((item) => (
                                    <Card className="h-100 shadow-sm">
                                        <CardBody>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <p className="text-muted small mb-1">{t('Transaction ID')}</p>
                                                    <p className="fw-medium mb-0">{item.trx}</p>
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
                                                        {Number(item.charge).toFixed(3)} {item.method_currency}
                                                    </span>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-muted">{t('Final Amount')}</span>
                                                    <span className="fw-bold text-success">
                                                        {Number(item.final_amo).toFixed(3)} {item.method_currency}
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
                        ) : (
                            <p className="text-center">{t('No Deposit History Available')}</p>
                        )}
                    </div>
                </Card>
                <Modal isOpen={modal} toggle={toggleModal} className='invoice-modal' >
                    <ModalBody>
                        <InvoiceDetails type="Deposit" user={user} selectedRecord={selectedDeposit} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>{t('Close')}</Button>
                    </ModalFooter>
                </Modal>
            </Container>


        </div>
    );
};

export default DepositeHistory;
