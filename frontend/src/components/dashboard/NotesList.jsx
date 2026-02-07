import "./NotesList.css";

export default function NotesList({ notes, type, onNoteClick, loading }) {
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
            onClick={() => onNoteClick(note._id)}
          />
        ))}
      </div>
    </div>
  );
}

function NoteCard({ note, type, onClick }) {
  const colors = [
    "#C9ADA7",
    "#9A8C98",
    "#C08552",
    "#A4C3B2",
    "#D4A373",
    "#B8A99A",
    "#D4C5B9",
  ];

  const envelopeColor = colors[getColorIndex(note._id, colors.length)];

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
    <div className="note-card" onClick={onClick}>
      <div className="envelope-wrapper">
        {type === "locked" ? (
          <div className="envelope closed" style={{ background: envelopeColor }}>
            <div className="envelope-flap"></div>
            <div className="status-icon locked" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path d="M17 9V7a5 5 0 0 0-10 0v2H5v11h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Zm8 11H7v-7h10v7Zm-5-2a1.5 1.5 0 1 0-1.4-2h2.8A1.5 1.5 0 0 0 12 16Z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="envelope open">
            <div className="envelope-body" style={{ background: envelopeColor }}></div>
            <div className="letter-peek">
              <div className="letter-lines"></div>
            </div>
            <div className="status-icon unlocked" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path d="M12 3a5 5 0 0 0-5 5v2H5v11h14V10h-8V8a3 3 0 0 1 6 0h2a5 5 0 0 0-5-5Zm5 16H7v-7h10v7Zm-5-2a1.5 1.5 0 1 0-1.4-2h2.8A1.5 1.5 0 0 0 12 17Z" />
              </svg>
            </div>
          </div>
        )}
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
