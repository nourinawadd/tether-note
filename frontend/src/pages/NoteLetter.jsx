import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateNote.css";
import "./NoteLetter.css";
import { deleteNote, fetchNoteById } from "../api/auth.api";
import { DEFAULT_ENVELOPE_STYLE, ENVELOPE_STYLE_OPTIONS } from "../constants/envelopeStyles";

export default function NoteLetter({ note: providedNote = null, onClose, onDeleted }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(providedNote);
  const [loading, setLoading] = useState(!providedNote);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
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

    const handleDelete = async () => {
    const token = localStorage.getItem("tetherToken");
    if (!token || !noteIdToLoad) {
      setDeleteError("Unable to delete this note right now.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteNote(token, noteIdToLoad);
      onDeleted?.();
      handleClose();
    } catch (deleteNoteError) {
      setDeleteError(deleteNoteError.message || "Unable to delete this note right now.");
    } finally {
      setIsDeleting(false);
      setShowDeletePopup(false);
    }
  };

  const handleShareLetter = async () => {
    if (!note) return;

    setIsSharing(true);

    try {
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 1200;
      exportCanvas.height = 900;
      const ctx = exportCanvas.getContext("2d");

      const background = new Image();
      background.crossOrigin = "anonymous";
      background.src = selectedEnvelope.letterBackground;

      await new Promise((resolve, reject) => {
        background.onload = resolve;
        background.onerror = reject;
      });

      ctx.drawImage(background, 0, 0, exportCanvas.width, exportCanvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
      ctx.fillRect(110, 90, 980, 720);
      ctx.fillStyle = "#2f2f2f";
      ctx.font = "42px serif";
      ctx.fillText(note.title || "A letter from your past self", 150, 180, 900);
      ctx.font = "30px serif";
      ctx.fillText(`Opened: ${formattedDate}`, 150, 230);
      ctx.font = "34px serif";
      ctx.fillText("Dear Future Me,", 150, 300);
      ctx.font = "30px sans-serif";

      const letterText = note.content || "";
      const words = letterText.split(" ");
      let line = "";
      let y = 360;

      words.forEach((word) => {
        const testLine = `${line}${word} `;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 860) {
          ctx.fillText(line.trim(), 150, y);
          line = `${word} `;
          y += 46;
          return;
        }
        line = testLine;
      });

      if (line.trim()) {
        ctx.fillText(line.trim(), 150, y);
      }

      ctx.font = "34px serif";
      ctx.fillText("With care,", 150, 760);
      ctx.fillText("Past You", 150, 810);

      const link = document.createElement("a");
      link.download = `${(note.title || "tether-note-letter").replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    } catch {
      setDeleteError("Unable to export your letter image right now.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="create-note-overlay note-letter-overlay" role="dialog" aria-modal="true" aria-label="Opened note">
      <div className="letter-form-popup note-letter-popup" style={{ backgroundImage: `url(${selectedEnvelope.letterBackground})` }}>
        <button className="close-note-btn" onClick={handleClose} aria-label="Close note view">
          ×
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
                <button
                  type="button"
                  className="submit-btn note-letter-delete-btn"
                  onClick={() => setShowDeletePopup(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete Note"}
                </button>
                <button
                  type="button"
                  className="submit-btn note-letter-share-btn"
                  onClick={handleShareLetter}
                  disabled={isSharing}
                >
                  {isSharing ? "Exporting..." : "Share Letter"}
                </button>
              </div>
              {deleteError ? <p className="note-letter-error note-letter-inline-error">{deleteError}</p> : null}
            </>
          )}
        </div>

        {showDeletePopup ? (
          <div className="sent-popup delete-popup" role="alertdialog" aria-modal="true" aria-label="Delete note confirmation">
            <span className="sent-popup-plane" aria-hidden="true">⚠️</span>
            <span>Delete this note permanently?</span>
            <div className="delete-popup-actions">
              <button type="button" className="submit-btn delete-popup-btn" onClick={handleDelete}>
                Delete
              </button>
              <button type="button" className="submit-btn delete-popup-btn" onClick={() => setShowDeletePopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}