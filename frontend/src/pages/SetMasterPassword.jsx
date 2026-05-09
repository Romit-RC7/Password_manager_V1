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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 text-white">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/40">

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Set Master Password
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed">
            This password is used to encrypt and unlock your vault.
          </p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 mb-5">
          <p className="text-yellow-400 text-sm leading-relaxed">
            ⚠️ Remember this password carefully. If you forget it,
            your vault cannot be decrypted.
          </p>
        </div>

        <input
          className="w-full p-3 mb-4 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition"
          type="password"
          placeholder="Master Password"
          onChange={(e) => setMaster(e.target.value)}
        />

        <button
          onClick={handleSet}
          className="w-full bg-white text-black font-semibold p-3 rounded-xl hover:bg-zinc-200 transition-all duration-200"
        >
          Continue
        </button>

      </div>
    </div>
  );
}

export default SetMasterPassword;