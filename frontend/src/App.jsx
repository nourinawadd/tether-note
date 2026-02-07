import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";

export default function App() {
  return (
    <Routes>
      <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
      <Route path="/signin" element={<AuthPage defaultMode="signin" />} />
      <Route path="/" element={<Navigate to="/signin" />} />
    </Routes>
  );
}
