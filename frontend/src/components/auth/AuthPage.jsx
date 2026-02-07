import { useEffect, useState } from "react";
import "./AuthPage.css";
import "../../styles/main.css";
import "../../styles/auth.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5500";

export default function AuthPage({ defaultMode = "signup" }) {
  
  const [animated, setAnimated] = useState(false);
  const [activeForm, setActiveForm] = useState(defaultMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  // === trigger hero + auth animation ===
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 2500);
    setActiveForm(defaultMode);

    return () => clearTimeout(timer);
  }, [defaultMode]);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const name = e.target.signupName.value;
    const email = e.target.signupEmail.value;
    const password = e.target.signupPassword.value;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Sign up failed");

      localStorage.setItem("tetherToken", data.data.token);
      localStorage.setItem("tetherUser", JSON.stringify(data.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.signinEmail.value;
    const password = e.target.signinPassword.value;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign in failed");

      localStorage.setItem("tetherToken", data.data.token);
      localStorage.setItem("tetherUser", JSON.stringify(data.data.user));

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {/* HERO */}
      <div className={`hero-section ${animated ? "animated" : ""}`}>
        <div className="hero-content">
          <h1 className="brand-title">
            Tether Note*
          </h1>
          <p className="brand-subtitle">Messages to Your Future Self</p>
        </div>
      </div>

      {/* AUTH */}
      <div className={`auth-section ${animated ? "animated" : ""}`}>
        <div className={`auth-container ${animated ? "visible" : ""}`}>
        <p className="auth-context">
          {activeForm === "signup" ? "First time?" : "Welcome back!"}
        </p>
          <div className="auth-toggle">
          <button
            className={`toggle-btn ${activeForm === "signup" ? "active" : ""}`}
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign Up
          </button>

          <button
            className={`toggle-btn ${activeForm === "signin" ? "active" : ""}`}
            onClick={() => navigate("/signin")}
            type="button"
          >
            Sign In
          </button>
        </div>

          {/* SIGN UP */}
          <form
            className={`auth-form ${activeForm === "signup" ? "active" : ""} ${loading ? "loading" : ""}`}
            onSubmit={handleSignup}
          >
            <div className="form-group">
              <label className="form-label">Name</label>
              <input name="signupName" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="signupEmail" type="email" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="signupPassword" type="password" className="form-input" required />
            </div>

            {error && <div className="error-message show">{error}</div>}

            <button className="submit-btn">Create Account</button>
          </form>

          {/* SIGN IN */}
          <form
            className={`auth-form ${activeForm === "signin" ? "active" : ""} ${loading ? "loading" : ""}`}
            onSubmit={handleSignin}
          >
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="signinEmail" type="email" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="signinPassword" type="password" className="form-input" required />
            </div>

            {error && <div className="error-message show">{error}</div>}

            <button className="submit-btn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}
