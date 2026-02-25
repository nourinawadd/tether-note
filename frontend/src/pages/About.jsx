import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/nourinawad/",
    note: "Connect professionally",
  },
  {
    label: "GitHub",
    href: "https://github.com/nourinawadd",
    note: "See more projects",
  },
  {
    label: "CV",
    href: "https://drive.google.com/file/d/1NYdVaG6mnOhXrJPtk70owXE7J9469PDO/view?usp=drive_link",
    note: "Read my resume",
  },
];

export default function About() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("tetherUser") || "{}"), []);

  return (
      <div className="dashboard-container">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <h1 className="brand-title">
          <img src="/assets/images/tether-note-logo.svg" alt="Tether Note logo" className="brand-logo" />
          <span>Tether Note*</span>
        </h1>
        <div className="nav-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/about" className="nav-link active">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <button className="profile-btn" onClick={() => navigate("/profile")}>
            <div className="profile-avatar">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          </button>
        </div>
      </nav>

      <main className="about-content">
        <section className="about-card">
          <div>
            <h2>What is Tether Note?</h2>
            <p>
              I&apos;m a computer engineering student, and I built Tether Note as a practice project while
              learning and improving my full-stack skills.
            </p>
            <p>
              I really love the idea of time capsules and "communicating" with your future self, so I made
              this little corner of the internet where you can write letters now and open them later — whether that's 3 days from now, or 3 years.
            </p>
            <p>If you&apos;re interested in my work, feel free to check out my links below ♡</p>
          </div>

          <div className="about-links">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="about-link-card">
                <span>{link.label}</span>
                <small>{link.note}</small>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="about-footer">Made with care by Nourin.</footer>
    </div>
  );
}
