import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UnlockVault from "./pages/UnlockVault";
import SetMasterPassword from "./pages/SetMasterPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unlock" element={<UnlockVault />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/set-master" element={<SetMasterPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;