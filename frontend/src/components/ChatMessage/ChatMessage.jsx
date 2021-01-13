import React, { Component } from 'react'
import "./ChatMessage.scss";

class ChatMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ChatMessage">{this.props.children}</div>
        );
    }
}

export default ChatMessage;