import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useSelector } from 'react-redux';

const AddMemberModal = ({ onClose, onMemberAdded }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { selectedProject } = useSelector(state => state.project);
  const { user } = useSelector(state => state.auth);

  const handleAddMember = async () => {
    try {
      setError('');
      setSuccess('');
      if (!email.trim()) {
        setError('Please enter a valid email');
        return;
      }

      console.log('Token:', sessionStorage.getItem('token'));
      const res = await axios.post(`/projects/${selectedProject._id}/add-member`, { email });
      setSuccess(res.data.message || 'Member added successfully');
      setEmail('');

      if (onMemberAdded) {
        onMemberAdded();  //notify parent to refresh project details
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Add Team Member</h2>

        <input
          type="email"
          placeholder="Enter member's email"
          className="w-full px-4 py-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddMember}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
