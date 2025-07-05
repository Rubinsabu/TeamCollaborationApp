import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import {Server as SocketServer} from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import {setupSocket} from './socket/socket.js';
import connectDB from './config/db.js';
import {protect} from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSocket(io);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', protect,projectRoutes);
app.use('/api/tasks', protect,taskRoutes);

connectDB().then(() => {
  server.listen(process.env.PORT || 5000, () => console.log('Server running'));
});