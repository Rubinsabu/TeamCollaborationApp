import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const protect = async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
      } catch (error) {
        console.log('Not authorized, token failed');
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
    if (!token) {
        console.log('no token');
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  };

export const isAdminOfProject = async (req,res,next)=>{
    try{

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findById(task.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const member = project.members.find(m => m.user.toString() === req.user._id.toString());
    if (!member || member.role !== 'Admin') {
      console.log('Only admins can perform this action');
      return res.status(403).json({ message: 'Only admins can perform this action' });
    }
    next();

    }catch(err){
        console.log('Server error during role verification');
        res.status(500).json({ message: 'Server error during role verification' });
    }
}