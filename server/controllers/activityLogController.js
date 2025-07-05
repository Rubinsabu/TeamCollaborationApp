import ActivityLog from "../models/ActivityLog.js";

export const getTaskActivityLogs = async (req, res) => {
    try {
      const { taskId } = req.params;
  
      const logs = await ActivityLog.find({ taskId })
        .populate('user', 'name email') // get user details
        .sort({ modifiedAt: -1 }); // latest first
  
      res.status(200).json(logs);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      res.status(500).json({ message: 'Failed to fetch activity logs' });
    }
  };