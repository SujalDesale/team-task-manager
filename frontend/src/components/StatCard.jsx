export default function StatCard({ title, value, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex justify-between items-center">

      <div>
        <p className="text-xs tracking-widest text-gray-400 mb-2">
          {title}
        </p>

        <h2 className="text-3xl font-semibold text-gray-900">
          {value}
        </h2>
      </div>

      {/* ICON BOX */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
        {Icon && <Icon size={20} className="text-current" />}
      </div>
    </div>
  );
}