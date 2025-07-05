import {io} from 'socket.io-client';
import {updateTaskInState} from '../features/tasks/tasksSlice';

let socket;

// Initialize socket and handle incoming real-time events
export const initSocket = (store) => {
  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

  socket.on('connect', () => {
    console.log('Connected to socket server with ID:', socket.id);
  });

  socket.on('taskUpdated', (task) => {
    store.dispatch(updateTaskInState(task)); // Real-time task update
  });
};

// Join a project room
export const joinProject = (projectId) => {
  if (socket && projectId) {
    socket.emit('joinProject', projectId);
  }
};

// Leave a project room
export const leaveProject = (projectId) => {
  if (socket && projectId) {
    socket.emit('leaveProject', projectId);
  }
};

// Emit task update to others
export const emitTaskUpdated = (projectId, task) => {
  if (socket && projectId && task) {
    socket.emit('taskUpdated', projectId, task);
  }
};