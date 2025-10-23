import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { RotateCcw } from 'lucide-react';
import './ChatInterface.css';

const ChatInterface = ({ 
  conversationHistory, 
  onSendMessage, 
  isLoading, 
  error, 
  onClearConversation 
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the conversation?')) {
      onClearConversation();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat with Sunrise</h2>
          <button 
            className="clear-button"
            onClick={handleClear}
            title="Clear conversation"
          >
            <RotateCcw size={16} />
            Clear
          </button>
        </div>
        
        <div className="chat-messages">
          {conversationHistory.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-content">
                <h3>Welcome to Sunrise Chat 🌅</h3>
                <p>I'm here to listen and provide emotional support. Feel free to share what's on your mind - I'm here to help with empathy and understanding.</p>
                <div className="safety-notice">
                  <p><strong>Safety First:</strong> If you're having thoughts of self-harm, please reach out to a mental health professional or call 988 (Suicide & Crisis Lifeline).</p>
                </div>
              </div>
            </div>
          ) : (
            <MessageList messages={conversationHistory} />
          )}
          
          {isLoading && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Sunrise is typing...</span>
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Share what's on your mind..."
        />
      </div>
    </div>
  );
};

export default ChatInterface;

