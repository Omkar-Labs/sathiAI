import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

// Define the Socket server URL (defaulting to port 5000)
const SOCKET_SERVER_URL = import.meta.env.BACKEND_URL;


export default function App() {
  const [activePersona, setActivePersona] = useState('hitesh');
  const [socket,setSocket]=useState(null);
  // Track typing states individually for each persona
  const [typingState, setTypingState] = useState({
    hitesh: false,
    piyush: false
  });

  // Track chat histories individually to behave like WhatsApp
  const [chatHistories, setChatHistories] = useState({
    hitesh: [
      {
        id: 'h-1',
        sender: 'other',
        text: 'Accha ji! Swagat hai aapka Chai aur Code me. Code fat raha hai ya chal raha hai?',
        timestamp: new Date(Date.now() - 600000).toISOString()
      }
    ],
    piyush: [
      {
        id: 'p-1',
        sender: 'other',
        text: 'Hello developers! Welcome back. System design ka low-level schema configure kiya ya direct deployment kr di?',
        timestamp: new Date(Date.now() - 300000).toISOString()
      }
    ]
  });
  const handleResponse = (data) => {
      // Data expected: { text: string, persona: 'hitesh' | 'piyush', timestamp: string }
      const targetPersona = data.persona;
      
      setChatHistories((prev) => ({
        ...prev,
        [targetPersona]: [
          ...prev[targetPersona],
          {
            id: `msg-${Date.now()}`,
            sender: 'other',
            text: data.text,
            timestamp: data.timestamp || new Date().toISOString()
          }
        ]
      }));
    };
    

    // Listen for typing status changes
    

  // Establish Socket.io connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);
    newSocket.on('connect', () => {
      console.log('Successfully connected to WebSocket server:', newSocket.id);
    });
    
    // Listen for mimic responses
    newSocket.on('message_response',(data)=>handleResponse(data) );
    
    newSocket.on('typing_status', (data) => {
      // Data expected: { isTyping: boolean, persona: 'hitesh' | 'piyush' }
      const targetPersona = data.persona;
      setTypingState((prev) => ({
        ...prev,
        [targetPersona]: data.isTyping
      }));
    });
    newSocket.on('disconnect', () => {
      console.log('Socket connection disconnected.');
    });

    // Cleanup on unmount
    return () => {
      newSocket.off('message_response',(data)=>handleResponse(data));
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.disconnect();
    };
  }, []);

  // Update theme class on document body for global transitions
  useEffect(() => {
    const body = document.body;
    if (activePersona === 'hitesh') {
      body.classList.remove('theme-piyush');
      body.classList.add('theme-hitesh');
    } else {
      body.classList.remove('theme-hitesh');
      body.classList.add('theme-piyush');
    }
  }, [activePersona]);

  // Handle Toggle Switch in Navbar
  const handleTogglePersona = () => {
    setActivePersona((prev) => (prev === 'hitesh' ? 'piyush' : 'hitesh'));
  };

  // Handle Click on Sidebar Contact
  const handleSelectPersona = (personaId) => {
    setActivePersona(personaId);
  };

  // Send Message handler
  const handleSendMessage = (text) => {
    const timestamp = new Date().toISOString();
    
    // 1. Add user message locally
    setChatHistories((prev) => ({
      ...prev,
      [activePersona]: [
        ...prev[activePersona],
        {
          id: `user-msg-${Date.now()}`,
          sender: 'user',
          text: text,
          timestamp: timestamp
        }
      ]
    }));

    // 2. Emit to WebSocket server
    if(socket && socket.connected){
      socket.emit('send_message', {
        text: text,
        persona: activePersona,
        timestamp: timestamp
      });
    } else {
      console.warn('Socket is disconnected. Cannot send message via socket.');
      // Offline fallback indicator/mock reply just in case server is not running yet
      setTypingState((prev) => ({ ...prev, [activePersona]: true }));
      setTimeout(() => {
        setTypingState((prev) => ({ ...prev, [activePersona]: false }));
        setChatHistories((prev) => ({
          ...prev,
          [activePersona]: [
            ...prev[activePersona],
            {
              id: `offline-msg-${Date.now()}`,
              sender: 'other',
              text: activePersona === 'hitesh' 
                ? 'Server abhi active nahi hai ji. Socket connect nahi ho raha hai! (Offline mock response)' 
                : 'Server offline h boss! Socket server start kro dashboard me check krne k liye. (Offline mock response)',
              timestamp: new Date().toISOString()
            }
          ]
        }));
      }, 1500);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar with switch toggle */}
      <Navbar 
        activePersona={activePersona} 
        onTogglePersona={handleTogglePersona} 
      />

      {/* Main Layout containing Sidebar and ChatWindow */}
      <main className="main-layout">
        <Sidebar 
          activePersona={activePersona} 
          onSelectPersona={handleSelectPersona}
          isTyping={typingState[activePersona]}
          typingPersona={activePersona}
        />
        
        <ChatWindow 
          activePersona={activePersona}
          messages={chatHistories[activePersona]}
          isTyping={typingState[activePersona]}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
}
