// src/components/AddTaskModal.jsx
import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskInState } from '../features/tasks/tasksSlice';
import { emitTaskUpdated } from '../utils/socket';

const AddTaskModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const { selectedProject } = useSelector(state => state.project);
  const { user } = useSelector(state => state.auth); // Assume auth slice stores user info

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await axios.post('/tasks', {
        title,
        status: 'To Do',
        projectId: selectedProject._id,
        createdBy: user._id
      });

      dispatch(updateTaskInState(res.data));
      emitTaskUpdated(selectedProject._id, res.data);
      onClose();
    } catch (err) {
      console.error('Task creation failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md"
      >
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <input
          type="text"
          placeholder="Task title"
          className="w-full border px-3 py-2 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskModal;
