import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Plus, Folder } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function Projects() {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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

      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(`${API}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Fetch failed:", res.status);
        setProjects([]);
        return;
      }

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
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    fetchProjects();
  }, []);

  // ================= CREATE PROJECT =================
  const handleCreate = async () => {
    if (!form.name) {
      alert("Project name required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Failed to create project");
        return;
      }

      // refresh
      fetchProjects();

      setShowModal(false);
      setForm({
        name: "",
        description: "",
        color: "bg-yellow-500",
      });

    } catch (err) {
      console.error("Create error:", err);
      alert("Server error");
    }
  };

  // ================= UI =================
  return (
    <div className="flex bg-[#f8f9fb] min-h-screen font-serif">

      <Sidebar />

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
            className="flex items-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-lg hover:bg-yellow-800"
          >
            <Plus size={16} />
            New Project
          </button>
        </div>

        <div className="border-b border-gray-200 mb-6"></div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="border-2 border-dashed rounded-xl p-12 text-center text-gray-400 bg-white">
            <Folder size={40} className="mx-auto mb-3" />
            No projects yet
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p._id}
                className="bg-white p-5 rounded-xl border shadow-sm"
              >
                <div className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${p.color}`}>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white w-[420px] rounded-2xl p-6 relative shadow-xl">

              {/* CLOSE */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-lg"
              >
                ✕
              </button>

              {/* TITLE */}
              <h2 className="text-lg font-semibold mb-4">
                Create new project
              </h2>

              {/* NAME */}
              <label className="text-sm text-gray-600">Name</label>
              <input
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 mb-4 focus:ring-2 focus:ring-yellow-600 outline-none"
                placeholder="e.g. Q2 Marketing Campaign"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              {/* DESCRIPTION */}
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 mt-1 mb-4 focus:ring-2 focus:ring-yellow-600 outline-none"
                placeholder="Short summary..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              {/* COLORS */}
              <label className="text-sm text-gray-600">Color</label>
              <div className="flex gap-3 mt-2 mb-6">
                {[
                  "bg-yellow-600",
                  "bg-yellow-400",
                  "bg-green-500",
                  "bg-orange-500",
                  "bg-red-500",
                  "bg-purple-500",
                ].map((color) => (
                  <div
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${form.color === color ? "border-black" : "border-transparent"
                      } ${color}`}
                  ></div>
                ))}
              </div>

              {/* BUTTON */}
              <button
                onClick={handleCreate}
                className="w-full bg-yellow-700 hover:bg-yellow-800 text-white py-3 rounded-lg font-medium transition"
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