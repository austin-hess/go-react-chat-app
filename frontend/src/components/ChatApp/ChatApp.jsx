import React, { Component } from 'react'
import './ChatApp.scss';

// import components
import ChatWindow from '../ChatWindow';
import ChatInput from '../ChatInput';
import Header from '../Header';

// import services/utils
import ChatroomConnection from '../../services/ChatroomConnection';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            username: ""
        };
        this.handleMessage = this.handleMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.setUsername = this.setUsername.bind(this);
    }

    componentDidMount() {
        this.connection = ChatroomConnection(this.handleMessage);
    }

    handleMessage(msg) {
        console.log(msg);
        this.setState(prevState => ({
            messages: [...prevState.messages, msg]
        }));
    }   

    sendMessage(event) {
        if (event.keyCode === 13) {
            this.connection.send(JSON.stringify({
                username: this.state.username,
                body: event.target.value
            }));
            event.target.value = "";
        }
    }

    

    setUsername(event) {
        if (event.keyCode === 13) {
            this.setState({
                username: event.target.value
            });
            event.target.value = "";
        }
    }

    render() {
        const chatWindow = this.state.messages ? <ChatWindow username={this.state.username} messages={this.state.messages} /> : <></>;
        return (
            <div className="ChatApp">
                <Header username={this.state.username} connect={this.connectToWebsocket} />
                {chatWindow}
                <ChatInput label="Send Message" onInput={this.sendMessage} />
                <ChatInput label="Username" onInput={this.setUsername} />
            </div>
        )
    }
}

export default ChatApp;