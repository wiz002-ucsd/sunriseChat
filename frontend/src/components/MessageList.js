import React from 'react';
import Message from './Message';
import './MessageList.css';

const MessageList = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message
          key={index}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}
    </div>
  );
};

export default MessageList;

