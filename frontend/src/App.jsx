import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NoteLetter from "./pages/NoteLetter";
import { BackgroundAudioProvider } from "./hooks/useBackgroundAudio";

export default function App() {
  return (
    <BackgroundAudioProvider>
      <Routes>
        <Route path="/signup" element={<AuthPage defaultMode="signup" />} />
        <Route path="/signin" element={<AuthPage defaultMode="signin" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-note" element={<Navigate to="/dashboard" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/note/:noteId" element={<NoteLetter />} />
        <Route path="/" element={<Navigate to="/signin" />} />
      </Routes>
    </BackgroundAudioProvider>
  );
}