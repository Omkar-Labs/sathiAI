import React from 'react';
import './Sidebar.css';

export default function Sidebar({ activePersona, onSelectPersona, isTyping, typingPersona }) {
  const contacts = [
    {
      id: 'hitesh',
      name: 'Hitesh Sir',
      subtitle: 'Founder, Chai aur Code',
      initials: 'HC',
      avatarBg: 'linear-gradient(135deg, #E6D2C4, #DE9394)',
      status: 'Accha ji, code review krein?',
      theme: 'hitesh'
    },
    {
      id: 'piyush',
      name: 'Piyush Sir',
      subtitle: 'DevOps & Backend Lead',
      initials: 'PG',
      avatarBg: 'linear-gradient(135deg, #1C1F32, #FF007F)',
      status: 'Docker ready h? Output check kro.',
      theme: 'piyush'
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title cyber-glow">Chats</h2>
        <span className="contacts-count">2 contacts</span>
      </div>

      <div className="contacts-list">
        {contacts.map((contact) => {
          const isActive = activePersona === contact.id;
          const isCurrentlyTyping = isTyping && typingPersona === contact.id;

          return (
            <div
              key={contact.id}
              className={`contact-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPersona(contact.id)}
            >
              <div 
                className="avatar" 
                style={{ background: contact.avatarBg }}
              >
                <span className="avatar-text">{contact.initials}</span>
                <span className="online-indicator"></span>
              </div>

              <div className="contact-info">
                <div className="contact-meta">
                  <h3 className="contact-name">{contact.name}</h3>
                  <span className="contact-time">12:00 PM</span>
                </div>
                <p className="contact-subtitle">{contact.subtitle}</p>
                {isCurrentlyTyping ? (
                  <p className="contact-status typing-text">typing...</p>
                ) : (
                  <p className="contact-status">{contact.status}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="sidebar-footer">
        <p className="footer-notes">Practice LLM Workspace</p>
      </div>
    </aside>
  );
}
