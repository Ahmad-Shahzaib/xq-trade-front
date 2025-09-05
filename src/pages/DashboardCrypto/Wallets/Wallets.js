import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
    Container,
    Spinner,
    Alert,
    Row,
    Col,
    Card,
    CardBody,
    Button, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import CountUp from 'react-countup';
import { fetchWalletList } from '../../../rtk/slices/walletListSlice/walletListSlice';
import { applyForIB, clearMessage, fetchIBStatus } from '../../../rtk/slices/IBComission/GetIBSlice';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

const Wallets = () => {
    const dispatch = useDispatch();
    const { walletList, loading, error } = useSelector((state) => state.walletList);
    const { ibData, user, link, status, isLoading, isError, successMessage } = useSelector((state) => state.IB);
    const [copyAlert, setCopyAlert] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(fetchWalletList({ token }));
            dispatch(fetchIBStatus());
        }
    }, [dispatch]);

    useEffect(() => {
        let topbar = document.getElementById('page-topbar');
        if (topbar) topbar.style.marginTop = "0px";
    }, []);

    const getCurrencyIcon = (currency) => {
        switch (currency.toLowerCase()) {
            case 'usd':
                return <i className="ri-money-dollar-circle-line ri-xl"></i>;
            case 'btc':
                return <i className="ri-bit-coin-line ri-xl"></i>;
            default:
                return <i className="ri-money-dollar-circle-line ri-xl"></i>;
        }
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <Spinner color="white" size="lg" />
                <p className="mt-3 text-white">{t('Loading your wallets')}...</p>
            </div>
        );
    }

    // Function to copy user code
    const handleCopy = () => {
        navigator.clipboard.writeText(user);
        setCopyAlert(true);
        setTimeout(() => setCopyAlert(false), 2000); // Hide after 3 seconds
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(link);
        setCopyAlert(true);
        setTimeout(() => setCopyAlert(false), 2000); // Hide after 3 seconds
    };

    const handleApplyIB = () => {
        setModalOpen(true); // Open confirmation modal
    };

    const confirmApplyIB = () => {
        dispatch(applyForIB());
        setModalOpen(false);
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

                <div className="d-flex justify-content-between align-items-center justify-content-between">
                    {/* Left Side: Show User ID if status is 1 */}
                    {status === 1 ? (
                        <>
                            <div className="d-flex align-items-center mb-2">
                                <span>Reff ID &nbsp;</span>
                                <span className="me-2" style={{ color: "rgb(105, 255, 65)" }}>{user}</span>
                                <i class="ri-file-copy-line cursor-pointer" onClick={handleCopy} ></i>
                            </div>
                            <div>
                                <h4 className='text-warning'>{t('Pending')}</h4>
                            </div>
                        </>
                    ) : status === 2 ? (
                        <>
                            <div className="d-flex align-items-center mb-2">
                                <span>Reff ID &nbsp;</span>
                                <span className="me-2" style={{ color: "rgb(105, 255, 65)" }}>{user}</span>
                                <i class="ri-file-copy-line cursor-pointer" onClick={handleCopy} ></i>
                            </div>
                            <div>
                                <h4 className='text-success'>{t('Approved')}</h4>
                            </div>


                        </>
                    ) : status === 3 ? (
                        <>
                            <div className="d-flex align-items-center mb-2">
                                {/* <span>ID</span>
                                <span className="me-2" style={{ color: "rgb(105, 255, 65)" }}>{user}</span>
                                <i class="ri-file-copy-line cursor-pointer" onClick={handleCopy} ></i> */}
                            </div>
                            <div>
                                <h4 className='text-danger'>{t('Rejected')}</h4>
                            </div>
                        </>
                    ) : (
                        <div></div> // Empty div to maintain spacing
                    )}

                    {/* Right Side: Show Apply Button if status is not 1 */}
                    {!status && (
                        <div className="d-flex justify-content-end align-items-center">
                            {isLoading ? (
                                <Spinner color="white" size="sm" />
                            ) : (
                                <Button className="depositButtonLite mb-2"
                                    style={{
                                        background: 'linear-gradient(90deg, #c41a6b, #390452)',
                                        color: 'white',
                                        fontSize: '13px',
                                    }}
                                    onClick={handleApplyIB}>{t('Apply for IB')}</Button>
                            )}
                        </div>
                    )}
                </div>
                <div className="d-flex align-items-center mb-2">
                    <span>{t("Reff Link")}&nbsp;</span>
                    <span className="me-2" style={{ color: "rgb(105, 255, 65)", fontSize: '11px' }}>{link ?? ""}</span>
                    <i class="ri-file-copy-line cursor-pointer" onClick={handleCopyLink} ></i>
                </div>
                <div className="page-header mb-4 p-4 text-center" style={{
                    background: "transparent",
                }}>
                    <i className="ri-wallet-3-line ri-3x mb-3 text-white"></i>
                    <h2 className="text-white mb-2">{t('Your Wallet List')}</h2>
                    {/* <p className="text-white mb-0">Manage and track your digital assets</p> */}
                    {
                        !loading && walletList.length === 0 ? (
                            <>
                                <p className="text-white mb-0">{t('No wallets found.')} {t('Add a wallet to get started.')}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-white mb-0">{t('Manage and track your digital assets')}</p>
                            </>
                        )
                    }
                </div>

                {error && (
                    <Alert color="danger" className="d-flex align-items-center">
                        <i className="ri-error-warning-line ri-lg me-2"></i>
                        {error}
                    </Alert>
                )}

                {!loading && walletList.length === 0 && (
                    // <Alert color="warning" className="d-flex align-items-center">
                    //     <i className="ri-information-line ri-lg me-2"></i>
                    //     No wallets found. Add a wallet to get started.
                    // </Alert>
                    <></>
                )}

                {!loading && walletList.length > 0 && (
                    <Row>
                        {walletList.map((wallet) => (
                            <Col lg={4} md={6} sm={12} key={wallet.id} className="mb-4">
                                <Card className="wallet-card h-100">
                                    <CardBody>
                                        <div className="currency-icon mb-3">
                                            {getCurrencyIcon(wallet.currency)}
                                        </div>

                                        <h4 className="text-white mb-3">
                                            {wallet.currency} {t('Wallet')}
                                        </h4>
                                        <div className="d-flex justify-content-between">
                                            <div className="mb-3">
                                                <p className="text-muted mb-1">{t('Current Balance')}</p>
                                                <div className="balance-text">
                                                    $<CountUp end={parseFloat(wallet.balance)} decimals={2} duration={2} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-1">{t('Total Balance')}</p>
                                                <div className="d-flex align-items-center">
                                                    <div className="balance-text">
                                                        $<CountUp end={parseFloat(wallet.total_balance)} decimals={2} duration={2} />
                                                    </div>
                                                    {/* <i className="ri-arrow-up-line ri-lg ms-2 text-success"></i> */}
                                                </div>
                                            </div>
                                        </div>




                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                <Modal

                    className='backdropeffect'
                    style={{
                        background: 'linear-gradient(rgb(31, 14, 39))',
                        backdropFilter: 'blur(18px)',
                        border: "1px solid rgb(92 6 47)",
                        borderRadius: "8px",
                        position: 'relative',
                        top: '17%',
                        left: 0,
                        right: 0,
                        margin: '0 auto',
                        zIndex: 1050,
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                        transform: 'translateY(-50%)'
                    }}
                    isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                    <ModalHeader className='backdropeffect' toggle={() => setModalOpen(!modalOpen)}>{t('Confirm IB Application')}</ModalHeader>
                    <ModalBody className='backdropeffect'>{t('Are you sure you want to apply for IB?')}</ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={confirmApplyIB}>{t('Yes')}</Button>
                        <Button color="secondary" onClick={() => setModalOpen(false)}>{t('No')}</Button>
                    </ModalFooter>
                </Modal>

                {copyAlert && (
                    <Alert className="position-fixed end-0 m-3" fade style={{ top: "50px", backgroundColor: "darkgreen", color: "white" }}>
                        {t('Copied to clipboard!')}
                    </Alert>
                )}

                {/* Success Alert for IB Application */}
                {successMessage && <Alert color="success" toggle={() => dispatch(clearMessage())}>{successMessage}</Alert>}
            </Container>
        </div >
    );
};

export default Wallets;