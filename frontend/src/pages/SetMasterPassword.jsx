import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function SetMasterPassword() {
  const [master, setMaster] = useState("");
  const navigate = useNavigate();

  const handleSet = async () => {
    try {
      await API.post("set-master-password/", {
        master_password: master,
      });

      alert("Master password set");
      navigate("/unlock");
    } catch {
      alert("Error setting master password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-80 shadow">
        
        <h2 className="text-xl font-bold mb-2 text-center">
          Set Master Password
        </h2>

        {/* 🔐 Warning / Reminder */}
        <p className="text-sm text-yellow-400 mb-4 text-center">
          ⚠️ Remember this password carefully. If you forget it, you will NOT be able to access your vault.
        </p>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700"
          type="password"
          placeholder="Master Password"
          onChange={(e) => setMaster(e.target.value)}
        />

        <button
          onClick={handleSet}
          className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 transition"
        >
          Set Password
        </button>
      </div>
    </div>
  );
}

export default SetMasterPassword;