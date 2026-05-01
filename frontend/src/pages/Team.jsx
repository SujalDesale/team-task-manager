import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, X, Shield } from "lucide-react";

export default function Team() {
  const [showModal, setShowModal] = useState(false);

  const members = [
    { name: "L", email: "lock_052d40@example.com", role: "Member" },
    { name: "T User", email: "test_e9a33c65@example.com", role: "Member" },
    { name: "Demo Member", email: "member@taskflow.com", role: "Member" },
    { name: "Admin", email: "admin@taskflow.com", role: "Admin" },
  ];

  return (
    <div className="flex bg-[#f8f9fb] min-h-screen font-serif">

      <Sidebar />

      <div className="flex-1 px-8 py-6">

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Team
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your workspace members and roles
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>

        {/* LINE */}
        <div className="border-b border-gray-200 mb-6"></div>

        {/* MEMBER LIST */}
        <div>
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

            {members.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-semibold">
                    {m.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">
                        {m.name}
                      </h3>

                      {m.role === "Admin" && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          <Shield size={12} />
                          ADMIN
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {m.email}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  {m.role !== "Admin" && (
                    <>
                      <select className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500">
                        <option>Member</option>
                        <option>Admin</option>
                      </select>

                      <Trash2 size={16} className="text-gray-400 cursor-pointer" />
                    </>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-[420px] p-6 relative">

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Add team member
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <input className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-500" />
                </div>

                <div>
                  <label className="text-sm text-gray-600">
                    Temporary password
                  </label>
                  <input
                    placeholder="At least 6 characters"
                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <select className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-yellow-500">
                    <option>Member</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2">
                  <button className="bg-yellow-700 text-white px-4 py-2 rounded-lg">
                    Add member
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}