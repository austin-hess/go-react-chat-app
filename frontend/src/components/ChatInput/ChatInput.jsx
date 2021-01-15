import React, { Component } from 'react'
import "./ChatInput.scss";

class ChatInput extends Component {
    render() {
        return (
            <div className="ChatInput">
                <input placeholder={this.props.label} onKeyDown={this.props.onInput} />
            </div>
        )
    }
}

export default ChatInput;