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
    return (
        <div className="flex bg-[#f8f9fb] min-h-screen font-serif">

            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <div className="flex-1 px-8 py-6">

                {/* HEADER */}

                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome back, Admin
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Here's an overview of your team's progress today
                    </p>
                </div>

                {/* SEPARATOR LINE */}
                <div className="border-b border-gray-200 mb-6"></div>

                {/* STATS GRID */}
                <div className="grid grid-cols-3 gap-5 mb-8">

                    <StatCard
                        title="COMPLETED"
                        value="0"
                        color="bg-green-100 text-green-600"
                        icon={CheckCircle}
                    />

                    <StatCard
                        title="PENDING"
                        value="1"
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
                        value="1"
                        color="bg-yellow-200 text-yellow-700"
                        icon={Folder}
                    />

                    <StatCard
                        title="MY TASKS"
                        value="0"
                        color="bg-gray-200 text-gray-600"
                        icon={ListTodo}
                    />

                    <StatCard
                        title="TEAM MEMBERS"
                        value="4"
                        color="bg-purple-200 text-purple-600"
                        icon={Users}
                    />

                </div>

                {/* RECENT TASKS HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent tasks
                    </h2>

                    <span className="text-yellow-700 text-sm font-medium cursor-pointer hover:underline">
                        View all →
                    </span>
                </div>

                {/* TASK CARD */}
                <div className="flex gap-4">
                    <TaskCard />
                </div>

            </div>
        </div>
    );
}