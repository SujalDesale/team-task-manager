import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Reminders from "./pages/Reminders";
import Team from "./pages/Team";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute><Projects /></ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute><Tasks /></ProtectedRoute>
        } />

        <Route path="/reminders" element={
          <ProtectedRoute><Reminders /></ProtectedRoute>
        } />

        <Route path="/team" element={
          <ProtectedRoute><Team /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;