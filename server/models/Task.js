import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    activityLog: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActivityLog' }]
  }, { timestamps: true });

  export default mongoose.model('Task',taskSchema);