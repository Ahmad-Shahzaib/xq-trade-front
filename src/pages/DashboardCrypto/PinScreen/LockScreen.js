import React, { useState } from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import { PinPad } from './PinPad';
import { useDispatch, useSelector } from 'react-redux';
import { unlockApp } from '../../../rtk/slices/pinLockSlice/pinLockSlice';
import { useTranslation } from 'react-i18next';

export function LockScreen() {
  const dispatch = useDispatch();
  const storedPin = useSelector((state) => state.pinLock.pin);
  const [error, setError] = useState('');

   const { t } = useTranslation();

  const handlePinSubmit = (pin) => {
    if (pin === storedPin) {
      dispatch(unlockApp());
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <CardBody className="text-center">
        <i className="ri-shield-line" style={{fontSize:'65px'}}></i>
          <h1 className="mb-3">{t('Enter PIN')}</h1>
          <p className="text-muted">{t('Please enter your PIN to unlock the app')}</p>
          <PinPad onPinSubmit={handlePinSubmit} error={error} />
        </CardBody>
      </Card>
    </Container>
  );
}
