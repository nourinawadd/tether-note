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
          <div className="folder-shell">
            <div className="folder-tab"></div>
            <div className="folder-body"></div>
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
