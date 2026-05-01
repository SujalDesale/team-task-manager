import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, Activity } from "lucide-react";

export default function Tasks() {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [tasks, setTasks] = useState([
    {
      title: "Frontend",
      description: "Complete Frontend of the website",
      status: "Pending",
      priority: "High",
      assignee: "Demo Member",
      date: "2026-05-01",
      project: "Building website",
    },
  ]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "No project",
    assignee: "Unassigned",
    priority: "Medium",
    status: "Pending",
    date: "",
  });

  const addTask = () => {
    setTasks([...tasks, form]);
    setShowModal(false);
    setForm({
      title: "",
      description: "",
      project: "No project",
      assignee: "Unassigned",
      priority: "Medium",
      status: "Pending",
      date: "",
    });
  };

  const updateTask = (field, value) => {
    setSelectedTask({ ...selectedTask, [field]: value });

    setTasks(
      tasks.map((t) =>
        t === selectedTask ? { ...selectedTask, [field]: value } : t
      )
    );
  };

  const deleteTask = () => {
    setTasks(tasks.filter((t) => t !== selectedTask));
    setSelectedTask(null);
  };

  const filterTasks = (status) =>
    tasks.filter((t) => t.status === status);

  const inputStyle =
    "w-full border rounded-lg p-2 outline-none focus:ring-1 focus:ring-yellow-600";

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen font-serif">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 px-8 py-6">

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Tasks
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track progress across your team
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* LINE */}
        <div className="border-b border-gray-200 mb-6"></div>

        {/* BOARD */}
        <div className="grid grid-cols-3 gap-6">

          {["Pending", "In progress", "Completed"].map((status) => (
            <div key={status}>

              <h2 className="text-xs tracking-widest text-gray-400 mb-3">
                {status.toUpperCase()} ({filterTasks(status).length})
              </h2>

              <div className="space-y-4">
                {filterTasks(status).length === 0 ? (
                  <div className="border-2 border-dashed p-6 text-center text-gray-400 rounded-xl bg-white">
                    No tasks
                  </div>
                ) : (
                  filterTasks(status).map((task, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white p-4 rounded-xl border shadow-sm cursor-pointer"
                    >
                      <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded">
                        {task.priority}
                      </span>

                      <h3 className="font-semibold mt-2 text-gray-800">
                        {task.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>

                      <div className="flex justify-between text-xs text-gray-400 mt-4 border-t pt-2">
                        <span>{task.assignee}</span>
                        <span>{task.date}</span>
                      </div>

                      <p className="text-xs text-yellow-700 mt-2">
                        • {task.project}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CREATE TASK ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[520px] rounded-xl p-6 shadow-lg relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">Create task</h2>

            <input
              placeholder="What needs to be done?"
              className={inputStyle}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className={`${inputStyle} mt-3 h-24`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <select className={inputStyle}>
                <option>No project</option>
              </select>

              <select className={inputStyle}>
                <option>Unassigned</option>
                <option>Demo Member</option>
              </select>

              <select className={inputStyle}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <select className={inputStyle}>
                <option>Pending</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </div>

            <input type="date" className={`${inputStyle} mt-4`} />

            <button
              onClick={addTask}
              className="w-full mt-4 bg-yellow-700 text-white py-2 rounded-lg hover:bg-yellow-800 transition"
            >
              Create task
            </button>
          </div>
        </div>
      )}

      {/* ================= TASK DETAILS ================= */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white w-[650px] rounded-xl p-6 shadow-lg relative">

            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-4 right-4 border rounded-full w-7 h-7 flex items-center justify-center text-yellow-700"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6">
              {selectedTask.title}
            </h2>

            <div className="grid grid-cols-2 gap-6">

              {/* LEFT */}
              <div>
                <p className="text-xs tracking-widest text-gray-400 mb-2">
                  DESCRIPTION
                </p>

                <textarea
                  value={selectedTask.description}
                  onChange={(e) => updateTask("description", e.target.value)}
                  className={`${inputStyle} h-28`}
                />

                <p className="text-xs tracking-widest text-gray-400 mt-6 mb-2">
                  COMMENTS (0)
                </p>

                <p className="text-sm text-gray-400 mb-2">
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

              {/* RIGHT */}
              <div className="space-y-4">

                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    STATUS
                  </p>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => updateTask("status", e.target.value)}
                    className={inputStyle}
                  >
                    <option>Pending</option>
                    <option>In progress</option>
                    <option>Completed</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    PRIORITY
                  </p>

                  <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded">
                    {selectedTask.priority}
                  </span>

                  <select
                    value={selectedTask.priority}
                    onChange={(e) => updateTask("priority", e.target.value)}
                    className={`${inputStyle} mt-1`}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    ASSIGNEE
                  </p>
                  <select
                    value={selectedTask.assignee}
                    onChange={(e) => updateTask("assignee", e.target.value)}
                    className={inputStyle}
                  >
                    <option>Demo Member</option>
                  </select>
                </div>

                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-1">
                    DUE DATE
                  </p>
                  <input
                    type="date"
                    value={selectedTask.date}
                    onChange={(e) => updateTask("date", e.target.value)}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <p className="text-xs tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                    <Activity size={14} />
                    ACTIVITY
                  </p>

                  <p className="text-sm text-gray-500">
                    <span className="text-yellow-600 mr-2">•</span>
                    Admin created — created this task
                  </p>

                  <p className="text-xs text-gray-400 ml-4">
                    4/30/2026, 8:30 PM
                  </p>
                </div>

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