import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

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

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Route: / (HTML Welcome message)
  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Employee Task Management System</h1>");
  }

  // Route: /about (Application info)
  else if (url === "/about" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(
      "Employee Task Management Application - Manage, track, and assign company tasks.",
    );
  }

  // Route: /tasks (GET all tasks)
  else if (url === "/tasks" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(tasks));
  }

  // Route: /home (Serve HTML using FS module)
  else if (url === "/home" && method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error: Unable to read file.");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }

  // Route: /add-task (POST new task)
  else if (url === "/add-task" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newTask = JSON.parse(body);

        // Validation for required fields
        if (
          !newTask.id ||
          !newTask.taskName ||
          !newTask.assignedTo ||
          !newTask.status
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message:
                "Validation Error: id, taskName, assignedTo, and status are required.",
            }),
          );
          return;
        }

        tasks.push(newTask);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Task added successfully",
            task: newTask,
          }),
        );
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON format." }));
      }
    });
  }

  
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found: The requested route does not exist.");
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
