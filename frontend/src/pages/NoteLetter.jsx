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
      const baseHeight = Math.max(1, Math.round(popupBounds.height));
      const scale = window.devicePixelRatio || 1;
      const paperElement = popup.querySelector(".note-letter-content");
      if (!paperElement) {
        throw new Error("Letter content missing");
      }
      const popupRect = popup.getBoundingClientRect();

      const drawInstructions = [];
      let maxTextY = 0;
      const measurementCanvas = document.createElement("canvas");
      const measurementCtx = measurementCanvas.getContext("2d");
      if (!measurementCtx) {
        throw new Error("Canvas measurement context unavailable");
      }
      const drawWrappedText = (element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const x = rect.left - popupRect.left;
        const yStart = rect.top - popupRect.top;
        const maxWidth = Math.max(1, rect.width);
        const fontSize = Number.parseFloat(style.fontSize) || 16;
        const lineHeightValue = Number.parseFloat(style.lineHeight);
        const lineHeight = Number.isFinite(lineHeightValue) ? lineHeightValue : fontSize * 1.4;
        const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const paragraphs = (element.innerText || "").split("\n");
        let currentY = yStart + fontSize;
        const lines = [];
        measurementCtx.font = font;

        const pushSegmentedWord = (word, seed = "") => {
          let fragment = "";
          const prefix = seed ? `${seed} ` : "";
          for (const char of word) {
            const candidate = `${prefix}${fragment}${char}`;
            if (measurementCtx.measureText(candidate).width > maxWidth && fragment) {
              lines.push({ text: `${prefix}${fragment}`, x, y: currentY });
              currentY += lineHeight;
              fragment = char;
            } else if (measurementCtx.measureText(candidate).width > maxWidth) {
              lines.push({ text: `${prefix}${char}`, x, y: currentY });
              currentY += lineHeight;
              fragment = "";
            } else {
              fragment += char;
            }
          }
          return fragment;
        };

        paragraphs.forEach((paragraph, paragraphIndex) => {
          const words = paragraph.split(/\s+/).filter(Boolean);
          if (!words.length) {
            currentY += lineHeight;
            return;
          }
          let line = "";
          words.forEach((word) => {
            const testLine = line ? `${line} ${word}` : word;
            if (measurementCtx.measureText(testLine).width <= maxWidth) {
              line = testLine;
              return;
            }

            if (line) {
              lines.push({ text: line, x, y: currentY });
              currentY += lineHeight;
              line = "";
            }

            if (measurementCtx.measureText(word).width > maxWidth) {
              line = pushSegmentedWord(word);
            } else {
              line = word;
            }
          });
          if (line) {
            lines.push({ text: line, x, y: currentY });
            currentY += lineHeight;
          }
          if (paragraphIndex < paragraphs.length - 1) {
            currentY += lineHeight * 0.1;
          }
        });

        maxTextY = Math.max(maxTextY, currentY);
        drawInstructions.push({ lines, color: style.color || "#2f2f2f", font });
      };
      popup
        .querySelectorAll(".note-letter-header span, .note-letter-paper p, .note-letter-paper h1")
        .forEach((element) => drawWrappedText(element));

      const exportBottomPadding = 110;
      const contentBottom =
        (paperElement.getBoundingClientRect().top - popupRect.top) +
        paperElement.scrollHeight +
        exportBottomPadding;
      const exportHeight = Math.max(baseHeight, Math.ceil(maxTextY + 48), Math.ceil(contentBottom));
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = Math.max(1, Math.round(width * scale));
      exportCanvas.height = Math.max(1, Math.round(exportHeight * scale));
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
      ctx.drawImage(background, 0, 0, width, exportHeight);

      drawInstructions.forEach(({ lines, color, font }) => {
        ctx.fillStyle = color;
        ctx.font = font;
        lines.forEach(({ text, x, y }) => {
          ctx.fillText(text, x, y);
        });
      });

      const downloadName = `${(note.title || "tether-note-letter").replace(/\s+/g, "-").toLowerCase()}.png`;
      const imageBlob = await new Promise((resolve, reject) => {
        exportCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Unable to create image"));
          }
        }, "image/png");
      });

      const file = new File([imageBlob], downloadName, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: note.title || "Tether Note",
          text: "A letter from my past self.",
        });
      } else {
        const link = document.createElement("a");
        link.download = downloadName;
        link.href = URL.createObjectURL(imageBlob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch {
      setDeleteError("Unable to export your letter image right now.");
    } finally {
      letterPopupRef.current?.classList.remove("share-export");
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
                <button type="button" className="submit-btn note-letter-back-btn" onClick={handleClose}>
                  Back to Dashboard
                </button>
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