import React from 'react';
import "./Header.scss";

const Header = (props) => (
    <div className="header">
        <h2>Realtime Chat App</h2>
        <h4>Username: {props.username}</h4>
    </div>
);

export default Header;