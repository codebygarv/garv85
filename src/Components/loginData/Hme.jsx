// App.js
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster } from 'react-hot-toast';
import CreateTask from '../CreateTask';
import ListTask from '../ListTask';
import Sidebar from '../Sidebar';
import Header from '../Header';

function Hme() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('tasks')) || []);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster toastOptions={{ duration: 3000 }} />
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <div className="w-full h-full p-6">
              <h1 className="text-4xl font-bold text-slate-700">To-Do Application</h1>
              <p className="text-slate-500" style={{marginTop:'15px'}}>You can also use Drag and Drop Feature to move tasks To change the Priority</p>
              <CreateTask tasks={tasks} setTasks={setTasks} />
              <ListTask tasks={tasks} setTasks={setTasks} />
            </div>
          </main>
        </div>

      </div>
    </DndProvider>
  );
}

export default Hme;
