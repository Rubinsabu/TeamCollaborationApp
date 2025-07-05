import React from 'react'
import { Droppable } from '@hello-pangea/dnd'

const Column = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef} className="bg-gray-200 p-4 flex-1 rounded">
        <h3 className="text-lg font-semibold">{status}</h3>
        {tasks.map((t, i) => <TaskCard key={t._id} task={t} index={i} />)}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
  )
}

export default Column