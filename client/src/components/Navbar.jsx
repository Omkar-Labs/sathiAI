import React from 'react';
import { Coffee, Terminal } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ activePersona, onTogglePersona }) {
  return (
    <nav className="navbar pulse-border">
      <div className="navbar-brand">
        <span className="brand-logo">💬</span>
        <h1 className="brand-title cyber-glow">
          Sathi <span className="highlight-text">AI</span>
        </h1>
      </div>

      <div className="persona-toggle-container">
        <span className={`toggle-label ${activePersona === 'hitesh' ? 'active' : ''}`}>
          Hitesh Sir Mode
        </span>
        
        <button 
          id="persona-toggle-switch"
          className={`toggle-switch-btn ${activePersona}`}
          onClick={onTogglePersona}
          aria-label="Toggle Persona"
        >
          <div className="toggle-knob">
            {activePersona === 'hitesh' ? (
              <Coffee className="knob-icon hitesh-icon" size={14} />
            ) : (
              <Terminal className="knob-icon piyush-icon" size={14} />
            )}
          </div>
        </button>

        <span className={`toggle-label ${activePersona === 'piyush' ? 'active' : ''}`}>
          Piyush Sir Mode
        </span>
      </div>
    </nav>
  );
}
