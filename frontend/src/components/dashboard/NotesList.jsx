import { useState } from "react";
import "./NotesList.css";

const ENVELOPE_COLORS = ["red", "blue", "purple", "green", "yellow"];

const ENVELOPE_IMAGE_MAP = {
  locked: {
    red: "/assets/images/envelopes/closed-red.png",
    blue: "/assets/images/envelopes/closed-blue.png",
    purple: "/assets/images/envelopes/closed-purple.png",
    green: "/assets/images/envelopes/closed-green.png",
    yellow: "/assets/images/envelopes/closed-yellow.png",
  },
  unlocked: {
    red: "/assets/images/envelopes/open-red.png",
    blue: "/assets/images/envelopes/open-blue.png",
    purple: "/assets/images/envelopes/open-purple.png",
    green: "/assets/images/envelopes/open-green.png",
    yellow: "/assets/images/envelopes/open-yellow.png",
  },
};

export default function NotesList({ notes, type, onNoteClick, loading }) {
  const [shakingNoteId, setShakingNoteId] = useState(null);

  const handleCardClick = (note) => {
    if (type === "locked") {
      setShakingNoteId(note._id);

      if (typeof window !== "undefined" && window.navigator?.vibrate) {
        window.navigator.vibrate([70, 40, 70]);
      }

      window.setTimeout(() => {
        setShakingNoteId((currentId) => (currentId === note._id ? null : currentId));
      }, 500);
      return;
    }

    onNoteClick(note);
  };

  if (loading) {
    return (
      <div className="notes-loading">
        <div className="loading-spinner"></div>
        <p>Loading your notes...</p>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="notes-empty">
        <p className="empty-message">
          {type === "locked"
            ? "No notes waiting to be unlocked"
            : "No unlocked notes yet"}
        </p>
        <p className="empty-hint">
          {type === "locked"
            ? "Create a new note to send a message to your future self"
            : "Your notes will appear here once they're unlocked"}
        </p>
      </div>
    );
  }

  return (
    <div className="notes-scroll-container">
      <div className="notes-list">
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            type={type}
            isShaking={shakingNoteId === note._id}
            onClick={() => handleCardClick(note)}
          />
        ))}
      </div>
    </div>
  );
}

function NoteCard({ note, type, onClick, isShaking }) {
  const colorName = ENVELOPE_COLORS[getColorIndex(note._id, ENVELOPE_COLORS.length)];
  const iconType = type === "locked" ? "locked" : "unlocked";
  const envelopeImage = ENVELOPE_IMAGE_MAP[iconType][colorName];

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeRemaining = (date) => {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;

    if (diff < 0) return "Ready to open!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} remaining`;
    return "Less than an hour!";
  };

  return (
    <div className={`note-card ${isShaking ? "is-shaking" : ""}`} onClick={onClick}>
      <div className="envelope-wrapper">
        <img
          className={`envelope-image ${type === "locked" ? "closed" : "open"}`}
          src={envelopeImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </div>
      <div className="note-info">
        <h3 className="note-title">{note.title || "Untitled Note"}</h3>
        <p className="note-date">
          {type === "locked" ? (
            <>
              <span className="date-label">Unlocks:</span> {formatDate(note.openAt)}
            </>
          ) : (
            <>
              <span className="date-label">Unlocked:</span> {formatDate(note.openAt)}
            </>
          )}
        </p>
        {type === "locked" && (
          <p className="note-countdown">{getTimeRemaining(note.openAt)}</p>
        )}
      </div>
    </div>
  );
}

function getColorIndex(id, length) {
  if (!id) {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash) % length;
}
