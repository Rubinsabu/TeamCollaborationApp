import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String
  }, { timestamps: true });

  export default mongoose.model('Comment',commentSchema);