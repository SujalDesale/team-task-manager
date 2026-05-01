import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, Activity } from "lucide-react";

export default function Tasks() {

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "No project",
    assignee: "",
    priority: "Medium",
    status: "Pending",
    date: "",
  });

  const inputStyle =
    "w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-1 focus:ring-yellow-600";

  // ================= FETCH =================

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProjects(data);
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid response:", data);
        setTasks([]);
        return;
      }

      setTasks(data);

    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  // ================= CREATE =================
  const addTask = async () => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          projectId: selectedProject,
        }),
      });

      setShowModal(false);
      fetchTasks();

      setForm({
        title: "",
        description: "",
        project: "No project",
        assignee: "",
        priority: "Medium",
        status: "Pending",
        date: "",
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE =================
  const updateTask = async (field, value) => {
    const updated = { ...selectedTask, [field]: value };
    setSelectedTask(updated);

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });

      fetchTasks();

    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE =================
  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/tasks/${selectedTask._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedTask(null);
      fetchTasks();

    } catch (err) {
      console.error(err);
    }
  };


  const filterTasks = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen font-serif">
      <Sidebar />

      <div className="flex-1 px-8 py-6">

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
            <p className="text-gray-500 text-sm mt-1">
              Track progress across your team
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={16} /> New Task
          </button>
        </div>

        <div className="border-b mb-6"></div>

        {/* BOARD */}
        <div className="grid grid-cols-3 gap-6">
          {["Pending", "In progress", "Completed"].map((status) => (
            <div key={status}>
              <h2 className="text-xs text-gray-400 mb-3">
                {status.toUpperCase()} ({filterTasks(status).length})
              </h2>

              <div className="space-y-4">
                {filterTasks(status).map((task, i) => (
                  <div
                    key={task._id}
                    onClick={() => setSelectedTask(task)}
                    className="bg-white p-4 rounded-xl border cursor-pointer"
                  >
                    <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded">
                      {task.priority}
                    </span>

                    <h3 className="font-semibold mt-2">{task.title}</h3>

                    <p className="text-sm text-gray-500">
                      {task.description}
                    </p>

                    <p className="text-xs text-yellow-600 mt-2">
                      {task.projectId?.name || "No Project"}
                    </p>

                    <div className="flex justify-between text-xs mt-3">
                      <span>{task.assignee}</span>
                      <span>{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================= CREATE TASK ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[650px] rounded-2xl p-7 shadow-xl relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 border rounded-full w-8 h-8 flex items-center justify-center text-yellow-700 hover:bg-yellow-50"
            >
              ✕
            </button>

            {/* TITLE */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Create task
            </h2>

            {/* TITLE INPUT */}
            <div className="mb-5">
              <p className="text-xs tracking-widest text-gray-400 mb-1">
                TITLE
              </p>
              <input
                placeholder="What needs to be done?"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-yellow-600 outline-none"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-5">
              <p className="text-xs tracking-widest text-gray-400 mb-1">
                DESCRIPTION
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 h-24 focus:ring-1 focus:ring-yellow-600 outline-none"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* PROJECT + ASSIGNEE */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-1">
                  PROJECT
                </p>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-yellow-600"
                  value={selectedProject}
                  onChange={(e) =>
                    setSelectedProject(e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-1">
                  ASSIGNEE
                </p>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-yellow-600"
                  value={form.assignee}
                  onChange={(e) =>
                    setForm({ ...form, assignee: e.target.value })
                  }
                >
                  <option value="">Select member</option>
                  {members.map((m) => (
                    <option key={m._id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PRIORITY + STATUS */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-1">
                  PRIORITY
                </p>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-yellow-600"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-1">
                  STATUS
                </p>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-yellow-600"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Pending</option>
                  <option>In progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            {/* DATE */}
            <div className="mb-6">
              <p className="text-xs tracking-widest text-gray-400 mb-1">
                DUE DATE
              </p>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-yellow-600"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                onClick={addTask}
                className="bg-yellow-700 text-white px-6 py-2 rounded-lg hover:bg-yellow-800 transition"
              >
                Create task
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ================= TASK DETAILS ================= */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[750px] rounded-2xl p-6 shadow-xl relative">

            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 border rounded-full w-8 h-8 flex items-center justify-center text-yellow-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6">
              {selectedTask.title}
            </h2>

            <div className="grid grid-cols-2 gap-8">

              {/* LEFT SIDE */}
              <div>

                <p className="text-xs tracking-widest text-gray-400 mb-2">
                  DESCRIPTION
                </p>

                <textarea
                  value={selectedTask.description}
                  onChange={(e) =>
                    updateTask("description", e.target.value)
                  }
                  className={`${inputStyle} h-28`}
                />

                <p className="text-xs tracking-widest text-gray-400 mt-6 mb-2">
                  COMMENTS (0)
                </p>

                <p className="text-sm text-gray-400 mb-3">
                  No comments yet
                </p>

                <div className="flex gap-2">
                  <input
                    placeholder="Write a comment..."
                    className={`${inputStyle} text-sm`}
                  />
                  <button className="bg-yellow-700 text-white px-3 rounded-lg">
                    ➤
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="space-y-5">

                {/* STATUS */}
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    STATUS
                  </p>
                  <select
                    value={selectedTask.status}
                    onChange={(e) =>
                      updateTask("status", e.target.value)
                    }
                    className={inputStyle}
                  >
                    <option>Pending</option>
                    <option>In progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                {/* PRIORITY */}
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    PRIORITY
                  </p>

                  <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded mb-1 inline-block">
                    {selectedTask.priority}
                  </span>

                  <select
                    value={selectedTask.priority}
                    onChange={(e) =>
                      updateTask("priority", e.target.value)
                    }
                    className={`${inputStyle} mt-1`}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                {/* ASSIGNEE */}
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    ASSIGNEE
                  </p>
                  <select
                    value={selectedTask.assignee}
                    onChange={(e) =>
                      updateTask("assignee", e.target.value)
                    }
                    className={inputStyle}
                  >
                    {members.map((m) => (
                      <option key={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* DATE */}
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    DUE DATE
                  </p>
                  <input
                    type="date"
                    value={selectedTask.date}
                    onChange={(e) =>
                      updateTask("date", e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>

                {/* ACTIVITY */}
                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                    <Activity size={14} />
                    ACTIVITY
                  </p>
                  {selectedTask.activity?.length === 0 ? (
                    <p className="text-sm text-gray-400">No activity yet</p>
                  ) : (
                    selectedTask.activity.map((act, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-sm text-gray-600">
                          • {act.user} {act.action}
                        </p>
                        <p className="text-xs text-gray-400 ml-3">
                          {new Date(act.time).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* DELETE */}
                <button
                  onClick={deleteTask}
                  className="w-full border border-red-300 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete task
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}