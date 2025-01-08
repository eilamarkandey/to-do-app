const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Temporary data storage for tasks
let tasks = [];
let idCounter = 1; // Counter to assign unique IDs to tasks

// Endpoint to create a new task
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  const newTask = { id: idCounter++, title, description, status: status || 'Pending' };
  tasks.push(newTask); // Add new task to the tasks array
  res.status(201).json(newTask); // Respond with the created task
});

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks); // Respond with the list of all tasks
});

// Endpoint to update a task by ID
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const task = tasks.find((t) => t.id === parseInt(id)); // Find the task by ID
  if (task) {
    // Update task properties if provided
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    res.json(task); // Respond with the updated task
  } else {
    res.status(404).json({ message: 'Task not found' }); // Respond with an error if task not found
  }
});

// Endpoint to delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== parseInt(id)); // Remove the task from the tasks array
  res.status(204).send(); // Respond with no content status
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
