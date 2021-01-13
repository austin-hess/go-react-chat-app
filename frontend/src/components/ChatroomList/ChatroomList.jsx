import React, { Component } from 'react'
import './ChatroomList.scss';

class ChatroomList extends Component {
    render() { 
        if (this.props.chatrooms) {
            const rooms = this.props.chatrooms.map((val,i) => (
                <li key={i}>
                    <button value={val} onClick={this.props.handleRoomSelect}>Chatroom {val}</button>
                </li>
            ));
            return (
                <div className="ChatroomList">
                    {rooms}
                </div>
            );
        }
        
        return (
            <></>
        );
    }
}

export default ChatroomList;