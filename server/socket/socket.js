let ioInstance;

export const setupSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    socket.on('leaveProject', (projectId) => {
      socket.leave(projectId);
      console.log(`Socket ${socket.id} left project ${projectId}`);
    });

    
    socket.on('taskUpdated', (projectId, task) => {
      if (projectId && task) {
        socket.to(projectId).emit('taskUpdated', task); // Broadcast to others
        console.log(`Task updated in project ${projectId}:`, task.title);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};


export const emitTaskUpdate = (projectId, task) => {
  if (ioInstance && projectId && task) {
    ioInstance.to(projectId).emit('taskUpdated', task);
  }
};
