import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Folder,
  ListTodo,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ STATE
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // ✅ USER
  const user = JSON.parse(localStorage.getItem("user"));


  // ✅ FETCH ALL DATA
  const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // ================= TASKS =================
    const taskRes = await fetch("http://localhost:5000/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let taskData = [];
    if (taskRes.ok) {
      const data = await taskRes.json();
      if (Array.isArray(data)) taskData = data;
    }
    setTasks(taskData);

    // ================= PROJECTS =================
    const projectRes = await fetch("http://localhost:5000/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let projectData = [];
    if (projectRes.ok) {
      const data = await projectRes.json();
      if (Array.isArray(data)) projectData = data;
    }
    setProjects(projectData);

    // ================= USERS (FIXED) =================
    const userRes = await fetch("http://localhost:5000/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let userData = [];
    if (userRes.ok) {
      const data = await userRes.json();
      if (Array.isArray(data)) userData = data;
    }
    setUsers(userData);

  } catch (error) {
    console.error("Dashboard error:", error);
    setTasks([]);
    setProjects([]);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

  // ✅ LOAD
  useEffect(() => {
    fetchData();
  }, []);

  // 🌀 LOADING SCREEN
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen font-serif">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 px-8 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome back, {user?.name || "User"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's an overview of your team's progress today
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6"></div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-5 mb-8">

          <StatCard
            title="COMPLETED"
            value={tasks.filter(t => t.status === "Completed").length}
            color="bg-green-100 text-green-600"
            icon={CheckCircle}
          />

          <StatCard
            title="PENDING"
            value={tasks.filter(t => t.status === "Pending").length}
            color="bg-yellow-100 text-yellow-600"
            icon={Clock}
          />

          <StatCard
            title="OVERDUE"
            value="0"
            color="bg-red-100 text-red-600"
            icon={AlertTriangle}
          />

          <StatCard
            title="PROJECTS"
            value={projects.length}
            color="bg-yellow-200 text-yellow-700"
            icon={Folder}
          />

          <StatCard
            title="MY TASKS"
            value={tasks.length}
            color="bg-gray-200 text-gray-600"
            icon={ListTodo}
          />

          <StatCard
            title="TEAM MEMBERS"
            value={users.length}
            color="bg-purple-200 text-purple-600"
            icon={Users}
          />

        </div>

        {/* TASKS */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent tasks
          </h2>

          <span className="text-yellow-700 text-sm font-medium cursor-pointer hover:underline">
            View all →
          </span>
        </div>

        <div className="flex gap-4 flex-wrap">
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks yet</p>
          ) : (
            tasks.slice(0, 3).map((task) => (
              <TaskCard key={task._id} task={task} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}