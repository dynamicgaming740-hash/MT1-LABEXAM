import express from "express";

const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Log incoming requests in terminal for debugging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Initial sample employee tasks
let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High",
  },
  {
    id: 2,
    taskName: "Database Schema Design",
    assignedTo: "Priya Singh",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 3,
    taskName: "Write Unit Tests",
    assignedTo: "Aman Verma",
    status: "Completed",
    priority: "Medium",
  },
];

// Root endpoint so visiting http://localhost:4000 doesn't throw 404
app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      'Express Server is running. Visit <a href="/tasks">/tasks</a> to view all tasks.',
    );
});

// GET /tasks - Retrieve all tasks
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// GET /tasks/:id - Retrieve a task by ID
app.get("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res
      .status(404)
      .json({ message: `Task with id ${taskId} not found` });
  }

  res.status(200).json(task);
});

// POST /tasks - Add a new task
app.post("/tasks", (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (!id || !taskName || !assignedTo || !status) {
    return res.status(400).json({
      message:
        "Validation Error: id, taskName, assignedTo, and status are required.",
    });
  }

  const newTask = {
    id: Number(id),
    taskName,
    assignedTo,
    status,
    priority: priority || "Medium",
  };

  tasks.push(newTask);
  res.status(201).json({
    message: "Task added successfully",
    task: newTask,
  });
});

// PUT /tasks/:id - Update an existing task
app.put("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res
      .status(404)
      .json({ message: `Task with id ${taskId} not found` });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    id: taskId, // Ensure ID remains intact
  };

  res.status(200).json({
    message: "Task updated successfully",
    task: tasks[taskIndex],
  });
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === taskId);

  if (taskIndex === -1) {
    return res
      .status(404)
      .json({ message: `Task with id ${taskId} not found` });
  }

  tasks.splice(taskIndex, 1);
  res
    .status(200)
    .json({ message: `Task with id ${taskId} deleted successfully` });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Route ${req.originalUrl} not found on port ${PORT}` });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
