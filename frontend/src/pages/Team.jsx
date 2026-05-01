import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, X, Shield } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

export default function Team() {
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member",
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Failed to fetch users");
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        console.error("Invalid data:", data);
        setMembers([]);
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= ADD MEMBER =================
  const handleAdd = async () => {
    try {
      // ✅ VALIDATION
      if (!form.name || !form.email || !form.password) {
        alert("All fields required");
        return;
      }

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data._id) {
        // ✅ SUCCESS
        fetchUsers();
        setShowModal(false);

        // ✅ RESET FORM
        setForm({
          name: "",
          email: "",
          password: "",
          role: "Member",
        });

      } else {
        alert(data.msg || "Failed to add member");
      }

    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers();

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ================= UPDATE ROLE =================
  const handleRoleChange = async (id, role) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      fetchUsers();

    } catch (err) {
      console.error("Role update error:", err);
    }
  };

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

        <div className="border-b border-gray-200 mb-6"></div>

        {/* MEMBER LIST */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {members.length === 0 ? (
            <p className="p-6 text-gray-400 text-sm">
              No team members yet
            </p>
          ) : (
            members.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-semibold">
                    {m.name?.charAt(0)}
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

                <div className="flex items-center gap-3">
                  {m.role !== "Admin" && (
                    <>
                      <select
                        value={m.role}
                        onChange={(e) =>
                          handleRoleChange(m._id, e.target.value)
                        }
                        className="border rounded-md px-3 py-1 text-sm"
                      >
                        <option>Member</option>
                        <option>Admin</option>
                      </select>

                      <Trash2
                        size={16}
                        onClick={() => handleDelete(m._id)}
                        className="text-gray-400 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl w-[420px] p-5 relative shadow-lg">

              {/* CLOSE */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400"
              >
                <X size={18} />
              </button>

              <h2 className="text-lg font-semibold mb-4">
                Add team member
              </h2>

              <div className="space-y-3">

                <input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <input
                  type="password"
                  placeholder="Temporary password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />

                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option>Member</option>
                  <option>Admin</option>
                </select>

                <button
                  onClick={handleAdd}
                  className="w-full bg-yellow-700 text-white py-2 rounded-lg text-sm mt-2"
                >
                  Add member
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}