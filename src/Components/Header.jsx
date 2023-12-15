import { useEffect } from "react";
import { useState } from "react";
import { useDrag, useDrop } from 'react-dnd';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import './listTask.css';

export default function ListTask({ setTasks }) {
    const defaultTasks = [
        { id: uuidv4(), name: 'Task 1', description: 'Description for Task 1', createdDate: '2023-01-01', status: 'Priority: High' },
        { id: uuidv4(), name: 'Task 2', description: 'Description for Task 2', createdDate: '2023-01-02', status: 'Priority: Medium' },
        { id: uuidv4(), name: 'Task 3', description: 'Description for Task 3', createdDate: '2023-01-03', status: 'Priority: Low' },
    ];

    const [todos, setTodos] = useState(defaultTasks.filter((t) => t.status === 'Priority: High'));
    const [inProgress, setInProgress] = useState(defaultTasks.filter((t) => t.status === 'Priority: Medium'));
    const [done, setDone] = useState(defaultTasks.filter((t) => t.status === 'Priority: Low'));

    useEffect(() => {
        setTodos(defaultTasks.filter((t) => t.status === 'Priority: High'));
        setInProgress(defaultTasks.filter((t) => t.status === 'Priority: Medium'));
        setDone(defaultTasks.filter((t) => t.status === 'Priority: Low'));
    }, [defaultTasks]);

    const statuses = ['Priority: High', 'Priority: Medium', 'Priority: Low'];

    return (
        <div className="flex gap-16 md:gap-8 flex-wrap justify-center">
            {statuses.map((status, index) => (
                <Section status={status} key={index} todos={todos} inProgress={inProgress} done={done} setTasks={setTasks} />
            ))}
        </div>
    );
}

function Section({ status, todos, inProgress, done, setTasks }) {
    const text = status === 'Priority: High' ? 'Priority: High' : status === 'Priority: Medium' ? 'Priority: Medium' : 'Priority: Low';
    const bg = status === 'Priority: High' ? 'bg-red-500' : status === 'Priority: Medium' ? 'bg-yellow-500' : 'bg-green-500';
    const tasksToMap = status === 'Priority: High' ? todos : status === 'Priority: Medium' ? inProgress : done;
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item) => {
            setTasks((prev) => {
                const list = prev.map((task) => {
                    if (task.id === item.id) {
                        return { ...task, status };
                    }
                    return task;
                });
                localStorage.setItem('tasks', JSON.stringify(list));
                return list;
            });
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    const [taskFormOpen, setTaskFormOpen] = useState(false);

    const openTaskForm = () => {
        setTaskFormOpen(true);
    };

    const closeTaskForm = () => {
        setTaskFormOpen(false);
    };

    return (
        <div ref={drop} className={`w-64 rounded-md btnbg mt-2 border ${bg} ${isOver ? 'btnbg' : ''}`}>
            <Header text={text} count={tasksToMap.length} />
            <div className="p-4 bgbtn">
                {tasksToMap.map((task, index) => (
                    <Task task={task} key={index} setTasks={setTasks} />
                ))}
            </div>
            {taskFormOpen && (
                <TaskFormModal
                    onClose={closeTaskForm}
                    status={status}
                    setTasks={setTasks}
                />
            )}
        </div>
    );
}

function Header({ text, count }) {
    return (
        <div className={`bg-red-500 flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}>
            {text}{" "}
            <div className="ml-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-black">
                {count}
            </div>
        </div>
    );
}

function Task({ task, setTasks }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "task",
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div ref={drag} className={`relative flex items-center tskbox bg-zinc-200 p-4 mt-8 shadow-md rounded-lg cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
            <div className="box1">
                <p className="text-sm">{task.name}</p>
                <p className="text-xs text-gray-500">{task.createdDate}</p>
            </div>
            <div className="box2 ">
                <p className="text-xs text-gray-500">{task.description}</p>
                <i className="fas fa-trash ml-auto text-red-500 cursor-pointer " onClick={() => {
                    setTasks((prev) => {
                        const list = prev.filter((t) => t.id !== task.id);
                        localStorage.setItem('tasks', JSON.stringify(list));
                        toast('Task deleted successfully', { icon: <i className="fa-solid fa-bomb text-red-900 font-bold" />, className: "font-bold" });
                        return list;
                    });
                }}></i>
            </div>
        </div>
    );
}

function TaskFormModal({ onClose, status, setTasks }) {
    const [task, setTask] = useState({
        name: '',
        description: '',
        createdDate: '',
    });

    const handleAddTask = () => {
        if (!task.name) {
            toast('Task name is required', { icon: <i className="fa-solid fa-bomb text-red-900 font-bold" />, className: "font-bold" });
            return;
        }

        setTasks((prev) => {
            const newTask = {
                name: task.name,
                description: task.description,
                createdDate: task.createdDate,
                id: uuidv4(),
                status,
            };

            const list = [...prev, newTask];
            localStorage.setItem('tasks', JSON.stringify(list));
            return list;
        });

        setTask({
            name: '',
            description: '',
            createdDate: '',
        });

        toast.success('Task created successfully', { icon: <i className="fa-solid fa-party-horn text-green-900 font-bold" />, className: "font-bold" });

        onClose();
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Add Task"
            ariaHideApp={false}
        >
            <form onSubmit={handleAddTask} style={{ width: '50vw' }}>
                <label>
                    Task Name:
                    <input
                        type="text"
                        value={task.name}
                        onChange={(e) => setTask({ ...task, name: e.target.value })}
                    />
                </label>
                <label>
                    Task Description:
                    <textarea
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                    />
                </label>
                <label>
                    Created Date:
                    <input
                        type="text"
                        value={task.createdDate}
                        onChange={(e) => setTask({ ...task, createdDate: e.target.value })}
                    />
                </label>
                <button type="submit">Add Task</button>
            </form>
            <button onClick={onClose}>Close</button>
        </Modal>
    );
}
