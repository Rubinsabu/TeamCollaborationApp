import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js'

export const createProject = async(req,res)=>{
    try{
        const { name } = req.body;
        const project = await Project.create({ name, owner: req.user.id, members: [{ user: req.user.id, role: 'Admin' }] });
        res.status(201).json(project);
    }catch(err){
        console.log('Failed project creation');
        res.status(500).json({ error: err.message });
    }
};

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can delete this project' });
    }
    
    const tasks = await Task.find({ projectId });
    // Delete all related activity logs for those tasks
    const taskIds = tasks.map(t => t._id);
    await ActivityLog.deleteMany({ taskId: { $in: taskIds } });

    await Task.deleteMany({ projectId });
    await Project.findByIdAndDelete(projectId);
    

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMember = async(req,res)=>{

try{
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found with provided email' });

    const alreadyMember = project.members?.find(m => m.user.toString() === user._id.toString());
    if (alreadyMember) return res.status(400).json({ message: 'User is already a project member' });
    
    project.members.push({ user: user._id, role: 'Member' });
    console.log('Saving project:', JSON.stringify(project, null, 2));
    await project.save();

    res.status(200).json(project);

    }catch(err){
        console.log('Adding member failed');
        res.status(500).json({ error: err.message });

    }
};

export const removeMember = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userId } = req.body;
      const project = await Project.findById(projectId);
      project.members = project.members.filter(m => m.user.toString() !== userId);
      await project.save();
      res.status(200).json(project);
    } catch (err) {
      console.log('Remove Member failed')
      res.status(500).json({ error: err.message });
    }
  };


  export const getUserProjects = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const projects = await Project.find({
        'members.user': userId
      }).select('name members');
  
      const filteredProjects = projects.map((project) => {
        const member = project.members.find(m => m.user.toString() === userId.toString());
        return {
          _id: project._id,
          name: project.name,
          role: member.role // 'Admin' or 'Member'
        };
      });
  
      res.status(200).json(filteredProjects);
    } catch (err) {
      console.error('Failed to fetch user projects:', err);
      res.status(500).json({ error: 'Server error while fetching projects' });
    }
}


  export const getProjectTasks = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      const tasks = await Task.find({ projectId }).populate('assignedTo', 'name');
  
      res.status(200).json(tasks);
    } catch (err) {
      console.error('Error fetching project tasks:', err);
      res.status(500).json({ error: 'Server error while fetching project tasks' });
    }
  };

  export const getProjectWithUsers = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('members.user', 'name email');
      if (!project) return res.status(404).json({ message: 'Project not found' });
      res.status(200).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


