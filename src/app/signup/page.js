
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const educationLevel = formData.get("educationLevel");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!educationLevel) {
      setError("Please select your current education level.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          password,
          educationLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create your account.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-glow signup-glow-one" />
      <div className="signup-glow signup-glow-two" />

      <nav className="signup-navbar">
        <Link href="/" className="signup-logo">
          onkur<span>.</span>
        </Link>

        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </nav>

      <section className="signup-layout">
        <div className="signup-intro">
          <div className="signup-intro-label">
            <span /> YOUR JOURNEY STARTS HERE
          </div>

          <h1>
            Every big journey
            <br />
            starts with a <span>small step.</span>
          </h1>

          <p className="signup-intro-description">
            Discover opportunities, develop your skills, and connect
            with a community that helps you grow.
          </p>

          <div className="signup-book-scene">
            <div className="signup-orbit signup-orbit-one" />
            <div className="signup-orbit signup-orbit-two" />

            <div className="signup-book">
              <div className="signup-book-page signup-book-left">
                <span className="book-sparkle">✦</span>
                <div className="book-lines">
                  <i /><i /><i />
                </div>
              </div>

              <div className="signup-book-page signup-book-right">
                <span className="book-star">✧</span>
                <div className="book-lines">
                  <i /><i /><i /><i />
                </div>
              </div>
            </div>

            <div className="signup-floating-card signup-floating-top">
              <span>✦</span> Discover
            </div>

            <div className="signup-floating-card signup-floating-bottom">
              <span>↗</span> Grow at your pace
            </div>
          </div>

          <div className="signup-intro-footer">
            <span>01 — DISCOVER</span>
            <span>02 — DEVELOP</span>
            <span>03 — CONNECT</span>
          </div>
        </div>

        <div className="signup-form-wrapper">
          <div className="signup-form-card">
            <div className="signup-form-heading">
              <span className="signup-step">LET'S GET STARTED</span>
              <h2>
                Create your <span>account.</span>
              </h2>
              <p>Join Onkur and take the next step in your journey.</p>
            </div>

            <form className="signup-form" onSubmit={handleSignup}>
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="signup-education">
                Current education level
              </label>
              <select
                id="signup-education"
                name="educationLevel"
                defaultValue=""
                required
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  marginBottom: "18px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "#191a22",
                  color: "#f1f0eb",
                  fontSize: "14px",
                  outline: "none",
                }}
              >
                <option value="" disabled>
                  Select your education level
                </option>
                <option value="high_school">
                  High School / HSC Student
                </option>
                <option value="university">
                  University Student
                </option>
              </select>

              <label htmlFor="signup-password">Password</label>
              <div className="signup-password-field">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <label htmlFor="signup-confirm">Confirm password</label>
              <div className="signup-password-field">
                <input
                  id="signup-confirm"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Enter your password again"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>

              <div className="signup-terms">
                <input
                  type="checkbox"
                  id="signup-terms"
                  required
                />
                <label htmlFor="signup-terms">
                  I agree to the <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </label>
              </div>

              {error && (
                <p style={{ color: "#ff7777", marginBottom: "12px" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="signup-submit"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="signup-divider">
              <span />
              <p>OR</p>
              <span />
            </div>

            <button type="button" className="signup-google">
              <strong>G</strong>
              Continue with Google
            </button>

            <p className="signup-mobile-login">
              Already have an account? <Link href="/login">Sign in</Link>
            </p>

            <div className="signup-secure-note">
              <span>✦</span> A space to learn, explore and grow.
            </div>
          </div>
        </div>
      </section>

      <footer className="signup-footer">
        <span>© 2026 ONKUR</span>
        <span>Made for the next generation of learners.</span>
      </footer>
    </main>
  );
}
