import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import {SYSTEM_PROMPT_HITESH,SYSTEM_PROMPT_PIYUSH} from './constant.js';
import main from "./Sathi.js";

const app = express();
app.use(cors({origin: process.env.FRONTEND_URL, 
  methods: ['GET', 'POST'],
  credentials: true

}));

const server = http.createServer(app);

// Initialize Socket.io with CORS configuration matching React app (Vite usually runs on port 5173)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Root testing route
app.get('/', (req, res) => {
  res.send('AI Mimic Chat Socket.io Server is running.');
});

// Socket connection handler
io.on('connection', (socket) => {
  
  // Listen for messages from client
  socket.on('send_message', async (data) => {
    // Data schema: { text: string, persona: 'hitesh' | 'piyush', timestamp: string }
    const { text, persona, timestamp } = data;

    // 1. Emit typing status to the user to show a realistic delay
    socket.emit('typing_status', { isTyping: true, persona: persona });

    // 2. Mock a processing delay (e.g. 1.5 seconds)
    await main(text,persona === 'hitesh'?SYSTEM_PROMPT_HITESH:SYSTEM_PROMPT_PIYUSH)
    .then((res)=>{
    socket.emit('typing_status', { isTyping: false, persona: persona });
    socket.emit('message_response', {
      text: res,
      persona: persona,
      timestamp: new Date().toISOString()
    });
    });

  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  
});
