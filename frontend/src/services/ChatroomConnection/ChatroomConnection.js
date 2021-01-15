const ChatroomConnection = (username, messageHandler) => {

    if (!username || username == "") {
        console.error("Must have a username to connect");
    }
    let socket = new WebSocket('ws://localhost:8080/websocket');
    console.log("Attempting Connection...");
    socket.onopen = () => {
        console.log("Successfully connected!");
    };
    socket.onmessage = (msg) => {
        if (messageHandler) {
            messageHandler(msg.data);
        }
    };
    socket.onclose = (event) => {
        console.log("Socket closed connection ", event);
    };
    socket.onerror = (err) => {
        console.log("Socket error: ", err);
    };

    return socket;
}

export default ChatroomConnection;