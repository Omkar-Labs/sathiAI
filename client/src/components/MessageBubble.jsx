import React from 'react';
import './MessageBubble.css';

export default function MessageBubble({ message }) {
  const isSelf = message.sender === 'user';
  
  // Format standard timestamps
  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className={`message-bubble-wrapper ${isSelf ? 'self' : 'other'}`}>
      <div className={`message-bubble ${isSelf ? 'bubble-self' : 'bubble-other'}`}>
        <p className="message-text">{message.text}</p>
        <span className="message-timestamp">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
