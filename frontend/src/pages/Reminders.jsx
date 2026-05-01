import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { AlertTriangle, Clock, Bell } from "lucide-react";

export default function Reminders() {

  const [overdueTasks, setOverdueTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // ================= FETCH TASKS =================
  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!Array.isArray(data)) return;

      const today = new Date();
      const next3Days = new Date();
      next3Days.setDate(today.getDate() + 3);

      const overdue = [];
      const upcoming = [];

      data.forEach((task) => {
        if (!task.date) return;

        const dueDate = new Date(task.date);

        if (dueDate < today && task.status !== "Completed") {
          overdue.push(task);
        }

        if (
          dueDate >= today &&
          dueDate <= next3Days &&
          task.status !== "Completed"
        ) {
          upcoming.push(task);
        }
      });

      setOverdueTasks(overdue);
      setUpcomingTasks(upcoming);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen font-serif">
      <Sidebar />

      <div className="flex-1 px-8 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Reminders
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Tasks that need your attention now or soon
          </p>
        </div>

        <div className="border-b border-gray-200 mb-6"></div>

        <div className="grid grid-cols-2 gap-6">

          {/* OVERDUE */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-red-100 text-red-500 p-2 rounded-lg">
                <AlertTriangle size={16} />
              </div>
              <h2 className="text-sm font-semibold">
                Overdue ({overdueTasks.length})
              </h2>
            </div>

            {overdueTasks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 bg-white rounded-xl p-6 text-center text-gray-400">
                Nothing overdue. Great work!
              </div>
            ) : (
              overdueTasks.map((task) => (
                <div key={task._id} className="bg-white border rounded-xl p-4 mb-3">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    {task.assignee} • {task.projectId?.name || task.project}
                  </p>
                  <p className="text-xs text-red-500 mt-1">
                    Due: {task.date}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* UPCOMING */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                <Clock size={16} />
              </div>
              <h2 className="text-sm font-semibold">
                Due in next 3 days ({upcomingTasks.length})
              </h2>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 bg-white rounded-xl p-6 text-center text-gray-400">
                No tasks due soon.
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div key={task._id} className="bg-white border rounded-xl p-4 mb-3 shadow-sm">

                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded">
                      {task.priority}
                    </span>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                      {task.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {task.assignee} • {task.projectId?.name || task.project}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs tracking-widest text-gray-400">
                        DUE
                      </p>
                      <p className="text-sm font-semibold">
                        {task.date}
                      </p>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* EMPTY STATE */}
        {overdueTasks.length === 0 && upcomingTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <Bell size={40} className="mb-3 opacity-60" />
            <p className="text-sm">
              All caught up. We'll let you know when something needs attention.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}