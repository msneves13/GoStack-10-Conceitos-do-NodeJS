const express = require("express");

const server = express();

const projects = [];

server.use(express.json());

server.use(functionCounter);

function functionCounter(_req, _res, next) {
  console.count('Requisitions');
  return next();
}

function checkIfExists(req, res, next) {
  const { id } = req.params;
  const exists = projects.some(p => p.id === id);
  if (!exists) {
    return res.json({ error: "Id not found." });
  }
  return next();
}

server.get("/projects", (_req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkIfExists, (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  return res.json(project);
});

server.post("/projects/", (req, res) => {
  const project = ({ id, title } = req.body);
  project.tasks = [];
  projects.push(project);
  return res.json(project);
});

server.post("/projects/:id/tasks", checkIfExists, (req, res) => {
  const { id, title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.json(project);
});

server.put("/projects/:id", checkIfExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkIfExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex, 1);
  return res.send();
});

server.listen(3000);
