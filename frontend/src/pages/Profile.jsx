import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { updateProfile } from "../api/auth.api";

const EMPTY_FORM = {
  name: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function Profile() {
  const navigate = useNavigate();
  const savedUser = useMemo(() => JSON.parse(localStorage.getItem("tetherUser") || "{}"), []);
  const [currentUser, setCurrentUser] = useState(savedUser);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    name: savedUser.name || "",
    email: savedUser.email || "",
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("tetherToken");
    localStorage.removeItem("tetherUser");
    navigate("/signin");
  };

  const beginEditing = () => {
    setFeedback({ type: "", message: "" });
    setFormData({
      ...EMPTY_FORM,
      name: currentUser.name || "",
      email: currentUser.email || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFeedback({ type: "", message: "" });
    setFormData({
      ...EMPTY_FORM,
      name: currentUser.name || "",
      email: currentUser.email || "",
    });
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const trimmedName = formData.name.trim();
    const normalizedEmail = formData.email.trim().toLowerCase();
    const hasEmailChange = normalizedEmail !== (currentUser.email || "").toLowerCase();
    const hasNameChange = trimmedName !== (currentUser.name || "");
    const hasPasswordChange = Boolean(formData.newPassword || formData.confirmNewPassword);

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50) {
      return "Name must be between 2 and 50 characters.";
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!hasNameChange && !hasEmailChange && !hasPasswordChange) {
      return "No profile changes to save.";
    }

    if ((hasEmailChange || hasPasswordChange) && !formData.currentPassword) {
      return "Current password is required to change email or password.";
    }

    if (hasPasswordChange) {
      if (!formData.newPassword || !formData.confirmNewPassword) {
        return "Please fill both new password fields.";
      }

      if (!PASSWORD_REGEX.test(formData.newPassword)) {
        return "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        return "New password and confirmation do not match.";
      }
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback({ type: "", message: "" });

    const validationError = validateForm();
    if (validationError) {
      setFeedback({ type: "error", message: validationError });
      return;
    }

    const token = localStorage.getItem("tetherToken");
    if (!token) {
      setFeedback({ type: "error", message: "Please sign in again." });
      navigate("/signin");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
        confirmNewPassword: formData.confirmNewPassword || undefined,
      };

      const updatedUser = await updateProfile(token, payload);

      localStorage.setItem("tetherUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setFormData({
        ...EMPTY_FORM,
        name: updatedUser.name,
        email: updatedUser.email,
      });
      setFeedback({ type: "success", message: "Profile updated successfully." });
      setIsEditing(false);
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Unable to update profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarInitial = (currentUser.name || "U")[0]?.toUpperCase() || "U";

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="brand-title">
          <img src="/assets/images/tether-note-logo.svg" alt="Tether Note logo" className="brand-logo" />
          <span>Tether Note*</span>
        </h1>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <button className="profile-btn profile-btn-active" onClick={() => navigate("/profile")}>
            <div className="profile-avatar">{avatarInitial}</div>
          </button>
        </div>
      </nav>

      <main className="profile-main">
        <section className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-large">{avatarInitial}</div>
            <h2>{isEditing ? "Edit profile" : "Your profile"}</h2>
          </div>
          {!isEditing ? (
            <div className="profile-view">
              <h3 className="profile-name">{currentUser.name || "User"}</h3>
              <p className="profile-email">{currentUser.email || "No email set"}</p>
              <p>
              Keep your account details up to date so reminders and sign-in details always stay in sync.
            </p>

              {feedback.message ? <p className={`profile-feedback ${feedback.type}`}>{feedback.message}</p> : null}

              <div className="profile-actions">
                <button className="profile-primary-btn" type="button" onClick={beginEditing}>Edit Profile</button>
                <button className="profile-secondary-btn" type="button" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                <button className="profile-secondary-btn" type="button" onClick={handleSignOut}>Sign Out</button>
                </div>
            </div>
            ) : (
            <form className="profile-form" onSubmit={handleSubmit}>
              <label htmlFor="name">Display name</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} maxLength={50} required />

              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

              <label htmlFor="currentPassword">Current password (required for email/password changes)</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
              />

              <div className="password-row">
                <div>
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>

              </div>
              <p className="profile-password-hint">
                Password must be at least 8 characters and include uppercase, lowercase, and a number.
              </p>

              {feedback.message ? <p className={`profile-feedback ${feedback.type}`}>{feedback.message}</p> : null}
            <div className="profile-actions">
                <button className="profile-primary-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
                <button className="profile-secondary-btn" type="button" onClick={cancelEditing}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
      <footer className="profile-footer">Tether Note™</footer>
    </div>
  );
}
