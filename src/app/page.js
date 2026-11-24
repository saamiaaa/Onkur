
"use client";

import "./HomeHeroAnimation.css";
import { useEffect, useState } from "react";
import ParticleBookIntro from "./components/ParticleBookIntro";
import CursorParticles from "./components/CursorParticles";
import ScrollReveal from "./components/ScrollReveal";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const problems = [
  {
    number: "01",
    title: "Too many choices. No clear direction.",
    description:
      "Choosing a university, degree or career path can feel overwhelming when reliable guidance is scattered everywhere.",
  },
  {
    number: "02",
    title: "Studying abroad feels complicated.",
    description:
      "Tuition fees, scholarships, admission requirements and living costs make comparing international universities difficult.",
  },
  {
    number: "03",
    title: "Potential without a roadmap.",
    description:
      "Knowing your dream career is only the beginning. Understanding the skills and steps needed to reach it matters too.",
  },
];

const pillars = [
  {
    number: "01",
    icon: "⌕",
    title: "Discover",
    description:
      "Explore universities in Bangladesh and abroad, compare degrees, discover scholarships and find career paths aligned with your interests.",
    link: "Explore your options",
    id: "discover",
    href: "/universities",
  },
  {
    number: "02",
    icon: "✳",
    title: "Develop",
    description:
      "Understand the skills your chosen path requires, follow personalized roadmaps and prepare for your academic and professional future.",
    link: "Build your future",
    id: "develop",
    href: "/develop",
  },
  {
    number: "03",
    icon: "◎",
    title: "Connect",
    description:
      "Connect with mentors, university students and alumni. Share experiences, ask questions and grow with your community.",
    link: "Find your people",
    id: "connect",
    href: "/connect",
  },
];

const features = [
  "Explore universities in Bangladesh and overseas",
  "Compare programs, tuition and admission requirements",
  "Discover scholarships and financial opportunities",
  "Explore careers based on your interests",
];

const comparison = [
  { label: "Location", local: "Bangladesh", abroad: "International" },
  { label: "Programs", local: "Explore degrees", abroad: "Explore degrees" },
  { label: "Costs", local: "Tuition overview", abroad: "Tuition + living costs" },
  { label: "Funding", local: "Scholarships", abroad: "Scholarships & aid" },
];

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingDestination, setPendingDestination] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function checkAuthentication() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (isMounted) {
          setIsAuthenticated(response.ok);
        }
      } catch (error) {
        console.error("Homepage authentication check failed:", error);

        if (isMounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    }

    checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleProtectedNavigation(event, destination) {
    event.preventDefault();

    if (!authChecked) {
      setPendingDestination(destination);
      setShowAuthModal(true);
      return;
    }

    if (isAuthenticated) {
      window.location.href = destination;
      return;
    }

    setPendingDestination(destination);
    setShowAuthModal(true);
  }

  function closeAuthModal() {
    setShowAuthModal(false);
    setPendingDestination("");
  }

  return (
    <>
      <CursorParticles />
      <div className="site-background" />

      <header className="container navbar">
        <a href="/" className="logo">
          onkur<span>.</span>
        </a>

        <nav className="nav-links">
          <a
            href="/universities"
            onClick={(event) =>
              handleProtectedNavigation(event, "/universities")
            }
          >
            Universities
          </a>

          <a
            href="/careers"
            onClick={(event) =>
              handleProtectedNavigation(event, "/careers")
            }
          >
            Careers
          </a>

          <a
            href="/develop"
            onClick={(event) =>
              handleProtectedNavigation(event, "/develop")
            }
          >
            Develop
          </a>

          <a
            href="/connect"
            onClick={(event) =>
              handleProtectedNavigation(event, "/connect")
            }
          >
            Connect
          </a>
        </nav>

        <div className="nav-actions">
          {isAuthenticated && authChecked ? (
            <a href="/dashboard" className="primary-button">
              My Dashboard →
            </a>
          ) : (
            <>
              <a href="/login" className="login-link">
                Log in
              </a>
              <a href="/signup" className="primary-button">
                Get Started →
              </a>
            </>
          )}
        </div>
      </header>

      <main>
        <ScrollReveal />
        <ParticleBookIntro />

        <section className="container hero" data-reveal>
          <div>
            <div className="eyebrow">Your future, figured out</div>

            <h1>
              Not sure where
              <br />
              your future <span>begins?</span>
            </h1>

            <p className="hero-description">
              Find the right university. Discover your career path.
              Make your next move. Explore opportunities in Bangladesh
              and abroad, all in one place.
            </p>

            <div className="hero-buttons">
              <a href="#discover" className="primary-button">
                Find your path →
              </a>
              <a href="#about" className="secondary-button">
                Explore Onkur ↓
              </a>
            </div>

            <p className="hero-note">
              UNIVERSITY &nbsp; · &nbsp; CAREER &nbsp; · &nbsp; GROWTH
            </p>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="dashboard-card">
              <div className="dashboard-top">
                <strong>onkur. / explore your future</strong>
                <span className="dashboard-label">Discover</span>
              </div>

              <p className="dashboard-label" style={{ marginTop: 22 }}>
                YOUR UNIVERSITY EXPLORER
              </p>

              <h3 className="dashboard-heading">
                Find your possibilities ✨
              </h3>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Computer Science & Engineering</h4>
                  <span className="match">Program</span>
                </div>
                <p>Explore universities · Compare programs</p>
              </div>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Study Abroad</h4>
                  <span className="match">Explore</span>
                </div>
                <p>Tuition · Living costs · Scholarships</p>
              </div>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Career Exploration</h4>
                  <span className="match">Discover</span>
                </div>
                <p>Interests · Skills · Career possibilities</p>
              </div>

              <div className="skill-row">
                <span className="skill">Bangladesh</span>
                <span className="skill">Abroad</span>
                <span className="skill">Career paths</span>
              </div>
            </div>

            <div className="floating-note">
              <strong>01</strong>
              <p>Your next chapter</p>
            </div>
          </div>
        </section>

        <section className="container section" id="about" data-reveal>
          <div className="section-heading">
            <div className="eyebrow">Why Onkur exists</div>
            <h2>
              Your future is too important
              <span> to figure out alone.</span>
            </h2>
            <p>
              From choosing a degree to planning a career, every
              student deserves access to clear information and
              meaningful guidance.
            </p>
          </div>

          <div className="problem-grid">
            {problems.map((problem) => (
              <article className="problem-card" key={problem.number}>
                <div className="card-number">{problem.number}</div>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container section" data-reveal>
          <div className="section-heading">
            <div className="eyebrow">One platform, three possibilities</div>
            <h2>
              Find your direction.
              <span> Build your future.</span>
            </h2>
            <p>
              From your first university search to your future career,
              Onkur helps you navigate every step.
            </p>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article
                className="pillar-card"
                key={pillar.number}
                id={pillar.id}
              >
                <div className="card-number">{pillar.number}</div>
                <div className="pillar-icon">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>

                <a
                  href={pillar.href}
                  className="pillar-link"
                  onClick={(event) =>
                    handleProtectedNavigation(event, pillar.href)
                  }
                >
                  {pillar.link} →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          className="container section feature-section"
          id="discover"
          data-reveal
        >
          <div>
            <div className="eyebrow">Your options, side by side</div>
            <div className="section-heading">
              <h2>
                Bangladesh or
                <span> beyond?</span>
              </h2>
              <p>
                Explore academic opportunities locally and
                internationally. Compare what matters before
                making one of life's biggest decisions.
              </p>
            </div>

            <ul className="feature-list">
              {features.map((feature) => (
                <li key={feature}>
                  <span className="check">✦</span> {feature}
                </li>
              ))}
            </ul>

            <a
              href="/universities"
              className="primary-button"
              style={{ marginTop: 22 }}
              onClick={(event) =>
                handleProtectedNavigation(event, "/universities")
              }
            >
              Open University Explorer →
            </a>
          </div>

          <div className="preview-panel">
            <p className="dashboard-label">UNIVERSITY EXPLORER</p>
            <h3 style={{ marginTop: 10 }}>Explore your options</h3>

            <div className="comparison-table">
              <div className="comparison-row comparison-header">
                <span>Explore</span>
                <span>Local</span>
                <span>Abroad</span>
              </div>

              {comparison.map((item) => (
                <div className="comparison-row" key={item.label}>
                  <span>{item.label}</span>
                  <span>{item.local}</span>
                  <span>{item.abroad}</span>
                </div>
              ))}
            </div>

            <p className="preview-caption">
              Compare academic pathways and explore what suits your goals.
            </p>
          </div>
        </section>

        <section className="container section" id="careers" data-reveal>
          <div className="section-heading">
            <div className="eyebrow">Beyond choosing a degree</div>
            <h2>
              Don't just choose what to study.
              <span> Discover why.</span>
            </h2>
            <p>
              Explore career possibilities, understand the skills
              different professions require and connect your
              academic choices with long-term ambitions.
            </p>
          </div>

          <div className="pillar-grid">
            <article className="pillar-card">
              <div className="pillar-icon">⌘</div>
              <h3>Explore careers</h3>
              <p>
                Discover career paths based on your interests, strengths
                and academic preferences.
              </p>
              <a
                href="/careers"
                className="pillar-link"
                onClick={(event) =>
                  handleProtectedNavigation(event, "/careers")
                }
              >
                Explore careers →
              </a>
            </article>

            <article className="pillar-card">
              <div className="pillar-icon">✳</div>
              <h3>Understand skills</h3>
              <p>
                Learn about the technical and professional skills
                different careers demand.
              </p>
            </article>

            <article className="pillar-card">
              <div className="pillar-icon">↗</div>
              <h3>Plan your journey</h3>
              <p>
                Connect your education, learning goals and future
                career into a clearer roadmap.
              </p>
            </article>
          </div>
        </section>

        <section
          className="container section feature-section"
          id="develop"
          data-reveal
        >
          <div>
            <div className="eyebrow">Growth with direction</div>
            <div className="section-heading">
              <h2>
                Turn your ambitions
                <span> into action.</span>
              </h2>
              <p>
                Once you find your direction, Onkur helps you
                prepare for it with learning plans, skills and
                meaningful progress.
              </p>
            </div>

            <ul className="feature-list">
              <li><span className="check">✦</span> Personalized skill roadmaps</li>
              <li><span className="check">✦</span> Academic and career preparation</li>
              <li><span className="check">✦</span> Project and portfolio development</li>
              <li><span className="check">✦</span> Learning progress tracking</li>
            </ul>

            <a
              href="/develop"
              className="primary-button"
              style={{ marginTop: 22 }}
              onClick={(event) =>
                handleProtectedNavigation(event, "/develop")
              }
            >
              Start Developing →
            </a>
          </div>

          <div className="preview-panel">
            <p className="dashboard-label">ILLUSTRATIVE LEARNING ROADMAP</p>
            <h3 style={{ marginTop: 10 }}>Prepare for your goals</h3>

            {[
              { name: "Explore your interests", width: "100%", value: "Done" },
              { name: "Research degree options", width: "70%", value: "In progress" },
              { name: "Build relevant skills", width: "35%", value: "Starting" },
              { name: "Prepare your portfolio", width: "10%", value: "Upcoming" },
            ].map((item) => (
              <div className="progress-item" key={item.name}>
                <div>
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container section" id="connect" data-reveal>
          <div className="section-heading">
            <div className="eyebrow">You don't have to do it alone</div>
            <h2>
              Learn from people
              <span> who've been there.</span>
            </h2>
            <p>
              Connect with mentors, university students and alumni
              who can share experiences and help you navigate
              your next steps.
            </p>

            <a
              href="/connect"
              className="primary-button"
              style={{ marginTop: 22 }}
              onClick={(event) =>
                handleProtectedNavigation(event, "/connect")
              }
            >
              Visit Community →
            </a>
          </div>
        </section>

        <section className="container" data-reveal>
          <div className="cta-section">
            <div className="eyebrow">Your story starts here</div>
            <h2>
              Your next chapter
              <span> starts now.</span>
            </h2>
            <p>
              Explore your possibilities. Make informed decisions.
              Start building the future you imagine.
            </p>
            <a href="/signup" className="primary-button">
              Find your path →
            </a>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <div>
          <a href="/" className="logo">
            onkur<span>.</span>
          </a>
          <p style={{ marginTop: 12 }}>
            Find your direction. Build your future.
          </p>
          <p style={{ marginTop: 8 }}>
            © 2026 Onkur. All rights reserved.
          </p>
        </div>

        <div className="footer-links">
          {[
            { label: "Universities", href: "/universities" },
            { label: "Careers", href: "/careers" },
            { label: "Develop", href: "/develop" },
            { label: "Connect", href: "/connect" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) =>
                handleProtectedNavigation(event, item.href)
              }
            >
              {item.label}
            </a>
          ))}
        </div>
      </footer>

      {showAuthModal && (
        <div
          role="presentation"
          onClick={closeAuthModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            background: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(8px)",
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 430,
              padding: "38px 32px",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 18,
              background: "#191a23",
              boxShadow: "0 25px 80px rgba(0,0,0,0.5)",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={closeAuthModal}
              aria-label="Close login prompt"
              style={{
                position: "absolute",
                top: 14,
                right: 17,
                border: "none",
                background: "transparent",
                color: "#a4a4b2",
                fontSize: 24,
                cursor: "pointer",
              }}
            >
              ×
            </button>

            <div
              style={{
                width: 58,
                height: 58,
                margin: "0 auto 20px",
                display: "grid",
                placeItems: "center",
                borderRadius: 16,
                background: "rgba(248,217,67,0.1)",
                color: "#f8d943",
                fontSize: 27,
              }}
            >
              ✦
            </div>

            <p
              style={{
                color: "#f8d943",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: 2,
                marginBottom: 13,
              }}
            >
              YOUR ONKUR JOURNEY
            </p>

            <h2
              id="auth-modal-title"
              style={{
                color: "#f1f0eb",
                fontSize: 27,
                lineHeight: 1.25,
                letterSpacing: -1,
                marginBottom: 12,
              }}
            >
              Your next step starts with an account.
            </h2>

            <p
              style={{
                color: "#a4a4b2",
                fontSize: 13,
                lineHeight: 1.8,
                marginBottom: 25,
              }}
            >
              Log in or create a free Onkur account to explore
              universities, discover careers, track your development
              and connect with other students.
            </p>

            <div
              style={{
                display: "grid",
                gap: 11,
              }}
            >
              <a
                href="/login"
                className="primary-button"
                style={{ width: "100%" }}
              >
                Log in to Onkur →
              </a>

              <a
                href="/signup"
                className="secondary-button"
                style={{
                  width: "100%",
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                Create an account
              </a>
            </div>

            <p
              style={{
                color: "#777785",
                fontSize: 10,
                marginTop: 19,
              }}
            >
              {pendingDestination
                ? "Sign in to continue to your selected section."
                : "Your student journey starts here."}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
