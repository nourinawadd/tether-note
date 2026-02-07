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
        <ImagesBadge
          text="Introducing Agenforce Marketing Template"
          images={badgeImages}
        />
        <span className="btn-text">
          Write a <span className="prompt-text">{promptText}</span>
        </span>
      </div>
    </button>
  );
}
