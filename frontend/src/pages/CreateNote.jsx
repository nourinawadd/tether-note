import { useMemo, useState } from "react";
import "./CreateNote.css";
import { createNote } from "../api/auth.api";

const DEFAULT_FORM = {
  title: "",
  content: "",
  openAt: "",
  reminderAt: "",
  envelopeColor: "red",
};


const ENVELOPE_STYLE_OPTIONS = [
  {
    value: "red",
    label: "Red",
    swatch: "#be3a3f",
    envelopeImage: "/assets/images/envelopes/closed-red.png",
    letterBackground: "/assets/images/write-note/letter-bg.png",
  },
  {
    value: "blue",
    label: "Blue",
    swatch: "#4f75c5",
    envelopeImage: "/assets/images/envelopes/closed-blue.png",
    letterBackground: "/assets/images/write-note/letter-bg-blue.png",
  },
  {
    value: "purple",
    label: "Purple",
    swatch: "#8e6ab3",
    envelopeImage: "/assets/images/envelopes/closed-purple.png",
    letterBackground: "/assets/images/write-note/letter-bg-purple.png",
  },
  {
    value: "green",
    label: "Green",
    swatch: "#6b8d5f",
    envelopeImage: "/assets/images/envelopes/closed-green.png",
    letterBackground: "/assets/images/write-note/letter-bg-green.png",
  },
  {
    value: "yellow",
    label: "Yellow",
    swatch: "#cfb35b",
    envelopeImage: "/assets/images/envelopes/closed-yellow.png",
    letterBackground: "/assets/images/write-note/letter-bg-yellow.png",
  },
];


export default function CreateNote({ onClose, onCreated }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minimumDate = useMemo(() => {
    const nextMinute = new Date(Date.now() + 60 * 1000);
    return nextMinute.toISOString().slice(0, 16);
  }, []);

  const selectedEnvelope =
    ENVELOPE_STYLE_OPTIONS.find((option) => option.value === formData.envelopeColor) ||
    ENVELOPE_STYLE_OPTIONS[0];

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
      envelopeColor: formData.envelopeColor,
      reminderAt: formData.reminderAt ? new Date(formData.reminderAt).toISOString() : undefined,
    };

    setIsSubmitting(true);

    try {
      await createNote(token, payload);

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
      <div
        className="letter-form-popup"
        style={{ backgroundImage: `url(${selectedEnvelope.letterBackground})` }}
      >
        <button className="close-note-btn" onClick={onClose} aria-label="Close create note form">
          x
        </button>

        <form className="letter-form" onSubmit={handleSubmit}>
          <h1>Seal a Note for Later</h1>
          <p className="form-subtitle">
            Write a little note to future you, choose when it arrives, and seal it with care.
          </p>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="A note for tomorrow"
            value={formData.title}
            onChange={handleChange}
            maxLength={120}
          />

          <label htmlFor="content">Your letter*</label>
          <textarea
            id="content"
            name="content"
            placeholder="Dear future me, I hope this note finds you smiling today..."
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
              <label htmlFor="reminderAt">Reminder date</label>
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
          <div className="envelope-style-row" aria-label="Envelope style preview">
            <img src={selectedEnvelope.envelopeImage} alt="Envelope preview" className="envelope-preview" />
            <div className="color-swatch-group" role="radiogroup" aria-label="Envelope colour options">
              {ENVELOPE_STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`color-swatch-btn ${formData.envelopeColor === option.value ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      envelopeColor: option.value,
                    }))
                  }
                  aria-pressed={formData.envelopeColor === option.value}
                  aria-label={`Set envelope colour to ${option.label}`}
                  title={option.label}
                >
                  <span className="color-swatch-dot" style={{ backgroundColor: option.swatch }} />
                </button>
              ))}
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
