import "./WriteNoteButton.css";

export default function WriteNoteButton({ promptText, onClick }) {
  const folderBackSrc = "/assets/images/write-note/folder-layer-back.png";
  const folderFrontSrc = "/assets/images/write-note/folder-layer-front.png";

  const letterImages = [
    "/assets/images/write-note/letter-1.png",
    "/assets/images/write-note/letter-2.png",
    "/assets/images/write-note/letter-3.png",
  ];

  return (
    <button className="write-note-btn" onClick={onClick}>
      <div className="btn-content">
        <div className="folder-badge" aria-hidden="true">
          <img src={folderBackSrc} alt="" className="folder-layer folder-back" />

          <div className="folder-pocket">
            {letterImages.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt=""
                className="folder-image"
              />
            ))}
          </div>
          <img src={folderFrontSrc} alt="" className="folder-layer folder-front" />
        </div>
        <span className="btn-text">
          Write a <span className="prompt-text">{promptText}</span>
        </span>
      </div>
    </button>
  );
}
