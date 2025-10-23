import React from 'react';
import { User, Bot } from 'lucide-react';
import './Message.css';

const Message = ({ message, isLast }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <User className="avatar-icon user-avatar" />
        ) : (
          <Bot className="avatar-icon bot-avatar" />
        )}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;

