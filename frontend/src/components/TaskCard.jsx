export default function TaskCard({ task }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 w-[340px]">

      {/* TAGS */}
      <div className="flex gap-2 mb-2">
        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
          {task.status}
        </span>

        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
          {task.priority}
        </span>
      </div>

      {/* TITLE */}
      <h3 className="font-semibold text-gray-800 text-lg">
        {task.title}
      </h3>

      {/* DESC */}
      <p className="text-gray-500 text-sm mt-1 mb-4">
        {task.description}
      </p>

      {/* FOOTER */}
      <div className="flex justify-between text-xs text-gray-400">
        <span>{task.assignee || "Unassigned"}</span>
        <span>{task.date}</span>
      </div>

    </div>
  );
}