import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("tetherUser") || "{}");

  const handleSignOut = () => {
    localStorage.removeItem("tetherToken");
    localStorage.removeItem("tetherUser");
    navigate("/signin");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1>Profile</h1>
      </div>
      
      <div className="profile-content">
        <div className="profile-avatar-large">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
        <h2 className="profile-name">{user.name || "User"}</h2>
        <p className="profile-email">{user.email || "No email"}</p>
        
        <div className="profile-actions">
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
        
        <p className="placeholder-text">
          Profile settings coming soon...
        </p>
      </div>
    </div>
  );
}