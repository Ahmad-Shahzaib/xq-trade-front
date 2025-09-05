import socket from './socket';
import { setSymbols } from '../rtk/slices/tradingSlice/tradingSlice';
import throttle from 'lodash.throttle';

const socketMiddleware = (store) => {
    return (next) => (action) => {
        if (action.type === 'socket/connect') {
            if (!socket.connected) {
                socket.fetchSymbols();

                socket.connect();

                // Throttle updates to prevent frequent re-renders
                const throttledDispatch = throttle((data) => {
                    if (data && typeof data === 'object') {
                        // console.log(data);
                        const { symbol, bid, ask } = data;
                        if (symbol && (bid !== undefined || ask !== undefined)) {
                            store.dispatch(setSymbols({ symbol, bid, ask }));
                        }
                    }
                }, 1);

                socket.on('new_data', throttledDispatch);
                socket.on('connect', () => console.log('Socket connected'));
                socket.on('disconnect', () => console.log('Socket disconnected'));
                socket.on('error', (error) => {
                    console.error('Socket error:', error);
                    // Optionally dispatch an error action here if needed
                });
            }
        }

        if (action.type === 'socket/disconnect') {
            if (socket.connected) {
                socket.disconnect();
            }
        }

        return next(action);
    };
};

export default socketMiddleware;