import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./models/User.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    /vercel\.app$/
  ],
  credentials: true
}));

const JWT_SECRET = process.env.JWT_SECRET;

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));


// ================= AUTH MIDDLEWARE =================
const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ msg: "No token" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};


// ================= AUTH ROUTES =================

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashed });

    res.json({ msg: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= PROJECT ROUTES =================

// CREATE PROJECT
app.post("/projects", auth, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      userId: req.user.id,
    });

    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
});

// GET PROJECTS
app.get("/projects", auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });

    const projectsWithCount = await Promise.all(
      projects.map(async (p) => {
        const count = await Task.countDocuments({
          projectId: p._id,
        });

        return {
          ...p.toObject(),
          taskCount: count,
        };
      })
    );

    res.json(projectsWithCount);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

// DELETE PROJECT
app.delete("/projects/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: "Project deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting project" });
  }
});


// ================= TASK ROUTES =================

// CREATE TASK (ADD ACTIVITY)
app.post("/tasks", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const task = await Task.create({
      ...req.body,
      userId: req.user.id,
      activity: [
        {
          action: "created task",
          user: user.name,
          time: new Date(),
        },
      ],
    });

    res.json(task);

  } catch (err) {
    res.status(500).json({ msg: "Error creating task" });
  }
});

// GET TASKS
app.get("/tasks", auth, async (req, res) => {
  try {
    // const tasks = await Task.find({ userId: req.user.id })
    //   .populate("projectId", "name");

    const tasks = await Task.find()
      .populate("projectId", "name");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
});

// DELETE TASK
app.delete("/tasks/:id", auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting task" });
  }
});

// UPDATE TASK 
app.put("/tasks/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    let activityLogs = [];

    // ✅ STATUS CHANGE
    if (req.body.status && req.body.status !== task.status) {
      activityLogs.push({
        action: `changed status from ${task.status} to ${req.body.status}`,
        user: user.name,
        time: new Date(),
      });
    }

    // ✅ PRIORITY CHANGE
    if (req.body.priority && req.body.priority !== task.priority) {
      activityLogs.push({
        action: `changed priority from ${task.priority} to ${req.body.priority}`,
        user: user.name,
        time: new Date(),
      });
    }

    // ✅ ASSIGNEE CHANGE
    if (req.body.assignee && req.body.assignee !== task.assignee) {
      activityLogs.push({
        action: `changed assignee to ${req.body.assignee}`,
        user: user.name,
        time: new Date(),
      });
    }

    // ✅ APPLY UPDATE
    Object.assign(task, req.body);

    // ✅ PUSH ACTIVITY
    if (!task.activity) task.activity = [];
    task.activity.push(...activityLogs);

    await task.save();

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating task" });
  }
});

// ================= TEAM ROUTES =================

// GET USERS
app.get("/users", auth, async (req, res) => {
  const users = await User.find({}, "name email role");
  res.json(users);
});

// ADD MEMBER
app.post("/users", auth, async (req, res) => {
  const { name, email, password, role } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || "Member",
  });

  res.json(user);
});

// DELETE MEMBER
app.delete("/users/:id", auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

// UPDATE ROLE
app.put("/users/:id", auth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true }
  );

  res.json(updated);
});


// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});