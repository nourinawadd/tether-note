import "./WriteNoteButton.css";
import ImagesBadge from "../ui/ImagesBadge";

export default function WriteNoteButton({ promptText, onClick }) {
  const badgeImages = [
    "https://assets.aceternity.com/pro/agenforce-1.webp",
    "https://assets.aceternity.com/pro/agenforce-2.webp",
    "https://assets.aceternity.com/pro/agenforce-3.webp",
  ];

  return (
    <button className="write-note-btn" onClick={onClick}>
      <div className="btn-content">
        <div className="folder-badge" aria-hidden="true">
          <div className="folder-icon">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h4.69c.7 0 1.37.28 1.87.78l.94.94c.2.2.47.31.75.31h4.25A2.75 2.75 0 0 1 21 8.75v8.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25v-10.5Z" />
            </svg>
          </div>
          <div className="folder-images">
            {badgeImages.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt=""
                className="folder-image"
                style={{ "--image-index": index }}
              />
            ))}
          </div>
        </div>
        <span className="btn-text">
          Write a <span className="prompt-text">{promptText}</span>
        </span>
      </div>
    </button>
  );
}
