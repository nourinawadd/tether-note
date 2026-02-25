import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateNote.css";
import "./NoteLetter.css";
import { fetchNoteById } from "../api/auth.api";
import { DEFAULT_ENVELOPE_STYLE, ENVELOPE_STYLE_OPTIONS } from "../constants/envelopeStyles";

export default function NoteLetter({ note: providedNote = null, onClose }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(providedNote);
  const [loading, setLoading] = useState(!providedNote);
  const [error, setError] = useState("");
  const noteIdToLoad = providedNote?._id || noteId;

  useEffect(() => {
    if (providedNote) {
      setNote(providedNote);
      setLoading(false);
    }

    const token = localStorage.getItem("tetherToken");
    if (!token) {
      navigate("/signin");
      return;
    }

    const loadNote = async () => {
      try {
        const data = await fetchNoteById(token, noteIdToLoad);
        setNote(data);
      } catch (e) {
        if (!providedNote) {
          setError(e.message || "Could not load this note.");
        }
      } finally {
        if (!providedNote) {
          setLoading(false);
        }
      }
    };

    if (noteIdToLoad) {
      loadNote();
    }
  }, [navigate, noteIdToLoad, providedNote]);

  const formattedDate = useMemo(() => {
    if (!note?.openAt) return "sometime soon";
    return new Date(note.openAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [note?.openAt]);

  const selectedEnvelope =
    ENVELOPE_STYLE_OPTIONS.find((option) => option.value === note?.envelopeColor) ||
    DEFAULT_ENVELOPE_STYLE;

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="create-note-overlay note-letter-overlay" role="dialog" aria-modal="true" aria-label="Opened note">
      <div className="letter-form-popup note-letter-popup" style={{ backgroundImage: `url(${selectedEnvelope.letterBackground})` }}>
        <button className="close-note-btn" onClick={handleClose} aria-label="Close note view">
          x
        </button>

        <div className="note-letter-content">
          {loading ? (
            <p className="note-letter-status">Unsealing your letter...</p>
          ) : error ? (
            <>
              <p className="note-letter-error">{error}</p>
              <button type="button" className="submit-btn note-letter-back-btn" onClick={handleClose}>
                Return to Dashboard
              </button>
            </>
          ) : (
            <>
              <header className="note-letter-header">
                <span>To: Future Me</span>
                <span>Opened: {formattedDate}</span>
              </header>
              <article className="note-letter-paper">
                <p className="note-letter-greeting">Dear Future Me,</p>
                <h1>{note?.title || "A letter from your past self"}</h1>
                <p className="note-letter-body">{note?.content}</p>
                <p className="note-letter-signoff">With care,</p>
                <p className="note-letter-signature">Past You</p>
              </article>

              <div className="note-letter-actions">
                <button type="button" className="submit-btn note-letter-back-btn" onClick={handleClose}>
                  Back to Notes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
