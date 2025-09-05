import Pusher from 'pusher-js';

const pusher = new Pusher('f385b9f97eec57483c7f', {
    cluster: 'ap2',
    encrypted: true
});

export default pusher;
