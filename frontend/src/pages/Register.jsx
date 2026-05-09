import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {

    try {

      await API.post("register/", {
        email: email,
        password: password,
      });

      alert("User registered successfully");

      navigate("/");

    } catch (err) {

      alert(
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        "Registration failed"
      );

      console.log(err.response?.data);
    }
  };

  return (

    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 text-white">

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/40">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold mb-2">
            Create Account
          </h1>

          <p className="text-zinc-400 text-sm">
            Securely store and manage your passwords
          </p>

        </div>

        <div className="space-y-4">

          <input
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-xl outline-none focus:border-white transition"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-white text-black font-semibold p-3 rounded-xl hover:bg-zinc-200 transition-all duration-200"
          >
            Register
          </button>

          <p
            className="text-sm text-center text-zinc-400 hover:text-white cursor-pointer transition"
            onClick={() => navigate("/")}
          >
            Already have an account? Login
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;