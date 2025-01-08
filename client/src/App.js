import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './App.css'; // Import the CSS file

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Pending' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState({ title: '', description: '', status: '' });

  const API_URL = 'http://localhost:5000/tasks';

  // Fetch all tasks
  useEffect(() => {
    axios.get(API_URL)
      .then((res) => {
        console.log('Fetched tasks:', res.data);
        setTasks(res.data);
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const addTask = () => {
    console.log('Adding task:', newTask);
    axios.post(API_URL, newTask)
      .then((res) => {
        console.log('Task added:', res.data);
        setTasks([...tasks, res.data]);
        setNewTask({ title: '', description: '', status: 'Pending' });
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  // Update task
  const updateTask = (id, updatedTask) => {
    console.log('Updating task:', id, updatedTask);
    axios.put(`${API_URL}/${id}`, updatedTask)
      .then((res) => {
        console.log('Task updated:', res.data);
        setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
        setEditingTaskId(null);
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  // Delete a task
  const deleteTask = (id) => {
    console.log('Deleting task:', id);
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        console.log('Task deleted:', id);
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  // Filter tasks based on search query and filter status
  const filteredTasks = tasks.filter((task) => {
    return (
      (task.title && task.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === '' || task.status === filterStatus)
    );
  });

  return (
    <div className="app-container">
      <h1>Task List</h1>

      {/* Add Task Form */}
      <div className="prompt">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="sticky-note">
        {/* Search and Filter */}
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-header">
                <span className="task-bullet">•</span>
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    />
                    <div className="task-actions">
                      <select
                        value={editingTask.status}
                        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <button onClick={() => updateTask(task.id, editingTask)} className="save-button">
                        <FaSave />
                      </button>
                      <button onClick={() => setEditingTaskId(null)} className="cancel-button">
                        <FaTimes />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="task-title">
                      <strong>{task.title}</strong>
                    </div>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { ...task, status: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <button onClick={() => {
                        setEditingTaskId(task.id);
                        setEditingTask({ title: task.title, description: task.description, status: task.status });
                      }} className="edit-button">
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="delete-button">
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              ) : (
                <div className="task-content">
                  <span>{task.description}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;