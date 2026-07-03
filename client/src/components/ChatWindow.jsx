import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Search, MoreVertical, Coffee, Terminal } from 'lucide-react';
import MessageBubble from './MessageBubble';
import './ChatWindow.css';

export default function ChatWindow({ activePersona, messages, isTyping, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const getPersonaDetails = () => {
    if (activePersona === 'hitesh') {
      return {
        name: 'Hitesh Chaudhary',
        avatarBg: 'linear-gradient(135deg, #E6D2C4, #DE9394)',
        initials: 'HC',
        status: isTyping ? 'typing...' : 'Online',
        tagline: 'Chai aur Code'
      };
    } else {
      return {
        name: 'Piyush Garg',
        avatarBg: 'linear-gradient(135deg, #1C1F32, #FF007F)',
        initials: 'PG',
        status: isTyping ? 'typing...' : 'Online',
        tagline: 'System Design & DevOps'
      };
    }
  };

  const details = getPersonaDetails();

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="chat-window">
      {/* Top Header (WhatsApp Style) */}
      <header className="chat-header">
        <div className="header-user-info">
          <div className="avatar" style={{ background: details.avatarBg }}>
            <span className="avatar-text">{details.initials}</span>
            <span className="online-dot"></span>
          </div>
          <div className="header-details">
            <h3 className="header-name">{details.name}</h3>
            <div className="header-status-container">
              {isTyping ? (
                <div className="typing-indicator">
                  <span className="typing-text">typing</span>
                  <div className="typing-dots">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              ) : (
                <span className="header-status">{details.status}</span>
              )}
              <span className="header-divider">•</span>
              <span className="header-tagline">{details.tagline}</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="header-action-btn" aria-label="Video Call">
            <Video size={18} />
          </button>
          <button className="header-action-btn" aria-label="Phone Call">
            <Phone size={18} />
          </button>
          <button className="header-action-btn" aria-label="Search Messages">
            <Search size={18} />
          </button>
          <button className="header-action-btn" aria-label="More Options">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="messages-area">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="empty-icon-circle">
                {activePersona === 'hitesh' ? (
                  <Coffee size={32} className="empty-icon" />
                ) : (
                  <Terminal size={32} className="empty-icon" />
                )}
              </div>
              <h4>Start a conversation with {details.name}</h4>
              <p>Send a message over WebSockets to trigger a mimic response!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={msg.id || index} message={msg} />
            ))
          )}

          {isTyping && (
            <div className="typing-bubble-container">
              <div className="avatar-bubble" style={{ background: details.avatarBg }}>
                {details.initials}
              </div>
              <div className="message-bubble typing-bubble">
                <div className="typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="chat-input-form">
        <input
          type="text"
          className="chat-input-field"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message to ${details.name}...`}
          maxLength={1000}
        />
        <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
