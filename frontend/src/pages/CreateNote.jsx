import { useMemo, useState } from "react";
import "./CreateNote.css";

const DEFAULT_FORM = {
  title: "",
  content: "",
  openAt: "",
  reminderAt: "",
};

export default function CreateNote({ onClose, onCreated }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minimumDate = useMemo(() => {
    const nextMinute = new Date(Date.now() + 60 * 1000);
    return nextMinute.toISOString().slice(0, 16);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!formData.content.trim()) {
      setErrorMessage("Please add the note content before saving.");
      return;
    }

    if (!formData.openAt) {
      setErrorMessage("Please choose when this note should unlock.");
      return;
    }

    if (formData.reminderAt && formData.reminderAt >= formData.openAt) {
      setErrorMessage("Reminder time must be before the unlock date.");
      return;
    }

    const token = localStorage.getItem("tetherToken");
    if (!token) {
      setErrorMessage("Please sign in again before creating a note.");
      return;
    }

    const payload = {
      title: formData.title.trim() || undefined,
      content: formData.content.trim(),
      openAt: new Date(formData.openAt).toISOString(),
      reminderAt: formData.reminderAt ? new Date(formData.reminderAt).toISOString() : undefined,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5500/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to create note right now.");
      }

      setStatusMessage("Your note is sealed and scheduled.");
      setFormData(DEFAULT_FORM);

      setTimeout(() => {
        onCreated?.();
        onClose?.();
      }, 800);
    } catch (error) {
      setErrorMessage(error.message || "Unable to create note right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-note-overlay" role="dialog" aria-modal="true" aria-label="Create note form">
      <div className="letter-form-popup">
        <button className="close-note-btn" onClick={onClose} aria-label="Close create note form">
          ✕
        </button>

        <form className="letter-form" onSubmit={handleSubmit}>
          <h1>Seal a Note for Later</h1>
          <p className="form-subtitle">
            Write your note, choose when it unlocks, and optionally add a reminder.
          </p>

          <label htmlFor="title">Title (optional)</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Untitled Note"
            value={formData.title}
            onChange={handleChange}
            maxLength={120}
          />

          <label htmlFor="content">Note content *</label>
          <textarea
            id="content"
            name="content"
            placeholder="Write what you want your future self to read..."
            value={formData.content}
            onChange={handleChange}
            rows={8}
            required
          />

          <div className="date-row">
            <div>
              <label htmlFor="openAt">Unlock date *</label>
              <input
                id="openAt"
                name="openAt"
                type="datetime-local"
                value={formData.openAt}
                onChange={handleChange}
                min={minimumDate}
                required
              />
            </div>

            <div>
              <label htmlFor="reminderAt">Reminder date (optional)</label>
              <input
                id="reminderAt"
                name="reminderAt"
                type="datetime-local"
                value={formData.reminderAt}
                onChange={handleChange}
                min={minimumDate}
                max={formData.openAt || undefined}
              />
            </div>
          </div>

          {errorMessage ? <p className="form-feedback error">{errorMessage}</p> : null}
          {statusMessage ? <p className="form-feedback success">{statusMessage}</p> : null}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Sealing..." : "Seal Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
