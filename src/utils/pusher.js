import Pusher from 'pusher-js';

let pusherInstance = null;

export const getPusherInstance = (accountId) => {
    if (!pusherInstance) {
        pusherInstance = new Pusher('20173ccf44e3b961eee7', {
            cluster: 'ap2'
        });
    }

    return pusherInstance.subscribe('order-channel-' + accountId);
};

export const unbindPusherInstance = (accountId) => {
    if (pusherInstance) {
        const channel = pusherInstance.channels.channels['order-channel-' + accountId];
        if (channel) {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }
};
