import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import WriteNoteButton from "../components/dashboard/WriteNoteButton";
import NotesList from "../components/dashboard/NotesList";

const promptIdeas = [
  "Birthday Letter",
  "Goals Reminder",
  "Motivation Letter",
  "Letter to Future Self",
  "Anniversary Message",
  "Time Capsule",
  "Dream Journal",
  "Gratitude Note"
];

export default function Dashboard() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [notes, setNotes] = useState({ locked: [], unlocked: [], opened: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Rotate prompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % promptIdeas.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("tetherToken");
      const res = await fetch("http://localhost:5500/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setNotes(data.data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    navigate("/create-note");
  };

  const handleNoteClick = (noteId) => {
    navigate(`/note/${noteId}`);
  };

  const user = JSON.parse(localStorage.getItem("tetherUser") || "{}");

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <h1 className="brand-title">Tether Note*</h1>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link active">Dashboard</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <div className="profile-avatar">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Hero Section with Create Button */}
        <section className="create-section">
          <WriteNoteButton
            promptText={promptIdeas[currentPrompt]}
            onClick={handleCreateNote}
          />
        </section>

        {/* Notes Grid */}
        <section className="notes-grid">
          {/* Locked Notes (Waiting) */}
          <div className="notes-section">
            <div className="section-header">
              <div className="header-icon">⏳</div>
              <h2>Notes waiting...</h2>
            </div>
            <NotesList
              notes={notes.locked}
              type="locked"
              onNoteClick={handleNoteClick}
              loading={loading}
            />
          </div>

          {/* Unlocked Notes */}
          <div className="notes-section">
            <div className="section-header">
              <div className="header-icon">🔓</div>
              <h2>Unlocked Notes</h2>
            </div>
            <NotesList
              notes={notes.unlocked}
              type="unlocked"
              onNoteClick={handleNoteClick}
              loading={loading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}