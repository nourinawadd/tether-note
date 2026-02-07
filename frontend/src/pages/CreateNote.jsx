import { useNavigate } from "react-router-dom";
import "./CreateNote.css";

export default function CreateNote() {
  const navigate = useNavigate();

  return (
    <div className="create-note-container">
      <div className="create-note-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1>Create New Note</h1>
      </div>
      
      <div className="create-note-content">
        <p className="placeholder-text">
          Create Note page is under construction...
        </p>
        <p className="placeholder-subtext">
          This is where you'll be able to write your note and set when it should be unlocked.
        </p>
      </div>
    </div>
  );
}