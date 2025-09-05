import React, { useState } from 'react'
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { apiKey } from '../../../utils/config';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { placeOrder } from '../../../rtk/slices/orderSlice/orderSlice';
import { useTranslation } from 'react-i18next';
const OneClickTrading = () => {
     const { t } = useTranslation();
    const [volume, setVolume] = useState(0.01);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const account = user ? user.account : null;
    const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData);
    const orderData = useSelector((state) => state.order.orderData);
    const orderError = useSelector((state) => state.order.error);

    const handleInputChange = (e) => {
        const newVolume = e.target.value;

        // Allow clearing the input field
        if (newVolume === "") {
            setVolume("");
            return;
        }

        // Prevent negative values
        const numericValue = parseFloat(newVolume);
        if (!isNaN(numericValue) && numericValue >= 0) {
            setVolume(numericValue);
        }
    };


    const handleOrder = (type) => {
        if (selectedSymbol && volume) {
            const orderPayload = {
                api_key: apiKey, account: account, symbol: selectedSymbol, volume: volume, price: "0", type: type, tp: "0", sl: "0", comment: ""
            };

            dispatch(placeOrder(orderPayload)).then((response) => {
                if (response.meta.requestStatus === 'fulfilled') {
                    // saveVolume(volume);
                } else if (response.meta.requestStatus === 'rejected') {
                    console.error("Order API error:", orderError);
                }
            });
        }
    };
    return (
        <>
            <div className='onclick-trading-wrapper'>
                <InputGroup style={{ width: "200px", textAlign: "center" }}>
                    <InputGroupText style={{ padding: 0 }}>
                        <Button
                            color="primary"
                            style={{ borderRadius: "0", width: "100%", border: "none" }}
                            onClick={() => handleOrder('SELL')}
                        >
                            {t('SELL')}
                        </Button>
                    </InputGroupText>
                    <Input
                        type="number"
                        value={volume}
                        onChange={handleInputChange}
                        step="0.01"
                        style={{ textAlign: "center" }}
                    />
                    <InputGroupText style={{ padding: 0 }}>
                        <Button
                            color="secondary"
                            style={{ borderRadius: "0", width: "100%", border: "none" }}
                            onClick={() => handleOrder('BUY')}
                        >
                            {t('BUY')}
                        </Button>
                    </InputGroupText>
                </InputGroup>
            </div>
        </>
    )
}

export default OneClickTrading