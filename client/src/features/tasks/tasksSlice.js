import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

// Fetch all tasks for selected project
export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchByProject',
  async (projectId) => {
    const res = await axios.get(`/projects/${projectId}/tasks`);
    return res.data; // array of tasks
  }
);

const groupByStatus = (tasks) => {
  return {
    'To Do': tasks.filter(task => task.status === 'To Do'),
    'In Progress': tasks.filter(task => task.status === 'In Progress'),
    'Done': tasks.filter(task => task.status === 'Done')
  };
};

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasksByStatus: {
      'To Do': [],
      'In Progress': [],
      'Done': []
    },
    loading: false,
    error: null
  },
  reducers: {
    updateTaskInState: (state, action) => {
      const updatedTask = action.payload;

      // Remove task from all columns
      Object.keys(state.tasksByStatus).forEach(status => {
        state.tasksByStatus[status] = state.tasksByStatus[status].filter(
          t => t._id !== updatedTask._id
        );
      });

      // Add to new status column
      state.tasksByStatus[updatedTask.status].push(updatedTask);
    },
    clearTasks: (state) => {
      state.tasksByStatus = {
        'To Do': [],
        'In Progress': [],
        'Done': []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasksByStatus = groupByStatus(action.payload);
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { updateTaskInState, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
