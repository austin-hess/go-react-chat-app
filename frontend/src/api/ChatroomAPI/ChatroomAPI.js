const ChatroomAPI = {

    getAvailableChatrooms: async () => {
        const response = await fetch("http://localhost:8080/chatroom", {
            method: "GET",
            mode: "cors"
        });
        return response.json();
    },
    
    createChatroom: async () => {
        const response = await fetch("http://localhost:8080/chatroom", {
            method: "POST",
            mode: "cors"
        });
        return response.json();
    }
};

export default ChatroomAPI;