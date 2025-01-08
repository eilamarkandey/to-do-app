const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Temporary data storage
let tasks = [];
let idCounter = 1;

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  const newTask = { id: idCounter++, title, description, status: status || 'Pending' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const task = tasks.find((t) => t.id === parseInt(id));
  if (task) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== parseInt(id));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
