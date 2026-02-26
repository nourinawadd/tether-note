import useBackgroundAudio from "../../hooks/useBackgroundAudio";

export default function MusicToggleButton() {
  const { isMuted, toggleMute } = useBackgroundAudio();

  return (
    <button
      type="button"
      className="music-toggle-btn"
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute background nature sounds" : "Mute background nature sounds"}
      aria-pressed={!isMuted}
      title={isMuted ? "Unmute nature sounds" : "Mute nature sounds"}
    >
      <span aria-hidden="true" className="music-toggle-icon">
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M4 10v4h4l5 4V6L8 10H4z" fill="currentColor" />
          {isMuted ? (
            <path d="M16 9l5 6m0-6l-5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M16 9a5 5 0 010 6m2.5-8.5a8 8 0 010 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </span>
    </button>
  );
}
