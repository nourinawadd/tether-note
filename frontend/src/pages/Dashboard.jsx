import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import WriteNoteButton from "../components/dashboard/WriteNoteButton";
import NotesList from "../components/dashboard/NotesList";
import CreateNote from "./CreateNote";

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
  const [showCreateNote, setShowCreateNote] = useState(false);
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
    setShowCreateNote(true);
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
              <div className="header-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <path d="M6 2h12v4h-2V4H8v2H6V2Zm0 20v-4h2v2h8v-2h2v4H6Zm6-16a7 7 0 1 1 0 14a7 7 0 0 1 0-14Zm0 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10Zm-.75 1.5h1.5v4.25l2.75 1.6-.75 1.3L11.25 15V9.5Z" />
                </svg>
              </div>
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
              <div className="header-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img" focusable="false">
                  <path d="M12 3a5 5 0 0 0-5 5v2H5v11h14V10h-8V8a3 3 0 0 1 6 0h2a5 5 0 0 0-5-5Zm5 16H7v-7h10v7Zm-5-2a1.5 1.5 0 1 0-1.4-2h2.8A1.5 1.5 0 0 0 12 17Z" />
                </svg>
              </div>
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
      <footer className="dashboard-footer">Tether Note™</footer>
      {showCreateNote ? (
        <CreateNote
          onClose={() => setShowCreateNote(false)}
          onCreated={fetchNotes}
        />
      ) : null}

    </div>
  );
}
