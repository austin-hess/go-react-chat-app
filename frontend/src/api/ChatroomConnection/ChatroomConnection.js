class ChatroomConnection {
    constructor(roomId) {
        console.log(`Creating connection for room: ${roomId}`);
        this.setMessageHandler = this.setMessageHandler.bind(this);
        this.socket = new WebSocket(`ws://localhost:8080/ws/${roomId}`);
        console.log("Attempting Connection...");
        this.socket.onopen = () => {
            console.log("Successfully connected!");
        };
        this.socket.onmessage = (msg) => {
            console.log(`Message received: ${JSON.stringify(msg)}`);
            if (this.messageHandler) {
                this.messageHandler(msg);
            }
        };
        this.socket.onclose = (event) => {
            console.log("Socket closed connection ", event);
        };
        this.socket.onerror = (err) => {
            console.log("Socket error: ", err);
        };
    }

    setMessageHandler(handler) {
        this.messageHandler = handler
    }

    sendMessage(msg) {
        console.log(`Sending message: ${msg}`);
        this.socket.send(msg);
    }

    end() {
        // Normal closure
        this.socket.close(1000);
    }
}

export default ChatroomConnection;