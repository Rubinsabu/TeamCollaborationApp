import React,{useEffect, useState} from "react";
import {DragDropContext, Droppable,Draggable} from '@hello-pangea/dnd'
import {joinProject, leaveProject, emitTaskUpdated} from "../utils/socket";
import axios from '../api/axiosInstance';
import AddTaskModal from "../components/AddTaskModal";
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasksByProject,updateTaskInState } from "../features/tasks/tasksSlice";
import { isUserAdmin } from "../features/projects/projectsSlice";
import {FaEye, FaEdit, FaHistory} from 'react-icons/fa';
import EditTaskModal from "../components/EditTaskModal";
import ShowTaskDetailModal from "../components/ShowTaskDetailModal";
import ShowActivityModal from '../components/ShowActivityModal'

const columns = ['To Do', 'In Progress', 'Done'];

const KanbanBoard = ({ projectId }) => {
  const dispatch = useDispatch();
  const tasksByStatus = useSelector(state => state.task.tasksByStatus);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [activityTaskId, setActivityTaskId] = useState(null);

  const projectState = useSelector(state => state.project);
  const authState = useSelector(state => state.auth);

  const selectedProject = projectState?.selectedProject;
  const user = authState?.user;


//   console.log("Selected Project Members:", selectedProject?.members);
//   console.log("Current User ID:", user?._id);

  const isAdmin = useSelector(isUserAdmin);

  // Fetch tasks on project change
  useEffect(() => {
    dispatch(fetchTasksByProject(projectId));
  }, [projectId]);

  // Listen to real-time updates
  useEffect(() => {
    joinProject(projectId);

    return () => {
      leaveProject(projectId);
    };
  }, [projectId]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;

    try {
      const res = await axios.put(`/tasks/${draggableId}/move`, { status: newStatus });
      dispatch(updateTaskInState(res.data));
      emitTaskUpdated(projectId, res.data); // notify others
    } catch (err) {
      console.error('Drag failed:', err);
    }
  };

  return (
    <>
    <div className="grid grid-cols-3 gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <Droppable key={col} droppableId={col}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-gray-100 p-4 rounded shadow-md min-h-[500px] ${
                  snapshot.isDraggingOver ? 'bg-blue-100' : ''
                }`}
              >
                <h3 className="text-xl font-bold mb-3">{col}</h3>
                {tasksByStatus[col]?.map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-3 rounded shadow mb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{task.title}</h4>
                                <p className="text-sm text-gray-500">{task.assignedTo?.name}</p>
                              </div>
                              <div className="flex space-x-2 mt-1 text-gray-600">
                                <FaHistory className="text-gray-600 cursor-pointer hover:text-blue-600" title="Task History" onClick={() => setActivityTaskId(task._id)}/>
                                <FaEye className="cursor-pointer hover:text-blue-600" title="View Task" onClick={() => setViewTask(task)}/>
                                <FaEdit className="cursor-pointer hover:text-green-600" title="Edit Task" onClick={() => setEditingTask(task)}/>
                              </div>
                          </div> 
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
    <div>

    {viewTask && (
  <ShowTaskDetailModal task={viewTask} onClose={() => setViewTask(null)} />
    )}
 
    
    {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={(updatedTask) => {
          dispatch(updateTaskInState(updatedTask));
          emitTaskUpdated(projectId, updatedTask);
        }}
        />
      )}

      {activityTaskId && (
            <ShowActivityModal
                taskId={activityTaskId}
                onClose={() => setActivityTaskId(null)}
            />
        )}
    {isAdmin && (
      <div className="grid grid-cols-3 gap-4 mt-2">
        <button
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowAddModal(true)}
        >
          + Add Task
        </button>
      </div>
    )}

    {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}

  </div>
  </>
  );
};

export default KanbanBoard;
