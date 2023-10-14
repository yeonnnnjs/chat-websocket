import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      message: '',
    };
    this.socket = io('http://localhost:8000');
  }

  componentDidMount() {
    this.socket.on('chatmsg', (message) => {
      this.setState((prevState) => ({
        messages: [...prevState.messages, message],
      }));
    });
  }

  handleMessageChange = (e) => {
    this.setState({ message: e.target.value });
  };

  handleSendMessage = () => {
    const message = this.state.message;
    this.socket.emit('chatmsg', message);
    this.setState({ message: '' });
  };

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <div>
          <ul>
            {this.state.messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
        <input
          type="text"
          value={this.state.message}
          onChange={this.handleMessageChange}
        />
        <button onClick={this.handleSendMessage}>전송</button>
      </div>
    );
  }
}

export default App;
