import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import WriteNoteButton from "../components/dashboard/WriteNoteButton";
import NotesList from "../components/dashboard/NotesList";
import CreateNote from "./CreateNote";
import { fetchNotes as fetchNotesApi } from "../api/auth.api";
import NoteLetter from "./NoteLetter";
import MusicToggleButton from "../components/ui/MusicToggleButton";
import { getUserInitials } from "../utils/userInitials";
import { BRAND_LOGO_PATH } from "../constants/branding";

const promptIdeas = [
  "Letter To Your Future Self",
  "Reminder For Tough Days",
  "Note About Your Current Goals",
  "Message For Next Year",
  "Promise To Yourself",
  "Reflection On Today",
  "List Of Small Wins",
  "Gratitude Note",
  "Motivation Reminder",
  "Check-In For Later",
  "Progress Update",
  "Goal Review",
  "Accountability Note",
  "Lesson Learned",
  "Personal Update",
  "Reality Check",
  "Plan For The Next Month",
  "One Year Reflection",
  "Milestone Note",
  "Self Evaluation"
];

export default function Dashboard() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [notes, setNotes] = useState({ locked: [], unlocked: [], opened: [] });
  const [loading, setLoading] = useState(true);
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [isCreateNoteClosing, setIsCreateNoteClosing] = useState(false);
  const [openedNote, setOpenedNote] = useState(null);
  const [isOpenedNoteClosing, setIsOpenedNoteClosing] = useState(false);
  const navigate = useNavigate();

  const playEnvelopeSound = useCallback((soundPath) => {
    const sound = new Audio(soundPath);
    sound.play().catch(() => {
      // Ignore playback errors caused by browser autoplay restrictions.
    });
  }, []);

  const playPaperIn = useCallback(() => {
    playEnvelopeSound("/assets/audio/paperIn.wav");
  }, [playEnvelopeSound]);

  const playPaperOut = useCallback(() => {
    playEnvelopeSound("/assets/audio/paperOut.wav");
  }, [playEnvelopeSound]);

  // Rotate prompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % promptIdeas.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const token = localStorage.getItem("tetherToken");
      if (!token) {
        navigate("/signin");
        return;
      }

      const data = await fetchNotesApi(token);
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);


  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = () => {
    playPaperIn();
    setIsCreateNoteClosing(false);
    setShowCreateNote(true);
  };

  const handleNoteClick = (note) => {
    playPaperIn();
    setIsOpenedNoteClosing(false);
    setOpenedNote(note);
  };
  const handleCreateNoteClose = () => {
    if (!showCreateNote || isCreateNoteClosing) return;
    playPaperOut();
    setIsCreateNoteClosing(true);
    setTimeout(() => {
      setShowCreateNote(false);
      setIsCreateNoteClosing(false);
    }, 340);
  };

  const handleOpenedNoteClose = () => {
    if (!openedNote || isOpenedNoteClosing) return;
    playPaperOut();
    setIsOpenedNoteClosing(true);
    setTimeout(() => {
      setOpenedNote(null);
      setIsOpenedNoteClosing(false);
    }, 340);
  };

  const user = JSON.parse(localStorage.getItem("tetherUser") || "{}");

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="dashboard-nav">
          <h1 className="brand-title">
          <img src={BRAND_LOGO_PATH} alt="Tether Note logo" className="brand-logo" />
          <span>Tether Note</span>
        </h1>
        <div className="nav-links">
          <MusicToggleButton />
          <Link to="/dashboard" className="nav-link active">Dashboard</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <div className="profile-avatar">
              {getUserInitials(user.name)}
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
              <div className="header-icon" aria-hidden="true">⏳</div>
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
              <div className="header-icon" aria-hidden="true">🔓</div>
              <h2>Unlocked Notes</h2>
            </div>
            <NotesList
              notes={[...(notes.unlocked || []), ...(notes.opened || [])].sort((a, b) => new Date(b.openAt) - new Date(a.openAt))}
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
          onClose={handleCreateNoteClose}
          onCreated={fetchNotes}
          isClosing={isCreateNoteClosing}
        />
      ) : null}
      {openedNote ? (
        <NoteLetter
          note={openedNote}
          onClose={handleOpenedNoteClose}
          isClosing={isOpenedNoteClosing}
          onDeleted={() => {
            handleOpenedNoteClose();
            fetchNotes();
          }}
        />
      ) : null}
    </div>
  );
}
