import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';

export const fetchProjects = createAsyncThunk('projects/fetch', async () => {
    const res = await axios.get('/projects');
    return res.data.map(p => ({
        _id: p._id,
        name: p.name,
        role: p.role
      }));
  });

  export const fetchProjectDetails = createAsyncThunk('projects/fetchDetails', async (projectId) => {
    console.log('before fetching project Users')
    const res = await axios.get(`/projects/${projectId}/projectUsers`); // endpoint populates members
    return res.data;
  });

  export const projectSlice = createSlice({
    name: 'project',
    initialState: {
      projects: [],
      selectedProject: null,
      loading: false,
      error: null
    },
    reducers: {
      selectProject: (state, action) => {
        state.selectedProject = action.payload;
      },
      addProject: (state, action) => {
        state.projects.push(action.payload);
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchProjects.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchProjects.fulfilled, (state, action) => {
          state.loading = false;
          state.projects = action.payload;
        })
        .addCase(fetchProjects.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(fetchProjectDetails.fulfilled, (state, action) => {
          const fetchedDetails = action.payload;
          const matchingProject = state.projects.find(p => p._id === fetchedDetails._id);
          const role = matchingProject?.role || null;
          state.selectedProject = {
            ...fetchedDetails,
            role: role  // Preserve the user's role
          };
        });
    }
  });
  
  export const isUserAdmin = (state) => state.project.selectedProject?.role?.toLowerCase() === 'admin';
  
  export const { selectProject, addProject } = projectSlice.actions;
  export default projectSlice.reducer;