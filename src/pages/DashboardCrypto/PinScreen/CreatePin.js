import React, { useState } from 'react';
import { Button, Card, CardBody, Container, FormGroup, Input, Alert } from 'reactstrap';
import { PinPad } from './PinPad';
import { useDispatch, useSelector } from 'react-redux';
import { lockApp, setPin, toggleLock } from '../../../rtk/slices/pinLockSlice/pinLockSlice';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

export function CreatePin() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isLockEnabled } = useSelector((state) => state.pinLock);
  const [showPinSetup, setShowPinSetup] = useState(false);

  // Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const handlePinSubmit = (newPin) => {
    const isUpdating = isLockEnabled;

    dispatch(setPin(newPin));
    setShowPinSetup(false);

    const message = isUpdating ? t('PIN updated successfully') : t('PIN created successfully');
    setAlertMessage(message);
    setAlertVisible(true);

    // Delay locking (or enabling lock) so alert can show first
    setTimeout(() => {
      setAlertVisible(false);

      if (isUpdating) {
        dispatch(lockApp()); // Force lock again
      } else {
        dispatch(toggleLock(true)); // First-time setup
      }
    }, 1500); // Delay must match Alert's display duration
  };



  return (
    <div className="page-content "
      style={{
        backgroundImage: `url(${trading})`,
        backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
        borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
        height: "89vh"
      }}>
      {alertVisible && (
        <Alert
          color="success"
          fade={true}
          className="position-fixed top-1 end-0 translate-middle-x mt-3 w-25"
          toggle={() => setAlertVisible(false)}
        >
          {alertMessage}
        </Alert>
      )}
      <BackButton />
      <Container className="mt-4 pt-5" style={{ maxWidth: '400px' }}>

        <h1 className="text-center mb-4 mt-4 " >{t('App Lock')}</h1>

        <Card className="mb-4">
          <CardBody>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{
                padding: '12px 16px',
                border: '2px solid #cf168b',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(2px)',
              }}
            >
              <div
                className="d-flex align-items-center"
                style={{
                  background: "linear-gradient(90deg, #c41a6b, #390452)",
                  border: "none",
                  color: 'white',
                  borderRadius: 10,
                  padding: "12px 28px",
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",

                }}
              >
                <div
                  style={{

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    boxShadow: '0 2px 6px rgba(60, 4, 82, 0.2)',
                  }}
                >
                  {isLockEnabled ? (
                    <i className="ri-lock-fill" style={{ fontSize: '24px', color: '#3c0452' }}></i>
                  ) : (
                    <i className="ri-lock-unlock-fill" style={{ fontSize: '24px', color: '#888' }}></i>
                  )}
                </div>

                <span
                  className="fw-medium"
                  style={{ fontSize: '16px', color: 'white' }}
                >
                  {t('App Lock')}
                </span>
              </div>

              <FormGroup switch style={{ marginBottom: 0 }}>
                <Input
                  type="switch"
                  checked={isLockEnabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setShowPinSetup(true);
                    } else {
                      dispatch(toggleLock(false));
                    }
                  }}
                  style={{
                    transform: 'scale(1.2)',
                    cursor: 'pointer',
                  }}
                />
              </FormGroup>
            </div>

          </CardBody>
        </Card>

        {showPinSetup && (
          <div className="text-center mt-4" style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(20px)',
            border: '2px solid #cf168b',

            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '16px',
            padding: '5px',
            width: 'fit-content',
            margin: '0 auto',
            height: 'fit-content',
          }}>
            <h2 className="mb-3">{t('Set Your PIN')}</h2>
            <PinPad onPinSubmit={handlePinSubmit} />
          </div>
        )}

        {isLockEnabled && !showPinSetup && (
          <div className="mt-4">
            <Button color=""
              style={{
                background: "linear-gradient(90deg, #c41a6b, #390452)",
                border: "none",
                borderRadius: 10,
                padding: "12px 28px",
                fontWeight: 600,
                fontSize: 18,
                boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                color: "#fff"

              }}
              block onClick={() => setShowPinSetup(true)}>
              {t('Change PIN')}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
