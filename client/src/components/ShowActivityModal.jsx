
import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from '../api/axiosInstance';

const ShowActivityModal = ({ taskId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/activity-log/${taskId}`);
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [taskId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 relative shadow-lg max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
          <FaTimes size={18} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Activity History</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">No activity logs available.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li key={log._id} className="border p-3 rounded-md">
                <div className="text-sm text-gray-700">
                  <span className="font-semibold">{log.user?.name || 'Unknown User'}</span> {log.message}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(log.modifiedAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShowActivityModal;
