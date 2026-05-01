import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  ListTodo,
  Bell,
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", path: "/projects", icon: Folder },
    { name: "Tasks", path: "/tasks", icon: ListTodo },
    { name: "Reminders", path: "/reminders", icon: Bell },
    { name: "Team", path: "/team", icon: Users },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">

      {/* TOP */}
      <div className="px-5 py-6">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-yellow-600 text-white flex items-center justify-center rounded-md">
            ✓
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">TaskFlow</h2>
            <p className="text-xs text-gray-400">TEAM WORKSPACE</p>
          </div>
        </div>

        {/* MENU */}
        <ul className="space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-yellow-100 text-yellow-800 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* BOTTOM */}
      <div className="px-5 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-yellow-500 text-white w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold">
            A
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2 text-sm hover:bg-gray-100 transition">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );
}