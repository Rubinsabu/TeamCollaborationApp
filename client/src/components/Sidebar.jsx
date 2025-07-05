import React,{useState,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects,selectProject,fetchProjectDetails } from '../features/projects/projectsSlice';
import CreateProjectModal from './CreateProjectModal';
import AddMemberModal from './AddMemberModal';
import { isUserAdmin } from '../features/projects/projectsSlice';
import {FaTimes} from 'react-icons/fa';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../api/axiosInstance'

const Sidebar = () => {

  const dispatch = useDispatch();
  const { projects, selectedProject } = useSelector((state) => state.project);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);


  const handleSelect = (project) => {
    dispatch(selectProject(project))
    dispatch(fetchProjectDetails(project._id));
  };

  const isAdmin = useSelector(isUserAdmin);

  const handleProjectDelete = async (projectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
  
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/projects/${projectId}`);
      toast.success('Project deleted successfully');
      dispatch(fetchProjects()); // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete project');
    }
  };


  return (
    <aside className="bg-gray-100 w-64 h-full p-4 border-r">
      <h2 className="font-bold text-lg mb-4">Projects</h2>
      <ul>
        {projects.map((proj) => (
          <li
            key={proj._id}
            className={`flex justify-between items-center cursor-pointer p-2 rounded mb-1 hover:bg-gray-700 hover:text-white ${
              selectedProject?._id === proj._id ? 'bg-gray-700 text-white' : ''
            }`}
            onClick={() => handleSelect(proj)}
          >
            {proj.name}
              <FaTimes 
              className="text-gray-500 hover:text-red-500 cursor-pointer ml-2" 
              title="Close"
              onClick={(e) => {
                e.stopPropagation(); 
                handleProjectDelete(proj._id); 
              }}
              />
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowProjectModal(true)}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        + New Project
      </button>

      {showProjectModal && <CreateProjectModal onClose={() => setShowProjectModal(false)} />}
      
      <hr className="my-4" />

      <h2 className="font-bold text-lg mb-2">Members</h2>
      <ul className="space-y-1">
      {selectedProject?.members && selectedProject.members.length > 0 ? (
      selectedProject.members.map((member) => (
        <li key={member.user?._id || member.user} className="text-sm">
          👤 {member.user?.name || member.name} ({member.role})
      </li>
      ))
      ) : (
      <li className="text-sm text-gray-500">No members added yet</li>
      )}
    </ul>

      {isAdmin && (
      <button 
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => setShowMemberModal(true)}>
        + Add Member
      </button>
      )}

  {showMemberModal && <AddMemberModal onClose={() => setShowMemberModal(false)} />}
  <ToastContainer position="top-right" />
    </aside>
  )
}

export default Sidebar