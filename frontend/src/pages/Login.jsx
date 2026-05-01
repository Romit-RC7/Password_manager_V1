import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("login/", {
        email: email,
        password: password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      const check = await API.get("check-master-password/");

      if (check.data.exists) {
        navigate("/unlock");
      } else {
        navigate("/set-master");
      }

    } catch (err) {
      alert("Login failed");
      console.log(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-xl w-80 shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 rounded bg-gray-700"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-2 rounded"
        >
          Login
        </button>

        <p
          className="text-sm mt-3 text-center cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Create account
        </p>
      </div>
    </div>
  );
}

export default Login;