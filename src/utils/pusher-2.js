// src/utils/pusher.js
import Pusher from 'pusher-js';

let pusherInstance = null;

const getPusherInstance = () => {
  if (!pusherInstance) {
    // Create a new Pusher instance if it doesn't exist
    pusherInstance = new Pusher('20173ccf44e3b961eee7', {
      cluster: 'ap2',
    });
  }
  return pusherInstance;
};

export const subscribeToOrderChannel = (account, callback) => {
  const pusher = getPusherInstance();
  const channelName = 'order-channel-' + account;
  const channel = pusher.subscribe(channelName);

  channel.bind('new-order', (data) => {
    console.log('puser data',data);
    
    if (callback) {
      callback(data); // Trigger the callback with the event data
    }
  });

  return channel;
};

export const unsubscribeFromOrderChannel = (account) => {
  const pusher = getPusherInstance();
  const channelName = 'order-channel-' + account;
  const channel = pusher.channel(channelName);
  if (channel) {
    channel.unbind_all();
    channel.unsubscribe();
  }
};
