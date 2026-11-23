
"use client";

import { useState } from "react";
import Link from "next/link";


export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

            <form
              className="signup-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Sign up design preview — backend coming later.");
              }}
            >
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />

              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="signup-password">Password</label>
              <div className="signup-password-field">
                <input
                  id="signup-password"
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
                <input type="checkbox" id="signup-terms" required />
                <label htmlFor="signup-terms">
                  I agree to the <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>.
                </label>
              </div>

              <button type="submit" className="signup-submit">
                Create account <span>→</span>
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
