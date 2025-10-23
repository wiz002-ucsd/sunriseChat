import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import './MessageInput.css';

const MessageInput = ({ value, onChange, onSubmit, isLoading, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={onSubmit} className="message-input-form">
        <div className={`message-input-wrapper ${isFocused ? 'focused' : ''}`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="message-input"
            rows="1"
            disabled={isLoading}
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? (
              <Loader2 className="send-icon loading" />
            ) : (
              <Send className="send-icon" />
            )}
          </button>
        </div>
        <div className="input-footer">
          <span className="char-count">{value.length}/2000</span>
          <span className="input-hint">Press Enter to send, Shift+Enter for new line</span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;

