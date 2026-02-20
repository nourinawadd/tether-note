import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./NoteLetter.css";
import { fetchNoteById } from "../api/auth.api";

export default function NoteLetter() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("tetherToken");
    if (!token) {
      navigate("/signin");
      return;
    }

    const loadNote = async () => {
      try {
        const data = await fetchNoteById(token, noteId);
        setNote(data);
      } catch (e) {
        setError(e.message || "Could not load this note.");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [navigate, noteId]);

  const formattedDate = useMemo(() => {
    if (!note?.openAt) return "sometime soon";
    return new Date(note.openAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [note?.openAt]);

  if (loading) {
    return (
      <div className="note-letter-page">
        <div className="note-letter-shell">
          <p className="note-letter-status">Unsealing your letter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="note-letter-page">
        <div className="note-letter-shell">
          <p className="note-letter-error">{error}</p>
          <Link className="note-letter-back" to="/dashboard">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="note-letter-page">
      <div className="note-letter-shell">
        <header className="note-letter-header">
          <span>To: Future Me</span>
          <span>Opened: {formattedDate}</span>
        </header>

        <article className="note-letter-paper">
          <p className="note-letter-greeting">Dear Future Me,</p>
          <h1>{note.title || "A letter from your past self"}</h1>
          <p className="note-letter-body">{note.content}</p>
          <p className="note-letter-signoff">With care,</p>
          <p className="note-letter-signature">Past You</p>
        </article>

        <div className="note-letter-actions">
          <button type="button" onClick={() => navigate("/dashboard")}>
            Back to Notes
          </button>
        </div>
      </div>
    </div>
  );
}
