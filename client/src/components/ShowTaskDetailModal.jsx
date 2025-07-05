import React from 'react';

const ShowTaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Task Details</h2>

        <div className="space-y-3 text-gray-800">
          <div>
            <strong>Title:</strong>
            <p>{task.title}</p>
          </div>

          {task.description && (
            <div>
              <strong>Description:</strong>
              <p>{task.description}</p>
            </div>
          )}

          <div>
            <strong>Status:</strong>
            <p>{task.status}</p>
          </div>

          <div>
            <strong>Assigned To:</strong>
            <p>{task.assignedTo?.name || 'Unassigned'}</p>
          </div>

          {task.dueDate && (
            <div>
              <strong>Due Date:</strong>
              <p>{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowTaskDetailModal;
