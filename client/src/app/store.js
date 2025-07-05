import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import  projectReducer  from "../features/projects/projectsSlice";
import taskReducer from '../features/tasks/tasksSlice';

const store = configureStore({
    reducer: {
      auth: authReducer,
      project: projectReducer,
      task: taskReducer
    },
  });
  
  export default store;