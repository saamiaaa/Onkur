
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const defaultProfile = {
  full_name: "Student",
  university: "University not added",
  degree: "Degree not added",
  year: "Year not added",
  interests: [],
};

const initialTasks = [
  {
    id: 1,
    title: "Complete your student profile",
    detail: "Add your academic background and interests",
    done: true,
  },
  {
    id: 2,
    title: "Explore your university options",
    detail: "Shortlist universities that match your goals",
    done: false,
  },
  {
    id: 3,
    title: "Explore career paths",
    detail: "Discover careers that interest you",
    done: false,
  },
  {
    id: 4,
    title: "Start a learning roadmap",
    detail: "Build skills for your chosen career",
    done: false,
  },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(defaultProfile);
  const [tasks, setTasks] = useState(initialTasks);
  const [universities, setUniversities] = useState([]);
  const [careerInterests, setCareerInterests] = useState([]);
  const [development, setDevelopment] = useState(null);
  const [community, setCommunity] = useState(null);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");

  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // VERIFY LOGIN AND LOAD USER DATA
  useEffect(() => {
    let isMounted = true;

    const verifyUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to verify your account.");
        }

        const data = await response.json();
        const user = data.user || data;

        if (!isMounted) return;

        // LOAD AUTHENTICATED USER PROFILE
        setProfile({
          full_name:
            user.fullName ||
            user.full_name ||
            "Student",

          university:
            user.university ||
            "University not added",

          degree:
            user.degree ||
            "Degree not added",

          year:
            user.year ||
            "Year not added",

          interests: Array.isArray(user.interests)
            ? user.interests
            : [],
        });

        // LOAD EXISTING DASHBOARD DATA
        setTasks(
          readStorage("onkur-dashboard-tasks", initialTasks)
        );

        setUniversities(
          readStorage("onkur-dashboard-universities", [])
        );

        setCareerInterests(
          readStorage("onkur-career-interests", [])
        );

        setDevelopment(
          readStorage("onkur-development-progress", null)
        );

        setCommunity(
          readStorage("onkur-community-activity", null)
        );
      } catch (error) {
        if (isMounted) {
          setAuthError(error.message);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // NAVIGATE TO DASHBOARD SECTIONS
  function navigateToSection(event, sectionId) {
    event.preventDefault();

    setActiveNav(sectionId);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const completedTasks = tasks.filter((task) => task.done).length;

  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  // TOGGLE TASK
  function toggleTask(id) {
    const updated = tasks.map((task) =>
      task.id === id
        ? { ...task, done: !task.done }
        : task
    );

    setTasks(updated);

    try {
      localStorage.setItem(
        "onkur-dashboard-tasks",
        JSON.stringify(updated)
      );
    } catch {
      console.error("Could not save dashboard tasks.");
    }
  }

  // REMOVE UNIVERSITY
  function removeUniversity(name) {
    const updated = universities.filter(
      (university) => university.name !== name
    );

    setUniversities(updated);

    try {
      localStorage.setItem(
        "onkur-dashboard-universities",
        JSON.stringify(updated)
      );
    } catch {
      console.error("Could not update university shortlist.");
    }
  }

  const displayedTasks = showAllTasks
    ? tasks
    : tasks.slice(0, 3);

  const developmentSkills = development?.completedSkills || [];
  const developmentProjects = development?.completedProjects || [];

  // AUTHENTICATION LOADING SCREEN
  if (authLoading) {
    return (
      <main className="dashboard-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--foreground)",
          }}
        >
          Verifying your account...
        </div>
      </main>
    );
  }

  // AUTHENTICATION ERROR
  if (authError) {
    return (
      <main className="dashboard-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            color: "var(--foreground)",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h2>Unable to load your dashboard</h2>
          <p>{authError}</p>

          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-logo">
          onkur<span>.</span>
        </Link>

        <div className="dashboard-sidebar-label">
          WORKSPACE
        </div>

        <nav className="dashboard-nav">
          <Link
            href="#overview"
            className={activeNav === "overview" ? "active" : ""}
            onClick={(event) =>
              navigateToSection(event, "overview")
            }
          >
            <span>▦</span> Overview
          </Link>

          <Link
            href="#universities"
            className={activeNav === "universities" ? "active" : ""}
            onClick={(event) =>
              navigateToSection(event, "universities")
            }
          >
            <span>⌂</span> Universities
          </Link>

          <Link
            href="#careers"
            className={activeNav === "careers" ? "active" : ""}
            onClick={(event) =>
              navigateToSection(event, "careers")
            }
          >
            <span>◎</span> Career explorer
          </Link>

          <Link
            href="#development"
            className={activeNav === "development" ? "active" : ""}
            onClick={(event) =>
              navigateToSection(event, "development")
            }
          >
            <span>↗</span> My development
          </Link>

          <Link
            href="#community"
            className={activeNav === "community" ? "active" : ""}
            onClick={(event) =>
              navigateToSection(event, "community")
            }
          >
            <span>♧</span> Community
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-sidebar-label">
            YOUR JOURNEY
          </div>

          <div className="dashboard-sidebar-tip">
            <div className="dashboard-tip-icon">✦</div>
            <h4>Small steps matter.</h4>
            <p>
              Your future is built one decision at a time.
            </p>
            <Link href="/develop">
              Continue learning <span>↗</span>
            </Link>
          </div>

          <Link href="/" className="dashboard-back-home">
            ← Back to home
          </Link>
        </div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>Overview</strong>
          </div>

          <div className="dashboard-topbar-right">
            <span className="dashboard-status">
              <i /> Your journey is active
            </span>

            <div className="dashboard-avatar">
              {profile.full_name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          </div>
        </header>

        <div className="dashboard-content">

          {/* WELCOME AND PROFILE */}

          <section
            id="overview"
            className="dashboard-welcome"
            style={{ scrollMarginTop: 24 }}
          >
            <div>
              <p className="dashboard-eyebrow">
                YOUR PERSONAL SPACE
              </p>

              <h1>
                Welcome back, {profile.full_name.split(" ")[0]}
                <span>.</span>
              </h1>

              <p className="dashboard-welcome-sub">
                Your journey as a student is just getting started.
                Keep exploring, developing your skills, and building your future.
              </p>
            </div>

            <div className="dashboard-date-card">
              <span className="dashboard-date-icon">✳</span>
              <div>
                <strong>YOUR JOURNEY</strong>
                <p>One step at a time</p>
              </div>
            </div>
          </section>

          {/* STUDENT INFORMATION */}

          <section
            className="dashboard-panel"
            style={{ marginBottom: 18 }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">
                  YOUR STUDENT PROFILE
                </p>
                <h2>{profile.full_name}</h2>
              </div>

              <span className="dashboard-sparkle">✦</span>
            </div>

            <div className="dashboard-career-list">
              <article className="dashboard-career-item">
                <div className="dashboard-career-number career-number-0">
                  EDU
                </div>

                <div className="dashboard-career-info">
                  <strong>{profile.university}</strong>
                  <small>{profile.degree}</small>
                </div>

                <div className="dashboard-match">
                  <strong>{profile.year}</strong>
                  <small>Academic year</small>
                </div>
              </article>
            </div>

            <div style={{ marginTop: 15 }}>
              <p className="dashboard-eyebrow">
                AREAS OF INTEREST
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: "7px 11px",
                      borderRadius: 20,
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      fontSize: 11,
                    }}
                  >
                    {interest}
                  </span>
                ))}

                {profile.interests.length === 0 && (
                  <span>No interests added yet.</span>
                )}
              </div>
            </div>
          </section>

          {/* OVERVIEW STATS */}

          <section className="dashboard-stats">
            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span>SAVED UNIVERSITIES</span>
                <span className="stat-icon yellow-icon">⌂</span>
              </div>

              <strong>
                {universities.length.toString().padStart(2, "0")}
              </strong>

              <p>Universities in your shortlist</p>

              <Link href="/universities">
                Explore universities ↗
              </Link>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span>CAREER INTERESTS</span>
                <span className="stat-icon violet-icon">◎</span>
              </div>

              <strong>
                {careerInterests.length.toString().padStart(2, "0")}
              </strong>

              <p>Career paths you've explored</p>

              <Link href="/careers">
                Explore careers ↗
              </Link>
            </article>

            <article className="dashboard-stat-card">
              <div className="dashboard-stat-top">
                <span>COMPLETED TASKS</span>
                <span className="stat-icon blue-icon">✓</span>
              </div>

              <strong>
                {completedTasks.toString().padStart(2, "0")}
                <span>/{tasks.length.toString().padStart(2, "0")}</span>
              </strong>

              <div className="dashboard-stat-track">
                <i style={{ width: `${progress}%` }} />
              </div>

              <p>Your personal checklist progress</p>
            </article>
          </section>

          {/* TASKS AND CAREER EXPLORER */}

          <div className="dashboard-section-grid">
            <section className="dashboard-panel dashboard-tasks-panel">
              <div className="dashboard-panel-heading">
                <div>
                  <p className="dashboard-eyebrow">
                    STAY ON TRACK
                  </p>
                  <h2>Your next steps</h2>
                </div>

                <button
                  className="dashboard-text-button"
                  onClick={() =>
                    setShowAllTasks(!showAllTasks)
                  }
                >
                  {showAllTasks ? "Show less ↑" : "View all →"}
                </button>
              </div>

              <div className="dashboard-task-progress">
                <div>
                  <strong>{progress}% completed</strong>
                  <span>
                    {completedTasks} of {tasks.length} tasks
                  </span>
                </div>

                <div className="dashboard-task-progress-track">
                  <i style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="dashboard-task-list">
                {displayedTasks.map((task) => (
                  <label
                    className={`dashboard-task ${
                      task.done ? "task-done" : ""
                    }`}
                    key={task.id}
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                    />

                    <span className="dashboard-custom-check">
                      {task.done ? "✓" : ""}
                    </span>

                    <span className="dashboard-task-copy">
                      <strong>{task.title}</strong>
                      <small>{task.detail}</small>
                    </span>

                    <span className="dashboard-task-arrow">
                      ↗
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section
              id="careers"
              className="dashboard-panel dashboard-career-panel"
              style={{ scrollMarginTop: 24 }}
            >
              <div className="dashboard-panel-heading">
                <div>
                  <p className="dashboard-eyebrow">
                    YOUR CAREER EXPLORATION
                  </p>
                  <h2>Career interests</h2>
                </div>

                <span className="dashboard-sparkle">✦</span>
              </div>

              <p className="dashboard-panel-description">
                Career paths you've chosen to explore will appear here.
              </p>

              {careerInterests.length > 0 ? (
                <div className="dashboard-career-list">
                  {careerInterests.map((career, index) => (
                    <article
                      className="dashboard-career-item"
                      key={career.title || career.name || index}
                    >
                      <div
                        className={`dashboard-career-number career-number-${index % 3}`}
                      >
                        0{index + 1}
                      </div>

                      <div className="dashboard-career-info">
                        <strong>
                          {typeof career === "string"
                            ? career
                            : career.title || career.name || "Career"}
                        </strong>

                        <small>
                          {typeof career === "string"
                            ? "Career interest"
                            : career.category || "Career interest"}
                        </small>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-universities">
                  <span>◎</span>
                  <div>
                    <strong>No career interests saved yet</strong>
                    <p>
                      Explore different paths and add the ones that interest you.
                    </p>
                  </div>
                </div>
              )}

              <Link href="/careers" className="dashboard-panel-link">
                Open Career Explorer →
              </Link>
            </section>
          </div>

          {/* UNIVERSITIES */}

          <section
            id="universities"
            className="dashboard-panel dashboard-universities-panel"
            style={{ scrollMarginTop: 24 }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">
                  YOUR DISCOVERIES
                </p>
                <h2>Your university shortlist</h2>
              </div>

              <Link
                href="/universities"
                className="dashboard-text-button"
              >
                Explore universities →
              </Link>
            </div>

            {universities.length > 0 ? (
              <div className="dashboard-university-grid">
                {universities.map((university) => (
                  <article
                    className="dashboard-university-card"
                    key={university.id || university.name}
                  >
                    <div
                      className={`dashboard-university-monogram ${
                        university.color || "yellow"
                      }`}
                    >
                      {university.short ||
                        university.name?.slice(0, 3)}
                    </div>

                    <div className="dashboard-university-info">
                      <strong>{university.name}</strong>
                      <small>
                        {university.location ||
                          university.city ||
                          university.country}
                      </small>
                      <span>
                        {university.type || "University"}
                      </span>
                    </div>

                    <button
                      className="dashboard-remove-university"
                      onClick={() =>
                        removeUniversity(university.name)
                      }
                      aria-label={`Remove ${university.name}`}
                      title="Remove from shortlist"
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-universities">
                <span>⌂</span>
                <div>
                  <strong>Your shortlist is empty</strong>
                  <p>
                    Explore universities and save the ones you're interested in.
                  </p>
                </div>

                <Link href="/universities">
                  Explore universities →
                </Link>
              </div>
            )}
          </section>

          {/* DEVELOPMENT */}

          <section
            id="development"
            className="dashboard-panel"
            style={{
              marginBottom: 17,
              scrollMarginTop: 24,
            }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">
                  BUILD YOUR SKILLS
                </p>
                <h2>My development</h2>
              </div>

              <Link
                href="/develop"
                className="dashboard-text-button"
              >
                Open development →
              </Link>
            </div>

            {development ? (
              <>
                <p className="dashboard-panel-description">
                  {development.activePath || "Your learning journey"}
                </p>

                <div className="dashboard-stats">
                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-top">
                      <span>COMPLETED SKILLS</span>
                    </div>
                    <strong>{developmentSkills.length}</strong>
                    <p>Skills you've completed</p>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-top">
                      <span>COMPLETED PROJECTS</span>
                    </div>
                    <strong>{developmentProjects.length}</strong>
                    <p>Projects you've finished</p>
                  </article>

                  <article className="dashboard-stat-card">
                    <div className="dashboard-stat-top">
                      <span>LEARNING PROGRESS</span>
                    </div>

                    <strong>
                      {development.progress ?? 0}
                      <span>%</span>
                    </strong>

                    <div className="dashboard-stat-track">
                      <i
                        style={{
                          width: `${development.progress ?? 0}%`,
                        }}
                      />
                    </div>

                    <p>Progress in your learning path</p>
                  </article>
                </div>
              </>
            ) : (
              <div className="dashboard-empty-universities">
                <span>↗</span>
                <div>
                  <strong>No learning progress available yet</strong>
                  <p>
                    Choose a learning path and start building your skills and projects.
                  </p>
                </div>

                <Link href="/develop">
                  Explore learning paths →
                </Link>
              </div>
            )}
          </section>

          {/* COMMUNITY */}

          <section
            id="community"
            className="dashboard-panel"
            style={{
              marginBottom: 17,
              scrollMarginTop: 24,
            }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">
                  YOUR STUDENT NETWORK
                </p>
                <h2>Community activity</h2>
              </div>

              <Link
                href="/connect"
                className="dashboard-text-button"
              >
                Visit community →
              </Link>
            </div>

            {community ? (
              <div className="dashboard-stats">
                <article className="dashboard-stat-card">
                  <div className="dashboard-stat-top">
                    <span>YOUR POSTS</span>
                  </div>
                  <strong>{community.posts ?? 0}</strong>
                  <p>Posts you've shared</p>
                </article>

                <article className="dashboard-stat-card">
                  <div className="dashboard-stat-top">
                    <span>CONNECTIONS</span>
                  </div>
                  <strong>{community.connections ?? 0}</strong>
                  <p>Students in your network</p>
                </article>

                <article className="dashboard-stat-card">
                  <div className="dashboard-stat-top">
                    <span>MENTORSHIP REQUESTS</span>
                  </div>
                  <strong>
                    {community.mentorshipRequests ?? 0}
                  </strong>
                  <p>Your mentorship activity</p>
                </article>
              </div>
            ) : (
              <div className="dashboard-empty-universities">
                <span>♧</span>
                <div>
                  <strong>
                    Your community activity will appear here
                  </strong>
                  <p>
                    Connect with students, share your work and explore mentorship opportunities.
                  </p>
                </div>

                <Link href="/connect">
                  Explore community →
                </Link>
              </div>
            )}
          </section>

          {/* FOOTER */}

          <footer className="dashboard-footer">
            <span>
              onkur<span className="dashboard-footer-dot">.</span>
            </span>

            <p>Your journey, your pace.</p>

            <span>© 2026 Onkur</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
