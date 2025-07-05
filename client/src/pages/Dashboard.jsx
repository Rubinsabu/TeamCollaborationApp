import React from 'react'
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';
import KanbanBoard from './KanbanBoard';

const Dashboard = () => {
    const {selectedProject} = useSelector((state)=> state.project);

  return (
    <div className="flex h-[calc(100vh-56px)]"> {/* minus navbar height */}
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {selectedProject ? (
            <KanbanBoard projectId={selectedProject._id} />
            ) : (
            <div className="text-center mt-20 text-gray-500 text-lg">Select a project to view board</div>
            )}
      </main>
    </div>
  )
}

export default Dashboard