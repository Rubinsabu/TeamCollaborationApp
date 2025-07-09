import React,{useState} from 'react';
import axios from '../api/axiosInstance';
import { useDispatch } from 'react-redux';
import { addProject } from '../features/projects/projectsSlice';

const CreateProjectModal = ({ onClose}) => {

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Project name required');

    try {
      const res = await axios.post('/projects', { name });
      dispatch(addProject({ ...res.data, role: 'Admin' }));

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-[400px]">
        <h2 className="text-lg font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProjectModal