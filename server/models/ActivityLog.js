import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String }, // e.g., 'edited', 'moved', 'reassigned'
    message: String,
    modifiedAt: { type: Date, default: Date.now }
  });

  export default mongoose.model('ActivityLog',activityLogSchema);