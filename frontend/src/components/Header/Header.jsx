import React from 'react';
import "./Header.scss";

const Header = (props) => (
    <div className="header">
        <h2>Realtime Chat App</h2>
        <button onClick={props.newChatroomAction}>Create New Chatroom</button>
    </div>
);

export default Header;