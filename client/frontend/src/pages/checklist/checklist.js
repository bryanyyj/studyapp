import React, { useState, useEffect } from 'react';
import './checklist.css';

const Checklist = () => {
    const [pendingTasks, setPendingTasks] = useState([
        { id: 1, title: 'Cook a healthy meal every other day', category: 'eat-healthy', completed: false },
        { id: 2, title: 'Go out for a 30 minutes walk every day', category: 'get-in-shape', completed: false },
        { id: 3, title: 'Read a self-improvement book every month', category: 'personal-growth', completed: false },
        { id: 4, title: 'Organize a new activity every week for my family', category: 'family', completed: false },
        { id: 5, title: 'Read a new field-related article every week', category: 'career', completed: false },
        { id: 6, title: 'Get rid of unnecessary expenses', category: 'finances', completed: false },
        { id: 7, title: 'Learn to draw', category: 'hobby', completed: false },
    ]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [taskBeingEdited, setTaskBeingEdited] = useState(null);
    const [pendingCollapsed, setPendingCollapsed] = useState(false);
    const [completedCollapsed, setCompletedCollapsed] = useState(false);

    const categoryDisplayMap = {
        'eat-healthy': 'EAT HEALTHY',
        'get-in-shape': 'GET IN SHAPE',
        'personal-growth': 'PERSONAL GROWTH',
        'family': 'FAMILY',
        'career': 'MASTER MY CAREER',
        'finances': 'HEALTHY FINANCES',
        'hobby': 'LEARN A HOBBY',
    };

    const categoryEmojiMap = {
        'eat-healthy': '🍽️',
        'get-in-shape': '🚶',
        'personal-growth': '📚',
        'family': '🎯',
        'career': '📖',
        'finances': '🏆',
        'hobby': '✏️',
    };

    useEffect(() => {
        const currentDate = new Date();
        const options = { weekday: 'long', day: 'numeric' };
        document.querySelector('.date').textContent = currentDate.toLocaleDateString('en-US', options);
    }, []);

    const toggleTaskCompletion = (task) => {
        if (task.completed) {
            setPendingTasks([...pendingTasks, { ...task, completed: false }]);
            setCompletedTasks(completedTasks.filter((t) => t.id !== task.id));
        } else {
            setCompletedTasks([...completedTasks, { ...task, completed: true }]);
            setPendingTasks(pendingTasks.filter((t) => t.id !== task.id));
        }
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        const taskName = e.target.taskName.value.trim();
        const taskCategory = e.target.taskCategory.value;

        if (taskName) {
            const newTask = {
                id: Date.now(),
                title: taskName,
                category: taskCategory,
                completed: false,
            };
            setPendingTasks([...pendingTasks, newTask]);
            setShowAddModal(false);
        }
    };

    const handleEditTask = (e) => {
        e.preventDefault();
        const taskName = e.target.editTaskName.value.trim();
        const taskCategory = e.target.editTaskCategory.value;

        if (taskBeingEdited) {
            const updatedTasks = pendingTasks.map((task) =>
                task.id === taskBeingEdited.id
                    ? { ...task, title: taskName, category: taskCategory }
                    : task
            );
            setPendingTasks(updatedTasks);
            setShowEditModal(false);
            setTaskBeingEdited(null);
        }
    };

    const openEditModal = (task) => {
        setTaskBeingEdited(task);
        setShowEditModal(true);
    };

    return (
        <div className="container">
            <header>
                <h1 className="title">MY DAY</h1>
                <p className="pending-counter">{pendingTasks.length} PENDING TASKS</p>
                <p className="date"></p>
            </header>

            <div className={`section-title collapsible ${pendingCollapsed ? 'collapsed' : ''}`} onClick={() => setPendingCollapsed(!pendingCollapsed)}>
                <span>INCOMPLETE TASKS</span>
                <span className="dropdown-arrow">▼</span>
            </div>

            <div className={`section-content ${pendingCollapsed ? 'collapsed' : ''}`}>
                <ul className="tasks">
                    {pendingTasks.map((task) => (
                        <li key={task.id} className="task-item" data-category={task.category}>
                            <div className={`task-icon ${task.category}`}>{categoryEmojiMap[task.category]}</div>
                            <div className="task-content">
                                <h3 className="task-title">{task.title}</h3>
                                <p className={`task-category ${task.category}-text`}>{categoryDisplayMap[task.category]}</p>
                            </div>
                            <div className="task-actions">
                                <div className="edit-button" onClick={() => openEditModal(task)}>✏️</div>
                                <div className={`checkmark ${task.completed ? 'completed' : ''}`} onClick={() => toggleTaskCompletion(task)}></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={`section-title collapsible completed-section ${completedCollapsed ? 'collapsed' : ''}`} onClick={() => setCompletedCollapsed(!completedCollapsed)}>
                <span>COMPLETED TASKS</span>
                <span id="completed-counter">{completedTasks.length}</span>
                <span className="dropdown-arrow">▼</span>
            </div>

            <div className={`section-content ${completedCollapsed ? 'collapsed' : ''}`}>
                <ul className="tasks">
                    {completedTasks.map((task) => (
                        <li key={task.id} className="task-item" data-category={task.category}>
                            <div className={`task-icon ${task.category}`}>{categoryEmojiMap[task.category]}</div>
                            <div className="task-content">
                                <h3 className="task-title">{task.title}</h3>
                                <p className={`task-category ${task.category}-text`}>{categoryDisplayMap[task.category]}</p>
                            </div>
                            <div className="task-actions">
                                <div className="edit-button" onClick={() => openEditModal(task)}>✏️</div>
                                <div className={`checkmark ${task.completed ? 'completed' : ''}`} onClick={() => toggleTaskCompletion(task)}></div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="add-button" onClick={() => setShowAddModal(true)}>+</div>

            {showAddModal && (
                <div className="modal active">
                    <div className="modal-content">
                        <h2>Add New Task</h2>
                        <form onSubmit={handleAddTask}>
                            <div className="form-group">
                                <label htmlFor="task-name">Task Name:</label>
                                <input type="text" id="task-name" name="taskName" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="task-category">Category:</label>
                                <select id="task-category" name="taskCategory" required>
                                    {Object.keys(categoryDisplayMap).map((key) => (
                                        <option key={key} value={key}>{categoryDisplayMap[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit">Add Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && taskBeingEdited && (
                <div className="modal active">
                    <div className="modal-content">
                        <h2>Edit Task</h2>
                        <form onSubmit={handleEditTask}>
                            <div className="form-group">
                                <label htmlFor="edit-task-name">Task Name:</label>
                                <input type="text" id="edit-task-name" name="editTaskName" defaultValue={taskBeingEdited.title} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="edit-task-category">Category:</label>
                                <select id="edit-task-category" name="editTaskCategory" defaultValue={taskBeingEdited.category} required>
                                    {Object.keys(categoryDisplayMap).map((key) => (
                                        <option key={key} value={key}>{categoryDisplayMap[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowEditModal(false)}>Cancel</button>
                                <button type="submit">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checklist;