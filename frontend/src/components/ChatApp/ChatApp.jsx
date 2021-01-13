import React, { Component } from 'react'
import './ChatApp.scss';

// import components
import ChatroomList from '../ChatroomList';
import ChatWindow from '../ChatWindow';

// import backend services
import ChatroomAPI from '../../api/ChatroomAPI';
import ChatroomConnection from '../../api/ChatroomConnection';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeChatWindow: undefined,
            roomConnections: new Map(),
            availableChatrooms: []
        }
        this.handleRoomSelect = this.handleRoomSelect.bind(this);
        this.createNewChatroom = this.createNewChatroom.bind(this);
    }

    componentDidMount() {
        ChatroomAPI.getAvailableChatrooms().then(response => {
            console.log(`Received existing rooms: ${response.roomIds}`);
            const availableChatrooms = response.roomIds;
            const activeChatWindow = availableChatrooms && availableChatrooms.length > 0 ? availableChatrooms[0] : undefined;
            console.log(`Setting available chat rooms: ${availableChatrooms}`);
            console.log(`Setting active chat window: ${activeChatWindow}`);
            let roomConnections = new Map();
            response.roomIds.forEach(id => {
                roomConnections.set(id, new ChatroomConnection(id));
            });
            this.setState({ 
                roomConnections,
                availableChatrooms,
                activeChatWindow
            });
        });
    }

    handleRoomSelect(event) {
        console.log(`Setting active chat window to: ${event.target.value}`);
        this.setState({
            activeChatWindow: event.target.value
        });
    }

    createNewChatroom() {
        ChatroomAPI.createChatroom().then(response => {
            this.setState(prevState => {
                let roomConnections = new Map(prevState.roomConnections.set(response, new ChatroomConnection(response)));
                return { roomConnections };
            });
        });
    }

    render() {
        const chatWindow = this.state.activeChatWindow ?
                        <ChatWindow 
                            connection={this.state.roomConnections.get(this.state.activeChatWindow)} 
                            roomId={this.state.activeChatWindow}
                        /> :
                        <></>;
        return (
            <div className="ChatApp">
                <button onClick={this.createNewChatroom}>Create New Chatroom</button>
                <ChatroomList 
                    handleRoomSelect={this.handleRoomSelect}
                    chatrooms={this.state.availableChatrooms ? this.state.availableChatrooms : []} 
                />
                {chatWindow}
            </div>
        )
    }
}

export default ChatApp;