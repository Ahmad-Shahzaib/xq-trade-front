import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Spinner, Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { setSelectedAccount, toggleModal, setTradeAccounts } from '../rtk/slices/accountTypeSlice/accountTypeSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RenameAccountModal from '../pages/DashboardCrypto/MarketGraph/RenameAccountModal';

const AccountTypeModel = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isModalOpen, selectedAccount, tradeAccounts } = useSelector((state) => state.accountType);
    const { tradeAccount, status } = useSelector((state) => state.tradeAccountsList) || {};
    const appSettings = JSON.parse(localStorage.getItem('appSettings')) || {};
    const isHiddenBalance = appSettings.hiddenBalances ?? false;

    let tradeAccoutsArray = []
    const tradeAccountsData = tradeAccount?.data || [];

    const loginTradeAcconts = useSelector((state) => state.auth.tradeAccounts)

    tradeAccoutsArray = tradeAccountsData?.length > 0 ? tradeAccountsData : loginTradeAcconts;
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [isRenameModalOpen, setRenameModalOpen] = useState(false);
    const [selectedRenameAccount, setSelectedRenameAccount] = useState(null);

    const toggleDropdown = (accountId) => {
        setDropdownOpen(dropdownOpen === accountId ? null : accountId);
    };

    const isMobile = window.innerWidth <= 768;

    // Helper function to check if account is demo
    const isDemoAccount = (account) => {
        return account?.name?.toLowerCase().includes('demo') || 
               account?.type?.toLowerCase() === 'demo' ||
               account?.account_type?.toLowerCase() === 'demo';
    };

    useEffect(() => {
        const storedAccount = localStorage.getItem("selectedAccount");
        if (storedAccount) {
            dispatch(setSelectedAccount(JSON.parse(storedAccount)));
        }
    }, [dispatch]);

    // Fetch trade accounts and store them in Redux
    useEffect(() => {
        if (tradeAccoutsArray?.length > 0) {
            dispatch(setTradeAccounts(tradeAccoutsArray));

            // If no selected account is found in localStorage, set the first account by default
            const storedAccount = localStorage.getItem("selectedAccount");
            if (!storedAccount) {
                dispatch(setSelectedAccount(tradeAccoutsArray[0]));
                localStorage.setItem("selectedAccount", JSON.stringify(tradeAccoutsArray[0]));
            }
        }
    }, [tradeAccoutsArray, dispatch]);

    const handleAccountSelect = (account) => {
        dispatch(setSelectedAccount(account));
        localStorage.setItem("selectedAccount", JSON.stringify(account)); // Store in localStorage
        // dispatch(toggleModal());
    };

    useEffect(() => {
        if (selectedAccount) {
            localStorage.setItem("selectedAccount", JSON.stringify(selectedAccount));
        }
    }, [selectedAccount]);

    return (
        <>
            <Modal isOpen={isModalOpen} toggle={() => dispatch(toggleModal())}
                className="modal-accountType-center"
                style={{
                    background: 'transparent',
                    backdropFilter: 'blur(18px)',
                    border: "1px solid rgb(92 6 47)",
                    borderRadius: "8px",
                    position: 'relative',
                    top: isMobile ? '43%' : "80%",
                    left: 0,
                    right: 0,
                    margin: '0 auto',
                    zIndex: 1050,
                    width: '100%',
                    maxWidth: '500px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
                    transform: 'translateY(-50%)'
                }}>

                <ModalHeader className="text-center" style={{
                    // background: 'linear-gradient(rgb(31, 14, 39))',
                    textAlign: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',

                }}>{t('Accounts')}
                {/* cross icons */}
                <i className="ri-close-line" style={{
                    position: 'absolute',
                    top: '10px',    
                    right: '10px',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '1.5rem',
                }} onClick={() => dispatch(toggleModal())}></i>
                </ModalHeader>
                <ModalBody style={{
                    background: 'transparent',

                }} >
                    <ListGroup>
                        {status === 'loading' ? (
                            <ListGroupItem className="text-center">
                                <Spinner size="sm" color="primary" /> {t('Loading')}...
                            </ListGroupItem>
                        ) : tradeAccounts?.length > 0 ? (
                            tradeAccounts.map((account, idx) => (
                                <ListGroupItem
                                    style={{
                                        borderColor: selectedAccount?.id === account.id ? '#110D1A' : '#110D1A',
                                        backgroundColor: selectedAccount?.id === account.id ? 'transparent' : 'transparent',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '8px',
                                        borderWidth: '1px',
                                        marginBottom: '16px', // Add space between accounts
                                        marginTop: idx === 0 ? '8px' : undefined, // Optional: add top margin for first item
                                    }}
                                    className="listitemlist"
                                    key={account.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAccountSelect(account)
                                    }}
                                    // onClick={() => handleAccountSelect(account)}
                                    action
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div >
                                            <span>{account.name}</span>
                                            <br />
                                            {!isHiddenBalance ? (
                                                <span>{account.trade_group_detail?.name} - {Number(account.balance).toFixed(2) ?? "0"}</span>
                                            ) : (
                                                <span>****</span> // Hide balance when hiddenBalances is active
                                            )}

                                        </div>
                                        {/* Hide dropdown for demo accounts */}
                                        {!isDemoAccount(account) && (
                                            <Dropdown isOpen={dropdownOpen === account.id} toggle={() => toggleDropdown(account.id)}>
                                                <DropdownToggle
                                                    tag="i"
                                                    className="ri-more-2-fill fs-4"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => e.stopPropagation()} // Prevent event bubbling
                                                ></DropdownToggle>
                                                <DropdownMenu dark end>
                                                    <DropdownItem onClick={() => {
                                                        navigate('/deposit')
                                                        dispatch(toggleModal())
                                                    }}>
                                                        <i className="ri-upload-fill me-2" ></i>{t('Deposit')}
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => {
                                                        navigate('/withdraw-funds')
                                                        dispatch(toggleModal())
                                                    }}>
                                                        {t('WITHDRAW')}
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        )}
                                    </div>

                                    {/* Hide buttons for demo accounts */}
                                    {selectedAccount?.id === account.id && !isDemoAccount(account) && (
                                        <Row className='mt-2'>
                                            <Col xs={6}>
                                                <Button block style={{
                                                    background: 'transparent', // Purple gradient for DEPOSIT
                                                    backdropFilter: 'blur(10px)',
                                                    color: '#fff',
                                                    fontWeight: 300,
                                                    fontSize: 16,
                                                    borderRadius: 14,
                                                    border: '1px solid #f81effff',
                                                    padding: '14px 55px',
                                                    
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                    transition: 'all 0.2s',
                                                }} onClick={() => {
                                                    navigate('/withdraw-funds')
                                                    dispatch(toggleModal())
                                                }}>
                                                    {t('Withdraw')}
                                                </Button>
                                            </Col>
                                            <Col xs={6} onClick={() => {
                                                navigate('/deposit')
                                                dispatch(toggleModal())
                                            }}>
                                                <Button block style={{
                                                    background: 'linear-gradient(90deg, #FF00CC 0%, #1a043eff 100%)', // Purple gradient for DEPOSIT
                                                    color: '#fff',
                                                    fontWeight: 300,
                                                    fontSize: 16,
                                                    borderRadius: 14,

                                                    padding: '14px 55px',
                                                    border: 'none',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                    transition: 'all 0.2s',
                                                }}>
                                                    {t('Deposit')}
                                                </Button>
                                            </Col>
                                        </Row>
                                    )}
                                </ListGroupItem>
                            ))
                        ) : (
                            <ListGroupItem className="text-center">{t('No Trade Accounts Available')}</ListGroupItem>
                        )}

                        <ListGroupItem className="text-start items-center mt-2 bg-transparent" style={{ border: "none", borderRadius: "0px", 
                              background: 'linear-gradient(90deg, #FF00CC 0%, #1a043eff 100%)',
                        }} onClick={() => {
                            dispatch(toggleModal());
                            navigate('/new-trading-account')
                        }}>
                            <Link to="/new-trading-account" style={{ color: 'white',
                            fontSize:'20px',
                            textAlign:'center',
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center'
                             }}>
                                <span className='me-2 ' style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}>+</span>{t('Add Account')}
                            </Link>
                        </ListGroupItem>
                    </ListGroup>
                </ModalBody>

            </Modal>
            {selectedRenameAccount && (
                <RenameAccountModal
                    isOpen={isRenameModalOpen}
                    toggle={() => setRenameModalOpen(false)}
                    account={selectedRenameAccount}
                    tradeAccounts={tradeAccounts}
                />
            )}

        </>
    );
};

export default AccountTypeModel;

const styles = {
    actionButton: {
        // background: "rgba(242, 242, 242, 0.08)",
        backgroundColor: '#1e90ff',
        color: "#fff",
        fontSize: "16px",
        padding: "12px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        border: "none",
    },
    depositButton: {
        // background: "linear-gradient(90deg, rgba(1, 254, 239, 1) 0%, rgba(45, 254, 77, 1) 100%)",
        backgroundColor: '#1e90ff',
        color: "#000",
        fontSize: "16px",
        padding: "12px",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px",
        border: "none",
    },
}