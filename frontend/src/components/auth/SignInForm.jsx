import { useState } from "react";
import { signIn } from "../../api/auth.api";

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signIn(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form active" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-input" required />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          name="password"
          type="password"
          className="form-input"
          required
        />
      </div>

      {error && <div className="error-message show">{error}</div>}

      <button className="submit-btn" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
