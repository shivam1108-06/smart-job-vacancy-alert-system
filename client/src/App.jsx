import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/add-job" element={<AddJob />} />
    </Routes>
  );
}

export default App;