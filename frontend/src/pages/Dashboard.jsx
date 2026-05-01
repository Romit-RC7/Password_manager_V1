import { useEffect, useState } from "react";
import API from "../services/api";
import { Eye, EyeOff } from "lucide-react";

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const [form, setForm] = useState({
    website: "",
    username: "",
    password: "",
  });

  // 🔐 SECURITY CHECK
  useEffect(() => {
    const token = localStorage.getItem("access");
    const isUnlocked = sessionStorage.getItem("isUnlocked");

    if (!token) {
      window.location.href = "/";
      return;
    }

    if (!isUnlocked) {
      window.location.href = "/unlock";
      return;
    }

    fetchData();
  }, []);

  // 📦 FETCH DATA
  const fetchData = async () => {
    try {
      const master = sessionStorage.getItem("master");

      const res = await API.post("vault/list/", {
        master_password: master,
      });

      setData(res.data);
    } catch {
      alert("Error fetching data");
    }
  };

  // ➕ ADD PASSWORD (top form only)
  const handleAdd = async () => {
    if (!form.website || !form.username || !form.password) {
      alert("All fields required");
      return;
    }

    try {
      const master = sessionStorage.getItem("master");

      await API.post("vault/add/", {
        ...form,
        master_password: master,
      });

      fetchData();
      setForm({ website: "", username: "", password: "" });
    } catch {
      alert("Error saving");
    }
  };

  // ✏️ START INLINE EDIT
  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      website: item.website,
      username: item.username,
      password: item.password,
    });
  };

  // 🔄 UPDATE (inline)
  const handleUpdate = async () => {
    try {
      const master = sessionStorage.getItem("master");

      await API.put(`vault/update/${editingId}/`, {
        ...form,
        master_password: master,
      });

      setEditingId(null);
      setForm({ website: "", username: "", password: "" });
      fetchData();
    } catch {
      alert("Update failed");
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`vault/delete/${id}/`);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // 👁 TOGGLE PASSWORD VISIBILITY (LIST)
  const toggleVisibility = (id) => {
    setVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 📋 COPY
  const copyToClipboard = (password) => {
    navigator.clipboard.writeText(password);
    alert("Copied!");
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const filteredData = data.filter(
    (item) =>
      item.website.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🔐 Password Vault</h1>
        <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">
          Logout
        </button>
      </div>

      {/* ADD FORM */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 shadow">

        <input
          className="p-2 rounded bg-gray-700 w-full mb-2"
          placeholder="Website"
          value={form.website}
          onChange={(e) =>
            setForm({ ...form, website: e.target.value })
          }
        />

        <input
          className="p-2 rounded bg-gray-700 w-full mb-2"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <div className="relative">
          <input
            type={showInput ? "text" : "password"}
            className="w-full p-2 mb-2 rounded bg-gray-700 pr-10"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowInput(!showInput)}
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
          >
            {showInput ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="bg-blue-600 p-2 rounded w-full"
        >
          Add Password
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="p-2 rounded bg-gray-700 mb-4 w-full"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LIST */}
      <div className="grid gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 p-4 rounded-xl shadow"
          >

            {editingId === item.id ? (
              <>
                <input
                  className="p-2 bg-gray-700 rounded mb-2 w-full"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                />

                <input
                  className="p-2 bg-gray-700 rounded mb-2 w-full"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />

                <input
                  className="p-2 bg-gray-700 rounded mb-2 w-full"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-yellow-600 px-3 py-1 rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-600 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold">{item.website}</h3>
                <p className="text-sm text-gray-400">{item.username}</p>

                <div className="mt-2 flex gap-2 items-center">
                  <span>
                    {visible[item.id] ? item.password : "••••••••"}
                  </span>

                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className="bg-gray-700 p-1 rounded"
                  >
                    {visible[item.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => copyToClipboard(item.password)}
                    className="bg-green-600 px-2 py-1 rounded text-sm"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    className="bg-yellow-600 px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;