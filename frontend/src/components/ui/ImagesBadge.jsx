import "./ImagesBadge.css";

export default function ImagesBadge({ text, images = [] }) {
  return (
    <div className="images-badge">
      <div className="images-badge__stack">
        {images.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            className="images-badge__image"
            style={{ zIndex: images.length - index }}
          />
        ))}
      </div>
      <span className="images-badge__text">{text}</span>
    </div>
  );
}
