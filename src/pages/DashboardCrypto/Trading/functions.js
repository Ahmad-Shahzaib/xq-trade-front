import { placeOrder } from "../../../rtk/slices/orderSlice/orderSlice";
import { placePendingOrder } from "../../../rtk/slices/pendingOrderSlice/pendingOrderSlice";
import { account, apiKey } from "../../../utils/config";

export const saveVolume = (newVolume, setVolume) => {
    localStorage.setItem('tradingVolume', newVolume);
    setVolume(newVolume);
};

export const handleOrder = (type, selectedSymbol, volume, dispatch, orderData, orderError) => {
    if (selectedSymbol && volume) {
        const orderPayload = {
            api_key: apiKey, account: account, symbol: selectedSymbol, volume: volume,
            price: "0", type: type, tp: "0", sl: "0", comment: ""
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

export const hedgeTrade = (position,dispatch,orderData,orderError) => {
    if (position) {
        const reversedType = position.type === "SELL"? "BUY": "SELL"
        const orderPayload = {
            api_key: apiKey, account: account, symbol: position.symbol, volume: position.volume,
            price: "0", type: reversedType, tp: "0", sl: "0", comment: ""
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

export const handleLimitOrder = (type,selectedSymbol,volume,trigger,selectedSymbolAsk,selectedSymbolBid,dispatch,orderData,orderError) => {
    if (selectedSymbol && volume && trigger) {
        const isValidTrigger =
            (type === 3 && parseFloat(trigger) > parseFloat(selectedSymbolAsk)) ||
            (type === 2 && parseFloat(trigger) < parseFloat(selectedSymbolBid));

        if (!isValidTrigger) {
            console.error('Invalid  price!');
            return alert(
                `For a ${type} order, the Price must be ${type === 'SELL' ? 'greater than the current ask price' : 'less than the current bid price'
                }.`
            );
        }
        const orderPayload = {
            api_key: apiKey, account: account, symbol: selectedSymbol, volume: volume, price: "0", type: type,
            tp: "0", sl: "0", comment: "", price_trigger: trigger,
        };

        dispatch(placePendingOrder(orderPayload)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
            } else if (response.meta.requestStatus === 'rejected') {
                console.error("Order API error:", orderError);
            }
        });
    } else {
        console.error("Missing required fields for limit order.");
        alert("Please fill in all required fields.");
    }
};


export const handleStopOrder = (
    type, selectedSymbol, volume, buyAbove, selectedSymbolAsk, selectedSymbolBid, dispatch,
    orderData, orderError
) => {
    if (selectedSymbol && volume && buyAbove) {
        const isValidTrigger =
            (type === 3 && parseFloat(buyAbove) < parseFloat(selectedSymbolAsk)) ||
            (type === 2 && parseFloat(buyAbove) > parseFloat(selectedSymbolBid));

        if (!isValidTrigger) {
            console.error('Invalid trigger price!');
            return alert(
                `For a ${type} order, the trigger price must be ${type === 'SELL' ? 'less than the current ask price' : 'greater than the current bid price'
                }.`
            );
        }

        const orderPayload = {
            api_key: apiKey, account: account, symbol: selectedSymbol, volume: volume, price: "0", type: type,
            tp: "0", sl: "0", comment: "", price_trigger: buyAbove,
        };

        dispatch(placePendingOrder(orderPayload)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
            } else if (response.meta.requestStatus === 'rejected') {
                console.error("Order API error:", orderError);
            }
        });
    } else {
        console.error("Missing required fields for limit order.");
        alert("Please fill in all required fields.");
    }
};