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
    <div className="about-page">
      <nav className="about-nav">
        <h1 className="about-brand">Tether Note*</h1>
        <div className="about-nav-links">
          <button className="about-nav-link" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>
          <span className="about-nav-link active">About</span>
          <button className="about-profile-btn" onClick={() => navigate("/profile")}>
            <div className="about-profile-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
          </button>
        </div>
      </nav>

      <main className="about-content">
        <section className="about-card">
          <div>
            <p className="about-kicker">Hello, I&apos;m</p>
            <h2>Nourin Awad</h2>
            <p>
              I&apos;m a computer engineering student, and I built Tether Note as a practice project while
              learning and improving my full-stack skills.
            </p>
            <p>
              I really love the idea of time capsules and "communicating" with your future self. So I made
              this little corner of the internet where you can write letters now and open them later.
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
