import React, { useState, useRef, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import './App.css';

function App() {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setConversationHistory(data.conversationHistory);
      
      // If this is a safety response, we might want to handle it differently
      if (data.isSafetyResponse) {
        console.log('Safety response triggered');
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setError(null);
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <ChatInterface
          conversationHistory={conversationHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
          onClearConversation={clearConversation}
        />
      </main>
    </div>
  );
}

export default App;

