import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { fetchOpenPositions } from '../../rtk/slices/openPositionsSlice/openPositionsSlice';

const SuccessMessage = () => {
    const [isVisible, setIsVisible] = useState(true);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = JSON.parse(localStorage.getItem('user'));
    const account = user ? user.account : null;

    const hideMessage = () => {
        if (account) {
            dispatch(fetchOpenPositions(account));
        }
        setTimeout(() => {
            setIsVisible(false);
        }, 1000);
        setTimeout(() => {
            navigate('/trade?tab=3')
        }, 1500);
    }

    useEffect(() => {
        hideMessage()
    })

    return (
        isVisible && (
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
                className='p-2'
            >
                <div
                    style={{
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        maxWidth: '400px',
                        width: '100%',
                    }}
                    className='card'
                >
                    <i className="ri-check-fill mb-3" style={{ fontSize: '50px', color: 'green' }}></i>
                    <h5 className="mb-2">Trade Placed Successfully!</h5>
                    <p className="text-muted">Your order has been placed. You can check your open positions for details.</p>
                    {/* <Button color="primary" onClick={hideMessage} className="w-100">
                        Close
                    </Button> */}
                </div>
            </div>
        )
    );
};

export default SuccessMessage;
