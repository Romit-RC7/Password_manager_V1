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

      sessionStorage.setItem("isUnlocked", "true");
      sessionStorage.setItem("master", master);

      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);
      alert("Wrong master password");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 text-white">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/40">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Unlock Vault 🔐
          </h1>

          <p className="text-zinc-400 text-sm">
            Enter your master password to continue
          </p>
        </div>

        <input
          type={show ? "text" : "password"}
          className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition"
          placeholder="Master Password"
          onChange={(e) => setMaster(e.target.value)}
        />

        <button
          onClick={() => setShow(!show)}
          className="text-sm text-zinc-400 hover:text-white mt-3 transition"
        >
          {show ? "Hide Password" : "Show Password"}
        </button>

        <button
          onClick={unlock}
          className="w-full mt-5 bg-white text-black font-semibold p-3 rounded-xl hover:bg-zinc-200 transition-all duration-200"
        >
          Unlock Vault
        </button>

      </div>
    </div>
  );
}

export default UnlockVault;