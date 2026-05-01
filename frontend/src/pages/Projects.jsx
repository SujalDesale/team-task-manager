import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Folder } from "lucide-react";

export default function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "bg-yellow-500",
  });

  const user = JSON.parse(localStorage.getItem("user"));


  // ================= FETCH PROJECTS =================
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid response:", data);
        setProjects([]);
        return;
      }

      setProjects(data);

    } catch (err) {
      console.error("Fetch error:", err);
      setProjects([]);
    }
  };

  // ================= LOAD ON START =================
  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= CREATE PROJECT =================
  const handleCreate = async () => {
    if (!form.name) return;

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      // refresh list
      fetchProjects();

      setShowModal(false);
      setForm({ name: "", description: "", color: "bg-yellow-500" });

    } catch (err) {
      console.error("Create error:", err);
    }
  };

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
              Projects
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Group related tasks and track team progress
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800 transition"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        {/* SEPARATOR LINE */}
        <div className="border-b border-gray-200 mb-6"></div>

        {/* CONTENT */}
        {projects.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-gray-400 bg-white">
            <Folder size={40} className="mx-auto mb-3" />
            No projects yet. Create your first project to organize tasks.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p._id}
                className="bg-white p-5 rounded-xl border shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${p.color}`}
                >
                  <Folder size={18} className="text-white" />
                </div>

                <h2 className="font-semibold text-lg text-gray-800">
                  {p.name}
                </h2>

                <p className="text-gray-500 text-sm mb-4">
                  {p.description}
                </p>

                <div className="flex justify-between text-xs text-gray-400 border-t pt-3">
                  <span>{p.taskCount || 0} tasks</span>
                  <span>by {user?.name || "you"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[400px] rounded-xl p-6 relative shadow-lg">

              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-black"
              >
                ✕
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Create new project
              </h2>

              {/* NAME */}
              <label className="text-sm">Name</label>
              <input
                className="w-full border rounded-lg p-2 mt-1 mb-3 focus:outline-none focus:ring-1 focus:ring-yellow-600"
                placeholder="e.g. Q2 Marketing Campaign"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              {/* DESCRIPTION */}
              <label className="text-sm">Description</label>
              <textarea
                className="w-full border rounded-lg p-2 mt-1 mb-4 focus:outline-none focus:ring-1 focus:ring-yellow-600"
                placeholder="Short summary..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* COLORS */}
              <label className="text-sm">Color</label>
              <div className="flex gap-3 mt-2 mb-4">
                {[
                  "bg-yellow-600",
                  "bg-yellow-400",
                  "bg-green-500",
                  "bg-orange-500",
                  "bg-red-500",
                  "bg-purple-500",
                ].map((c) => (
                  <div
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-8 h-8 rounded-full cursor-pointer ${c} border ${form.color === c ? "border-black" : "border-transparent"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-yellow-700 text-white py-2 rounded-lg hover:bg-yellow-800 transition"
              >
                Create project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}