import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./components/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NoteLetter from "./pages/NoteLetter";
import { BackgroundAudioProvider } from "./hooks/useBackgroundAudio";
import { BRAND_LOGO_PATH, BRAND_NAME, getFaviconTypeFromPath } from "./constants/branding";



export default function App() {
  useEffect(() => {
    document.title = BRAND_NAME;

    const faviconHref = BRAND_LOGO_PATH;
    let favicon = document.querySelector('link[rel="icon"]');

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);
    }

    favicon.setAttribute("type", getFaviconTypeFromPath(faviconHref));
    favicon.setAttribute("href", faviconHref);
  }, []);

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