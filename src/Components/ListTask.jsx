import { useEffect } from "react";
import { useState } from "react";
import { useDrag, useDrop } from 'react-dnd';
import toast from 'react-hot-toast';
import './listTask.css';

export default function ListTask({ tasks, setTasks }) {
    const [todos, setTodos] = useState(tasks.filter((t) => t.status === 'todo'));
    const [inProgress, setInProgress] = useState(tasks.filter((t) => t.status === 'progress'));
    const [done, setDone] = useState(tasks.filter((t) => t.status === 'done'));

    useEffect(() => {
        setTodos(tasks.filter((t) => t.status === 'todo'));
        setInProgress(tasks.filter((t) => t.status === 'progress'));
        setDone(tasks.filter((t) => t.status === 'done'));
    }, [tasks]);

    const statuses = ['todo', 'progress', 'done'];

    return (
        <div className="flex gap-16 md:gap-8 flex-wrap justify-center ">
            {statuses.map((status, index) => (
                <Section status={status} key={index} tasks={tasks} setTasks={setTasks} todos={todos} inProgress={inProgress} done={done} />
            ))}
        </div>
    );
}

function Section({ status, tasks, setTasks, todos, inProgress, done }) {
    const text = status === 'todo' ? 'To Do' : status === 'progress' ? 'In Progress' : 'Done';
    const bg = status === 'todo' ? 'bg-red-500' : status === 'progress' ? 'bg-yellow-500' : 'bg-green-500';
    const tasksToMap = status === 'todo' ? todos : status === 'progress' ? inProgress : done;
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
            <Header text={text} count={tasksToMap.length} className='btnbg bord' />
            <div className="p-4 bgbtn" >
                {tasksToMap.map((task, index) => (
                    <Task task={task} tasks={tasks} setTasks={setTasks} key={index} />
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

function Header({ text, bg, count }) {
    return (
        <div className={`${bg} flex items-center h-12 pl-4 rounded-md uppercase text-sm text-white`}>
            {text}{" "}
            <div className="ml-2 bg-white rounded-full w-6 h-6 flex items-center justify-center text-black">
                {count}
            </div>
        </div>
    );
}

function Task({ task, tasks, setTasks }) {
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