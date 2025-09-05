import axios from "axios";

class WebSocketClient {
    constructor(apiUrl, socketBaseUrl) {
        this.ws = null;
        this.apiUrl = apiUrl;
        this.socketBaseUrl = socketBaseUrl;
        this.listeners = new Map();
        this.connected = false;
        this.connecting = false; // ⬅️ Add this line
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
        this.connectionTimeout = 5000; // 5 seconds timeout
        this.symbols = []; // This will store the symbols fetched from the API
    }

    async fetchSymbols() {
        // try {
        //     const response = await axios.get(this.apiUrl);
        //     this.symbols = response.data.data;
        //     this.connect(); // Call connect after symbols are fetched
        // } catch (error) {
        //     console.error('Error fetching symbols:', error);
        //     setTimeout(() => this.fetchSymbols(), this.reconnectInterval); // Retry after a delay
        // }

        const selectedSymbol = localStorage.getItem("selectedSymbol") || "BTCUSD";
        this.symbols = [selectedSymbol];
        this.connect(); // Call connect after setting symbol
    }

    // Dynamically generate the WebSocket URL
    generateSocketUrl() {
        if (this.symbols.length === 0) {
            console.error('No symbols available for WebSocket URL');
            return null;
        }
        const symbolsQuery = this.symbols.join(',');
        return `${this.socketBaseUrl}?symbols=${symbolsQuery}`;
    }

connect() {
    if (this.ws?.readyState === WebSocket.OPEN || this.connecting) return;

    const url = this.generateSocketUrl();
    if (!url) return;

    this.connecting = true; // ⬅️ Mark as connecting
    console.log('Attempting WebSocket connection to:', url);
    this.ws = new WebSocket(url);

    const connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            console.log('Connection timeout, closing socket');
            this.ws.close();
        }
    }, this.connectionTimeout);

    this.ws.onopen = () => {
        clearTimeout(connectionTimeout);
        this.connected = true;
        this.connecting = false; // ⬅️ Done connecting
        this.reconnectAttempts = 0;
        this.emit('connect');
        this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    };

    this.ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        clearInterval(this.pingInterval);
        this.connected = false;
        this.connecting = false; // ⬅️ Also reset here
        this.tryReconnect();
        this.emit('disconnect');
    };

    this.ws.onerror = (error) => {
        this.connecting = false; // ⬅️ Reset on error too
        this.emit('error', { message: 'Connection error', timestamp: new Date().toISOString() });
    };

    this.ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type !== 'pong') {
                this.emit('new_data', data);
            }
        } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
        }
    };
}


    tryReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1); // Exponential backoff
        // console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

        setTimeout(() => {
            if (!this.connected) {
                this.fetchSymbols(); // Retry fetching symbols if not connected
            }
        }, delay);
    }

    disconnect() {
        if (this.ws) {
            clearInterval(this.pingInterval);
            this.ws.close(1000, 'Client disconnecting');
            this.ws = null;
            this.connected = false;
            this.reconnectAttempts = this.maxReconnectAttempts; // Prevent auto-reconnect
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('Error in event callback:', error);
                }
            });
        }
    }
}

// Usage:
// Initialize with the URL to fetch symbols and the base WebSocket URL
const socket = new WebSocketClient(
    "https://portal.xqtrades.com/api/all-symbols-string", // API URL to fetch symbols
    "wss://apicon.brokercheap.com:8040/newapp/ws/multi_live_prices"  // WebSocket base URL
);

// Fetch symbols and then connect
socket.fetchSymbols();

export default socket;
