import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
      <Route path="/signin" element={<AuthPage defaultMode="signin" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-note" element={<Navigate to="/dashboard" replace />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}