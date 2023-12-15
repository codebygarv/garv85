import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';
import Modal from 'react-modal';
import './CreateTask.css'

export default function CreateTask({ tasks, setTasks }) {
    const [task, setTask] = useState({
        name: '',
        description: '',
        createdDate: '',
        id: '',
        status: 'todo',
    });

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleAddTask = () => {
        if (!task.name) {
            toast('Task name is required', { icon: <i className="fa-solid fa-bomb text-red-900 font-bold" />, className: "font-bold" });
            return;
        }

        setTasks((prev) => {
            const list = [...prev, task];
            localStorage.setItem('tasks', JSON.stringify(list));
            return list;
        });

        setTask({
            name: '',
            description: '',
            createdDate: '',
            id: '',
            status: 'todo',
        });

        toast.success('Task created successfully', { icon: <i className="fa-solid fa-party-horn text-green-900 font-bold" onClick={openModal} />, className: "font-bold" });

        closeModal();
    };

    return (
        <>
            <button className="bg-indigo-500 rounded-md px-4 h-12 text-white btnbg" onClick={openModal} style={{ backgroundColor: 'hsl(233deg 36% 38%);' }}>
                Add Task
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add Task"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        width: '40vw',
                        height: 'fit-content',
                        margin: 'auto',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                    input: {
                        outline: 'none',
                        border: 'none',
                        width: '100 %',
                    },

                }}
            >
                <form onSubmit={handleAddTask}>
                    <label className="block mb-4 input-1">
                        Task Name:
                        <input 
                            type="text"
                            className="w-full p-2 border rounded mt-2 input-1"
                            value={task.name}
                            onChange={(e) => setTask({ ...task, name: e.target.value, id: uuidv4() })}
                            required
                        />
                    </label>
                    <label className="block mb-4 input-2">
                        Task Description:
                        <textarea
                            className="w-full p-2 border rounded mt-2"
                            value={task.description}
                            onChange={(e) => setTask({ ...task, description: e.target.value })}
                            required
                        />
                    </label>
                    <label className="block mb-4 input-3">
                        Created Date:
                        <input
                            type="date"
                            className="w-full p-2 border rounded mt-2"
                            value={task.createdDate}
                            onChange={(e) => setTask({ ...task, createdDate: e.target.value })}
                            required
                        />
                    </label>
                    <button className="bg-indigo-500 text-white p-2 rounded btnbg" type="submit" style={{ backgroundColor: 'hsl(233deg 36% 38%);' }}>
                        Add Task
                    </button>
                </form>
                <button className="mt-4 bg-gray-500 text-white p-2 rounded" onClick={closeModal}>
                    Close
                </button>
            </Modal>
        </>
    );
}