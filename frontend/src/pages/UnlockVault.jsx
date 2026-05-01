import { useState } from "react";
import API from "../services/api";

function UnlockVault() {
  const [master, setMaster] = useState("");
  const [show, setShow] = useState(false);

  const unlock = async () => {
    try {
      await API.post("verify-master-password/", {
        master_password: master,
      });

      // 🔐 Store only in session (NOT localStorage)
      sessionStorage.setItem("isUnlocked", "true");
      sessionStorage.setItem("master", master);

      // redirect to dashboard
      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);
      alert("Wrong master password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-80 shadow">

        <h2 className="text-xl font-bold mb-4 text-center">
          Unlock Vault 🔐
        </h2>

        {/* PASSWORD INPUT */}
        <input
          type={show ? "text" : "password"}
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Enter master password"
          onChange={(e) => setMaster(e.target.value)}
        />

        {/* SHOW / HIDE BUTTON */}
        <button
          onClick={() => setShow(!show)}
          className="text-sm mb-3 text-gray-300"
        >
          {show ? "Hide Password" : "Show Password"}
        </button>

        {/* UNLOCK BUTTON */}
        <button
          onClick={unlock}
          className="w-full bg-purple-600 p-2 rounded hover:bg-purple-700 transition"
        >
          Unlock
        </button>

      </div>
    </div>
  );
}

export default UnlockVault;