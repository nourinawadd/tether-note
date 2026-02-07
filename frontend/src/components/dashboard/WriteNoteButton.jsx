import { useState } from "react";
import "./WriteNoteButton.css";

export default function WriteNoteButton({ promptText, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  // Different colored note pages
  const notePages = [
    { color: "#FFE66D", emoji: "📝" },
    { color: "#FFEAA7", emoji: "✍️" },
    { color: "#FFF9E6", emoji: "💭" },
    { color: "#FFD93D", emoji: "📄" },
  ];

  return (
    <button
      className="write-note-btn"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="btn-content">
        <div className="images-badge-wrapper">
          <div className={`stacked-pages ${isHovered ? "hovered" : ""}`}>
            {notePages.map((page, index) => (
              <div
                key={index}
                className={`stacked-page page-${index + 1}`}
                style={{
                  background: `linear-gradient(135deg, ${page.color}, ${adjustBrightness(page.color, -10)})`,
                  zIndex: notePages.length - index,
                }}
              >
                {index === notePages.length - 1 && (
                  <span className="page-emoji">{page.emoji}</span>
                )}
              </div>
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

// Helper function to adjust color brightness
function adjustBrightness(color, amount) {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}