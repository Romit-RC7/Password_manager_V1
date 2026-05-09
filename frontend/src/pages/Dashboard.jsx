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

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      website: item.website,
      username: item.username,
      password: item.password,
    });
  };

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

  const handleDelete = async (id) => {
    try {
      await API.delete(`vault/delete/${id}/`);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  const toggleVisibility = (id) => {
    setVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (password) => {
    navigator.clipboard.writeText(password);
    alert("Copied!");
  };

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
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8 md:px-10">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-1">
            Password Vault
          </h1>

          <p className="text-zinc-400 text-sm">
            Securely manage your credentials
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl transition-all duration-200"
        >
          Logout
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-lg shadow-black/30 mb-8">

        <input
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition mb-3"
          placeholder="Website"
          value={form.website}
          onChange={(e) =>
            setForm({ ...form, website: e.target.value })
          }
        />

        <input
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition mb-3"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <div className="relative">
          <input
            type={showInput ? "text" : "password"}
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition pr-10"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowInput(!showInput)}
            className="absolute right-3 top-3 text-zinc-400 hover:text-white"
          >
            {showInput ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="w-full mt-4 bg-white text-black font-semibold p-3 rounded-xl hover:bg-zinc-200 transition-all duration-200"
        >
          Add Password
        </button>
      </div>

      <input
        className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 outline-none focus:border-white transition"
        placeholder="Search websites or usernames..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg shadow-black/20"
          >

            {editingId === item.id ? (
              <>
                <input
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl mb-3"
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                />

                <input
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl mb-3"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />

                <input
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl mb-3"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-1">
                  {item.website}
                </h3>

                <p className="text-zinc-400 text-sm">
                  {item.username}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  <span>
                    {visible[item.id] ? item.password : "••••••••"}
                  </span>

                  <button
                    onClick={() => toggleVisibility(item.id)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 p-2 rounded-xl transition"
                  >
                    {visible[item.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                  <button
                    onClick={() => copyToClipboard(item.password)}
                    className="bg-white text-black hover:bg-zinc-200 px-3 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Copy
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-xl text-sm transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-xl text-sm transition"
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