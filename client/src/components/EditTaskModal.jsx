import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axiosInstance';

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(task.dueDate?.substring(0, 10) || '');
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || '');


  const { selectedProject } = useSelector(state => state.project);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/tasks/${task._id}`, {
        title,
        description,
        dueDate,
        assignedTo
      });
      onUpdated(res.data);  // send updated task back to parent
      onClose();
    } catch (err) {
      console.error('Failed to update task:', err);
      alert('Failed to update task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Assign To</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">-- Select Member --</option>
              {selectedProject?.members?.map((member) => (
                <option key={member.user._id} value={member.user._id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
