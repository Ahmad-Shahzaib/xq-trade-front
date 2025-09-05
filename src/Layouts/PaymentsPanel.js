import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { useTranslation } from 'react-i18next';
import { setSelectedAccount, toggleModal } from "../rtk/slices/accountTypeSlice/accountTypeSlice";
import { useSelector, useDispatch } from "react-redux";

const PaymentsPanel = ({ isOpen, toggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;
  const dispatch = useDispatch();
  const { selectedAccount } = useSelector((state) => state.accountType);

  const isDemoAccount = (account) => {
    return account?.name?.toLowerCase().includes('demo') ||
      account?.type?.toLowerCase() === 'demo' ||
      account?.account_type?.toLowerCase() === 'demo';
  };

  const isCurrentAccountDemo = isDemoAccount(selectedAccount);

  const dynamicStyles = {
    panel: {
      ...styles.panel,
      width: isMobile ? "80%" : "90%",
    },
    depositButton: {
      ...styles.depositButton,
      width: isMobile ? "90%" : "85%",
      padding: isMobile ? '10px' : '12px',
      fontSize: isMobile ? 16 : 20,
    },
    actionButton: {
      ...styles.actionButton,
      width: isMobile ? "90%" : "85%",
      padding: isMobile ? '10px' : '12px',
      fontSize: isMobile ? 16 : 20,
    }
  };

  return (
    isOpen && (
      <div style={styles.overlay} onClick={toggle}>
        <div
          className="profileSidebar"
          style={{
            ...dynamicStyles.panel,
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            overflow: 'auto'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', position: 'relative' }}>
            <button
              style={{
                ...styles.closeBtn,
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 1000
              }}
              onClick={toggle}
            >
              ✕
            </button>
          </div>

          {/* Payment Buttons */}
          <div style={styles.buttonGroup}>
            {!isCurrentAccountDemo && (
              <Button style={dynamicStyles.depositButton} onClick={() => {
                navigate('/deposit')
                toggle()
              }}>
                <i className="ri-wallet-fill text-white" style={styles.icon}></i> {t('Deposit')}
              </Button>
            )}

            {
              isCurrentAccountDemo && (
                <Button style={dynamicStyles.actionButton} onClick={() => {
                  navigate('/new-trading-account')
                  toggle()
                }}>
                  <i className="ri-exchange-dollar-line" style={styles.icon}></i> {t('Open live account')}
                </Button>
              )
            }


            {!isCurrentAccountDemo && (
              <Button style={dynamicStyles.actionButton} onClick={() => {
                navigate('/withdraw-funds')
                toggle()
              }}>
                <i className="ri-upload-2-line" style={styles.icon}></i> {t('Withdraw')}
              </Button>
            )}
            {!isCurrentAccountDemo && (
              <Button style={dynamicStyles.actionButton} onClick={() => {
                navigate('/internal-transfer/create')
                toggle()
              }}>
                <i className="ri-arrow-left-right-line" style={styles.icon}></i> {t('Transfer')}
              </Button>
            )}
            <Button style={dynamicStyles.actionButton} onClick={() => {
              navigate('/transactions')
              toggle()
            }}>
              <i className="ri-time-line" style={styles.icon}></i> {t('Transactions')}
            </Button>
            {/* <Button style={dynamicStyles.actionButton} onClick={() => {
              navigate('/wallets')
              toggle()
            }}>
              <i className="ri-hand-coin-fill" style={styles.icon}></i> {t('Affiliate Comission')}
            </Button> */}
            {
              !isCurrentAccountDemo && (
                <Button style={dynamicStyles.actionButton}
                  onClick={() => {
                    dispatch(toggleModal())
                    toggle()
                  }}
                >
                  {/* switch icon  */}
                  <i className="ri-shuffle-line" style={styles.icon}></i>
                  {t('Switch Account')}
                </Button>
              )
            }

          </div>
        </div>
      </div>
    )
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.25)',
    zIndex: 99998,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  panel: {
    position: "fixed",
    top: "70px",
    right: "0",
    background: "transparent",
    backdropFilter: "blur(20px)",
    padding: "20px",
    transition: "transform 0.3s ease-in-out",
    zIndex: 99999,
    boxShadow: "4px 0px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: "20px",
    scrollbarWidth: "none",
    border: "1px solid #110d1a"
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  buttonGroup: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  depositButton: {
    background: 'linear-gradient(90deg, #c800a1 0%, #390452 100%)',
    border: 'none',
    borderRadius: 30,
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 0 30px #c800a155',
    padding: '12px',
    fontSize: 20,
    letterSpacing: 1,
  },
  actionButton: {
    background: 'linear-gradient(90deg, #c800a1 0%, #390452 100%)',
    border: 'none',
    borderRadius: 30,
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 0 30px #c800a155',
    padding: '12px',
    fontSize: 20,
    letterSpacing: 1,
  },
  icon: {
    fontSize: "20px",
    marginRight: "8px"
  },
};

export default PaymentsPanel;
