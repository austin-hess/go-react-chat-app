import React, { Component } from 'react';
import './ChatWindow.scss';

// import backend services
import ChatroomConnection from '../../api/ChatroomConnection';

// import components
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';

export class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatHistory: []
        }
        this.handleMessage = this.handleMessage.bind(this);
        
        this.props.connection.setMessageHandler(this.handleMessage);
    }

    send = event => {
        if (event.keyCode === 13) {
            this.props.connection.sendMessage(event.target.value);
            event.target.value = "";
        }
    }

    handleMessage(msg) {
        this.setState(prevState => ({
            chatHistory: [...prevState.chatHistory, msg]
        }));
    }

    render() {
        const messages = this.state.chatHistory.map((val, index) => (
            <ChatMessage>{val}</ChatMessage>
        ));
        return (
            <div className="ChatWindow">
                {this.props.roomId}
            </div>
        )
    }
}

export default ChatWindow;
