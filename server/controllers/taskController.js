import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';
import { emitTaskUpdate } from '../socket/socket.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
    try {
      const task = await Task.create({...req.body, createdBy: req.user._id});
      res.status(201).json(task);
    } catch (err) {
      console.log('Task creation failed.');
      res.status(500).json({ error: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
  
      const log = new ActivityLog({
        taskId: id,
        user: req.user.id,
        action: 'edited',
        message: 'Task edited'
      });
      await log.save();
  
      updatedTask.activityLog.push(log._id);
      await updatedTask.save();
  
      res.status(200).json(updatedTask);
    } catch (err) {
        console.log('Task updation failed.');
      res.status(500).json({ error: err.message });
    }
};

export const moveTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const task = await Task.findById(id);
      task.status = status;
  
      const log = new ActivityLog({
        taskId: id,
        user: req.user.id,
        action: 'moved',
        message: `Task moved to ${status}`
      });
      await log.save();
  
      task.activityLog.push(log._id);
      await task.save();

      emitTaskUpdate(task.projectId, task);
  
      res.status(200).json(task);
    } catch (err) {
      console.log('Moving task failed')
      res.status(500).json({ error: err.message });
    }
  };

  export const reassignTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const task = await Task.findById(id);
      task.assignedTo = userId;
  
      const log = new ActivityLog({
        taskId: id,
        user: req.user.id,
        action: 'reassigned',
        message: `Task reassigned to user ${userId}`
      });
      await log.save();
  
      task.activityLog.push(log._id);
      await task.save();
  
      res.status(200).json(task);
    } catch (err) {
      console.log('Failed reassigning Task');
      res.status(500).json({ error: err.message });
    }
  };

export const getTaskDetails = async(req,res) =>{

    try{
      const task = await Task.findById(req.params.id)
      .select('title description dueDate assignedTo comment activityLog')
      .populate('assignedTo', 'name')
      .populate({
        path: 'comment',
        select: 'text',
        populate: { path: 'author', select: 'name' }
      })
      .populate('activityLog');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json(task);

    }catch(err){
      console.log('Failed to get task details');
      res.status(500).json({ error: err.message });
    }

}


  export const deleteTask = async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndDelete(id);
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.log('Failed deleting Task');
      res.status(500).json({ error: err.message });
    }
  };
  
export const addComment = async(req,res)=>{
    try{
        const {id} = req.params; //taskId
        const {text}= req.body;
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        let comment;
        if (task.comment) {
            comment = await Comment.findById(task.comment);
            comment.text = text;
            comment.author = req.user._id;
            await comment.save();
        } else {
            comment = new Comment({
            taskId: id,
            author: req.user._id,
            text
      });
      await comment.save();
      task.comment = comment._id; //task is saved later
    }

    const user = await User.findById(req.user._id);
    const log = new ActivityLog({
      taskId: id,
      user: req.user.id,
      action: 'edited',
      message: `Comment added by ${user.name}`
    });
    await log.save();

    task.activityLog.push(log._id);
    await task.save();

    res.status(201).json(comment);


    }catch(err){
        console.log('Failed to add/update comment');
        res.status(500).json({ error: err.message });
    }
}
