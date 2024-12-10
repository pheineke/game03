export class ConnectionHandler {
    constructor(address, queue) {
        this.socket = new WebSocket(address);
        this.queue = queue;

        this.socket.onopen = () => {
            console.log('Connected to server');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = (event) => {
            console.warn('WebSocket closed:', event.reason);
        };
    }

    send(message) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Message not sent:', message);
        }
    }
}
