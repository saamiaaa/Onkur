
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign in failed.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <nav className="login-navbar">
        <Link href="/" className="login-logo">
          onkur<span>.</span>
        </Link>

        <p>
          New to Onkur? <Link href="/signup">Create an account</Link>
        </p>
      </nav>

      <section className="login-layout">
        {/* LEFT SIDE */}
        <div className="login-intro">
          <div className="login-intro-label">
            <span />
            WELCOME BACK
          </div>

          <h1>
            Your journey
            <br />
            continues <span>here.</span>
          </h1>

          <p className="login-intro-description">
            Pick up where you left off. Explore new opportunities,
            keep developing your skills, and stay connected.
          </p>

          <div className="login-book-scene">
            <div className="login-orbit login-orbit-one" />
            <div className="login-orbit login-orbit-two" />

            <div className="login-book">
              <div className="login-book-page login-book-left">
                <span className="login-book-sparkle">✦</span>
                <div className="login-book-lines">
                  <i /><i /><i />
                </div>
              </div>

              <div className="login-book-page login-book-right">
                <span className="login-book-star">✧</span>
                <div className="login-book-lines">
                  <i /><i /><i /><i />
                </div>
              </div>
            </div>

            <div className="login-floating-card login-floating-top">
              <span>✦</span> Keep exploring
            </div>

            <div className="login-floating-card login-floating-bottom">
              <span>↗</span> Your next step awaits
            </div>
          </div>

          <div className="login-intro-footer">
            <span>01 — DISCOVER</span>
            <span>02 — DEVELOP</span>
            <span>03 — CONNECT</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-form-wrapper">
          <div className="login-form-card">
            <div className="login-form-heading">
              <span className="login-step">GOOD TO SEE YOU AGAIN</span>
              <h2>
                Welcome <span>back.</span>
              </h2>
              <p>Sign in to continue your Onkur journey.</p>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <div className="login-password-label">
                <label htmlFor="login-password">Password</label>
                <Link href="/login" className="login-forgot">
                  Forgot password?
                </Link>
              </div>

              <div className="login-password-field">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="login-remember">
                <input type="checkbox" id="login-remember" />
                <label htmlFor="login-remember">Remember me</label>
              </div>

              {error && (
                <p style={{ color: "#ff7777", marginBottom: "12px" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <span>→</span>}
              </button>
            </form>

            <div className="login-divider">
              <span />
              <p>OR</p>
              <span />
            </div>

            <button type="button" className="login-google">
              <strong>G</strong>
              Continue with Google
            </button>

            <p className="login-mobile-signup">
              New to Onkur?{" "}
              <Link href="/signup">Create an account</Link>
            </p>

            <div className="login-secure-note">
              <span>✦</span> Your next chapter starts here.
            </div>
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <span>© 2026 ONKUR</span>
        <span>Made for the next generation of learners.</span>
      </footer>
    </main>
  );
}
