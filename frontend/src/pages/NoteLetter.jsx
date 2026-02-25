import { useEffect, useMemo, useRef, useState } from "react";
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
  const letterPopupRef = useRef(null);
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

  const openedDate = useMemo(() => {
    if (!note?.openAt) return "sometime soon";
    return new Date(note.openAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [note?.openAt]);
  const createdDate = useMemo(() => {
    if (!note?.createdAt) return "unknown";
    return new Date(note.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [note?.createdAt]);

  const letterLengthClass = useMemo(() => {
    const length = (note?.content || "").trim().length;
    if (length > 2400) return "very-long-letter";
    if (length > 1200) return "long-letter";
    return "";
  }, [note?.content]);
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
    if (!note|| !letterPopupRef.current) return;

    setIsSharing(true);

    try {
      const popup = letterPopupRef.current;
      const popupBounds = popup.getBoundingClientRect();
      const width = Math.max(1, Math.round(popupBounds.width));
      const height = Math.max(1, Math.round(popupBounds.height));
      const scale = window.devicePixelRatio || 1;
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = Math.max(1, Math.round(width * scale));
      exportCanvas.height = Math.max(1, Math.round(height * scale));
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context unavailable");
      }
      ctx.scale(scale, scale);
      ctx.textBaseline = "alphabetic";
      const background = new Image();
      background.crossOrigin = "anonymous";
      background.src = selectedEnvelope.letterBackground;

      await new Promise((resolve, reject) => {
        background.onload = resolve;
        background.onerror = reject;
      });
      ctx.drawImage(background, 0, 0, width, height);
      const paperElement = popup.querySelector(".note-letter-content");
      if (!paperElement) {
        throw new Error("Letter content missing");
      }
     const popupRect = popup.getBoundingClientRect();
      const drawWrappedText = (element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const x = rect.left - popupRect.left;
        const yStart = rect.top - popupRect.top;
        const maxWidth = rect.width;
        const fontSize = Number.parseFloat(style.fontSize) || 16;
        const lineHeightValue = Number.parseFloat(style.lineHeight);
        const lineHeight = Number.isFinite(lineHeightValue) ? lineHeightValue : fontSize * 1.4;
        ctx.fillStyle = style.color || "#2f2f2f";
        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const paragraphs = (element.innerText || "").split("\n");
        let currentY = yStart + fontSize;
        paragraphs.forEach((paragraph, paragraphIndex) => {
          const words = paragraph.split(/\s+/).filter(Boolean);
          if (!words.length) {
            currentY += lineHeight;
            return;
          }
          let line = "";
          words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;
            if (ctx.measureText(testLine).width > maxWidth && line) {
              ctx.fillText(line, x, currentY);
              line = word;
              currentY += lineHeight;
            } else {
              line = testLine;
            }
          });
          if (line) {
            ctx.fillText(line, x, currentY);
            currentY += lineHeight;
          }
          if (paragraphIndex < paragraphs.length - 1) {
            currentY += lineHeight * 0.1;
          }
        });
      };
      popup
        .querySelectorAll(".note-letter-header span, .note-letter-paper p, .note-letter-paper h1")
        .forEach((element) => drawWrappedText(element));

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
      <div
        ref={letterPopupRef}
        className={`letter-form-popup note-letter-popup ${letterLengthClass}`}
        style={{ backgroundImage: `url(${selectedEnvelope.letterBackground})` }}
      >
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
                <div className="note-letter-meta">
                  <span>Created: {createdDate}</span>
                  <span>Opened: {openedDate}</span>
                </div>
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