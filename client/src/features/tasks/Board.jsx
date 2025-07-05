import React from 'react';
import Column from './Column';
import {DragDropContext} from '@hello-pangea/dnd'
import {useDispatch, useSelector} from 'react-redux';
import {fetchTasks, moveTask} from '../tasks/tasksSlice';

const Board = () => {
  const dispatch = useDispatch();
  const { tasksByStatus, currentProject } = useSelector(s => s.tasks);
  
  useEffect(() => { 
    
    if (currentProject) 
        dispatch(fetchTasks(currentProject));

   }, [currentProject]);

   const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      dispatch(moveTask({ 
        id: draggableId, 
        status: destination.droppableId, 
        projectId: currentProject 
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {['To Do','In Progress','Done'].map(status => (
          <Column key={status} status={status} tasks={tasksByStatus[status]} />
        ))}
      </div>
    </DragDropContext>
  )
}

export default Board