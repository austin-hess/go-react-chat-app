import React, { Component } from 'react';
import "./App.css";

import Header from './components/Header';
import ChatApp from './components/ChatApp';

class App extends Component {

  render() {
    return (
      <div className="App">
        <ChatApp />
      </div>
    );
  } 
}

export default App;