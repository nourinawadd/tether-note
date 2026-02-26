import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Contact.css";
import MusicToggleButton from "../components/ui/MusicToggleButton";

const SUPPORT_EMAIL = "tethernote.app@gmail.com";

export default function Contact() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("tetherUser") || "{}"), []);

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1 className="brand-title">
          <img src="/assets/images/tether-note-logo.svg" alt="Tether Note logo" className="brand-logo" />
          <span>Tether Note</span>
        </h1>
        <div className="nav-links">
          <MusicToggleButton />
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link active">Contact</Link>
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <div className="profile-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
          </button>
        </div>
      </nav>

      <main className="contact-main">
        <section className="contact-card">
          <h2>Need help with the website?</h2>
          <p>
            If you run into any issues while using Tether Note, please send me an email and include what happened.
          </p>
          <a
            className="contact-email-link"
            href={`mailto:${SUPPORT_EMAIL}?subject=Tether%20Note%20Website%20Issue`}
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="contact-tip">Tip: adding screenshots and steps to reproduce makes debugging much faster.</p>
        </section>
      </main>

      <footer className="contact-footer">Thanks for helping improve Tether Note.</footer>
    </div>
  );
}