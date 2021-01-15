import React, { Component } from 'react';
import './ChatWindow.scss';

// import components
import ChatMessage from '../ChatMessage';
import ChatInput from '../ChatInput';

export class ChatWindow extends Component {
    render() {
        const messages = this.props.messages.map((val, index) => {
            val = JSON.parse(val);
            if (val.username === this.props.username && this.props.username != "") {
                return <ChatMessage me={true}>{val.body}</ChatMessage>;
            }
            else {
                return <ChatMessage me={false}>{`${val.username}: ${val.body}`}</ChatMessage>;
            }       
        });
        return (
            <div className="ChatWindow">
                {messages}
            </div>
        )
    }
}

export default ChatWindow;
