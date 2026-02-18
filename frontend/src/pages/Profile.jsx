import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_BASE_URL = "http://localhost:5500";

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

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to update profile.");
      }

      localStorage.setItem("tetherUser", JSON.stringify(result.data));
      setCurrentUser(result.data);
      setFormData({
        ...EMPTY_FORM,
        name: result.data.name,
        email: result.data.email,
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
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-large">{avatarInitial}</div>

        {!isEditing ? (
          <div className="profile-view">
            <h2 className="profile-name">{currentUser.name || "User"}</h2>
            <p className="profile-email">{currentUser.email || "No email set"}</p>
            <p className="profile-helper">This email is used to sign in and receive your note reminders.</p>

            {feedback.message ? <p className={`profile-feedback ${feedback.type}`}>{feedback.message}</p> : null}

            <div className="profile-actions">
              <button className="save-btn" type="button" onClick={beginEditing}>Edit Profile</button>
              <button className="sign-out-btn" type="button" onClick={handleSignOut}>Sign Out</button>
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

              <div>
                <label htmlFor="confirmNewPassword">Confirm new password</label>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={formData.confirmNewPassword}
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
              <button className="save-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
              <button className="cancel-btn" type="button" onClick={cancelEditing}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
