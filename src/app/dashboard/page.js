
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const defaultProfile = {
  full_name: "Student",
  university: "University not added",
  degree: "Degree not added",
  year: "Year not added",
  interests: [],
  preferredCountries: [],
  preferredStudyLevel: "",
  budget: {
    amount: "",
    currency: "BDT",
    period: "Annual",
  },
  scholarshipRequired: false,
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

function QuickIcon({ name, size = 19 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    overview: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="5" rx="1.5" />
        <rect x="13" y="10" width="8" height="11" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </>
    ),
    university: (
      <>
        <path d="m3 9 9-6 9 6" />
        <path d="M5 10v9M9 10v9M15 10v9M19 10v9M3 21h18" />
      </>
    ),
    careers: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
    development: (
      <>
        <path d="M4 19 19 4" />
        <path d="M9 4h10v10" />
        <path d="M4 10v10h10" />
      </>
    ),
    community: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v12h14V9" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    analyzer: (
      <>
        <path d="M9 3h6" />
        <path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" />
        <path d="M8 15h8" />
        <path d="m10 12 1.5 1.5L14 11" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.overview}</svg>;
}

const quickLinks = [
  { id: "overview", label: "Overview", icon: "overview" },
  { id: "profile-settings", label: "Profile settings", icon: "profile" },
  { id: "universities", label: "Universities", icon: "university" },
  { id: "careers", label: "Career explorer", icon: "careers" },
  { id: "development", label: "My development", icon: "development" },
  { id: "community", label: "Community", icon: "community" },
];

const destinationLinks = [
  {
    label: "Home",
    description: "Visit the student community",
    href: "/connect",
    icon: "home",
  },
  {
    label: "Universities",
    description: "Discover and shortlist universities",
    href: "/universities",
    icon: "university",
  },
  {
    label: "Careers",
    description: "Explore possible career paths",
    href: "/careers",
    icon: "careers",
  },
  {
    label: "My Development",
    description: "Continue your learning journey",
    href: "/develop",
    icon: "development",
  },
  {
    label: "Community",
    description: "Connect with other students",
    href: "/connect",
    icon: "community",
  },
  {
    label: "AI Profile Analyzer",
    description: "Get personalized student insights",
    href: "/analyzer",
    icon: "analyzer",
  },
];

const fieldStyle = {
  width: "100%",
  padding: "11px 12px",
  marginTop: 8,
  border: "1px solid var(--border)",
  borderRadius: 8,
  background: "rgba(255,255,255,0.03)",
  color: "var(--foreground)",
  fontSize: 13,
  outline: "none",
};

const countries = [
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Malaysia",
  "Singapore",
  "Japan",
  "South Korea",
  "Netherlands",
  "Sweden",
  "Other",
];

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(defaultProfile);

  const [profileDraft, setProfileDraft] = useState({
    ...defaultProfile,
    interestsText: "",
    preferredCountriesText: "",
  });

  const [tasks, setTasks] = useState(initialTasks);
  const [universities, setUniversities] = useState([]);
  const [careerInterests, setCareerInterests] = useState([]);
  const [development, setDevelopment] = useState(null);
  const [community, setCommunity] = useState(null);

  const [showAllTasks, setShowAllTasks] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");

  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const authResponse = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (authResponse.status === 401) {
          router.replace("/login");
          return;
        }

        if (!authResponse.ok) {
          throw new Error("Unable to verify your account.");
        }

        const authData = await authResponse.json();
        const user = authData.user || authData;

        const dashboardResponse = await fetch(`${API_URL}/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        if (dashboardResponse.status === 401) {
          router.replace("/login");
          return;
        }

        if (!dashboardResponse.ok) {
          throw new Error("Unable to load your dashboard data.");
        }

        const dashboardData = await dashboardResponse.json();
        const dashboard = dashboardData.dashboard || {};

        if (!isMounted) return;

        const loadedProfile = {
          full_name: user.fullName || user.full_name || "Student",
          university: user.university || "",
          degree: user.degree || "",
          year: user.year || "",
          interests: Array.isArray(user.interests) ? user.interests : [],
          preferredCountries: Array.isArray(user.preferredCountries)
            ? user.preferredCountries
            : [],
          preferredStudyLevel: user.preferredStudyLevel || "",
          budget: {
            amount: user.budget?.amount ?? "",
            currency: user.budget?.currency || "BDT",
            period: user.budget?.period || "Annual",
          },
          scholarshipRequired: user.scholarshipRequired === true,
        };

        setProfile(loadedProfile);

        setProfileDraft({
          ...loadedProfile,
          interestsText: loadedProfile.interests.join(", "),
          preferredCountriesText:
            loadedProfile.preferredCountries.join(", "),
        });

        setTasks(
          Array.isArray(dashboard.tasks) ? dashboard.tasks : initialTasks
        );

        setUniversities(
          Array.isArray(dashboard.universities)
            ? dashboard.universities
            : []
        );

        setCareerInterests(
          Array.isArray(dashboard.careerInterests)
            ? dashboard.careerInterests
            : []
        );

        setDevelopment(dashboard.development || null);
        setCommunity(dashboard.community || null);
      } catch (error) {
        if (isMounted) {
          setAuthError(error.message);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function saveDashboard(updates) {
    try {
      setSaveError("");

      const response = await fetch(`${API_URL}/dashboard`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 401) {
        router.replace("/login");
        return false;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save your changes.");
      }

      return true;
    } catch (error) {
      setSaveError(error.message);
      return false;
    }
  }

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileDraft((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileMessage("");
  }

  function handleBudgetChange(event) {
    const { name, value } = event.target;

    setProfileDraft((previous) => ({
      ...previous,
      budget: {
        ...previous.budget,
        [name]: value,
      },
    }));

    setProfileMessage("");
  }

  function handleScholarshipChange(event) {
    setProfileDraft((previous) => ({
      ...previous,
      scholarshipRequired: event.target.checked,
    }));

    setProfileMessage("");
  }

  async function handleProfileSave(event) {
    event.preventDefault();

    setIsSavingProfile(true);
    setSaveError("");
    setProfileMessage("");

    const budgetAmount =
      profileDraft.budget.amount === "" ||
      profileDraft.budget.amount === null
        ? null
        : Number(profileDraft.budget.amount);

    if (
      budgetAmount !== null &&
      (!Number.isFinite(budgetAmount) || budgetAmount < 0)
    ) {
      setSaveError("Please enter a valid tuition budget.");
      setIsSavingProfile(false);
      return;
    }

    const updatedProfile = {
      fullName: profileDraft.full_name.trim(),
      university: profileDraft.university.trim(),
      degree: profileDraft.degree.trim(),
      year: profileDraft.year.trim(),
      interests: profileDraft.interestsText
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean),

      preferredCountries: profileDraft.preferredCountriesText
        .split(",")
        .map((country) => country.trim())
        .filter(Boolean),

      preferredStudyLevel: profileDraft.preferredStudyLevel,

      budget: {
        amount: budgetAmount,
        currency: profileDraft.budget.currency,
        period: profileDraft.budget.period,
      },

      scholarshipRequired: profileDraft.scholarshipRequired,
    };

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update your profile.");
      }

      const user = data.user || {};

      const savedProfile = {
        full_name: user.fullName || updatedProfile.fullName,
        university: user.university || "",
        degree: user.degree || "",
        year: user.year || "",
        interests: Array.isArray(user.interests)
          ? user.interests
          : updatedProfile.interests,
        preferredCountries: Array.isArray(user.preferredCountries)
          ? user.preferredCountries
          : updatedProfile.preferredCountries,
        preferredStudyLevel:
          user.preferredStudyLevel || updatedProfile.preferredStudyLevel,
        budget: {
          amount: user.budget?.amount ?? updatedProfile.budget.amount ?? "",
          currency:
            user.budget?.currency || updatedProfile.budget.currency,
          period: user.budget?.period || updatedProfile.budget.period,
        },
        scholarshipRequired:
          user.scholarshipRequired ?? updatedProfile.scholarshipRequired,
      };

      setProfile(savedProfile);

      setProfileDraft({
        ...savedProfile,
        interestsText: savedProfile.interests.join(", "),
        preferredCountriesText:
          savedProfile.preferredCountries.join(", "),
      });

      setProfileMessage("Your profile has been saved successfully.");
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      setSaveError("");

      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to log out. Please try again.");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setSaveError(error.message);
      setIsLoggingOut(false);
    }
  }

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

  async function toggleTask(id) {
    const previousTasks = tasks;

    const updated = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );

    setTasks(updated);

    const saved = await saveDashboard({ tasks: updated });

    if (!saved) {
      setTasks(previousTasks);
    }
  }

  async function removeUniversity(name) {
    const previousUniversities = universities;

    const updated = universities.filter(
      (university) => university.name !== name
    );

    setUniversities(updated);

    const saved = await saveDashboard({ universities: updated });

    if (!saved) {
      setUniversities(previousUniversities);
    }
  }

  const displayedTasks = showAllTasks ? tasks : tasks.slice(0, 3);

  const developmentSkills = development?.completedSkills || [];
  const developmentProjects = development?.completedProjects || [];

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

  const avatarInitials =
    profile.full_name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  return (
    <main className="dashboard-page">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <Link href="/" className="dashboard-logo">
          onkur<span>.</span>
        </Link>

        <div className="dashboard-sidebar-label">QUICK ACCESS</div>

        <nav className="dashboard-nav">
          {quickLinks.map((item) => (
            <Link
              href={`#${item.id}`}
              key={item.id}
              className={activeNav === item.id ? "active" : ""}
              onClick={(event) => navigateToSection(event, item.id)}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 22,
                }}
              >
                <QuickIcon name={item.icon} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-sidebar-label">YOUR JOURNEY</div>

          <div className="dashboard-sidebar-tip">
            <div className="dashboard-tip-icon">✦</div>
            <h4>Small steps matter.</h4>
            <p>Your future is built one decision at a time.</p>
            <Link href="/develop">
              Continue learning <span>↗</span>
            </Link>
          </div>

          <Link href="/" className="dashboard-back-home">
            ← Back to home
          </Link>
        </div>
      </aside>

      {/* MAIN DASHBOARD */}
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">
          <Link href="/connect">Home</Link>
          <span>/</span>
        <strong>Overview</strong>
          </div>

          <div className="dashboard-topbar-right">
            <span className="dashboard-status">
              <i /> Your journey is active
            </span>

            <div className="dashboard-avatar">{avatarInitials}</div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
                padding: "9px 15px",
                borderRadius: "8px",
                cursor: isLoggingOut ? "not-allowed" : "pointer",
                fontSize: "12px",
                opacity: isLoggingOut ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {isLoggingOut ? "Logging out..." : "Log Out ↗"}
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {saveError && (
            <div
              role="alert"
              style={{
                padding: "12px 16px",
                marginBottom: 16,
                border: "1px solid #d97757",
                borderRadius: 8,
                color: "var(--foreground)",
                fontSize: 13,
              }}
            >
              {saveError}
            </div>
          )}

          {/* WELCOME */}
          <section
            id="overview"
            className="dashboard-welcome"
            style={{ scrollMarginTop: 24 }}
          >
            <div>
              <p className="dashboard-eyebrow">YOUR PERSONAL SPACE</p>

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

          {/* QUICK DESTINATION LINKS */}
          <section
            aria-label="Quick destinations"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
              gap: 12,
              marginBottom: 22,
            }}
          >
            {destinationLinks.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "15px 13px",
                  minWidth: 0,
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.02)",
                  color: "var(--foreground)",
                  textDecoration: "none",
                  transition: "border-color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = "var(--yellow)";
                  event.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = "var(--border)";
                  event.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 10,
                    background: "rgba(248,217,67,0.09)",
                    color: "var(--yellow)",
                  }}
                >
                  <QuickIcon name={item.icon} size={20} />
                </span>

                <span style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </strong>
                  <small
                    style={{
                      display: "block",
                      color: "var(--muted)",
                      fontSize: 10,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.description}
                  </small>
                </span>
              </Link>
            ))}
          </section>

          {/* AI PROFILE ANALYZER FEATURE */}
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              padding: "23px",
              marginBottom: 18,
              border: "1px solid rgba(119,112,255,0.4)",
              borderRadius: 14,
              background:
                "linear-gradient(115deg, rgba(119,112,255,0.13), rgba(248,217,67,0.04))",
            }}
          >
            <div style={{ maxWidth: 550 }}>
              <p className="dashboard-eyebrow">YOUR AI-POWERED GUIDE</p>
              <h2
                style={{
                  color: "var(--foreground)",
                  fontSize: 21,
                  margin: "8px 0",
                }}
              >
                Understand your potential.
              </h2>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Let AI review your academic background, interests and skills
                to help you discover strengths, career directions and your
                next steps.
              </p>
            </div>

            <Link
              href="/analyzer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "12px 18px",
                borderRadius: 8,
                background: "var(--yellow)",
                color: "#171717",
                fontWeight: 700,
                fontSize: 12,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <QuickIcon name="analyzer" size={17} />
              Analyze my profile ↗
            </Link>
          </section>

          {/* STUDENT PROFILE SUMMARY */}
          <section className="dashboard-panel" style={{ marginBottom: 18 }}>
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">YOUR STUDENT PROFILE</p>
                <h2>{profile.full_name}</h2>
              </div>

              <button
                type="button"
                className="dashboard-text-button"
                onClick={(event) =>
                  navigateToSection(event, "profile-settings")
                }
              >
                Edit profile ↗
              </button>
            </div>

            <div className="dashboard-career-list">
              <article className="dashboard-career-item">
                <div className="dashboard-career-number career-number-0">
                  EDU
                </div>

                <div className="dashboard-career-info">
                  <strong>
                    {profile.university || "University not added"}
                  </strong>
                  <small>{profile.degree || "Degree not added"}</small>
                </div>

                <div className="dashboard-match">
                  <strong>{profile.year || "Not added"}</strong>
                  <small>Academic year</small>
                </div>
              </article>
            </div>

            <div style={{ marginTop: 15 }}>
              <p className="dashboard-eyebrow">AREAS OF INTEREST</p>

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

            <div style={{ marginTop: 18 }}>
              <p className="dashboard-eyebrow">UNIVERSITY PREFERENCES</p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {profile.preferredCountries.length > 0 ? (
                  profile.preferredCountries.map((country) => (
                    <span
                      key={country}
                      style={{
                        padding: "7px 11px",
                        borderRadius: 20,
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        fontSize: 11,
                      }}
                    >
                      {country}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "var(--muted)", fontSize: 12 }}>
                    No preferred countries added.
                  </span>
                )}
              </div>

              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  marginTop: 10,
                }}
              >
                Study level: {profile.preferredStudyLevel || "Not specified"}
              </p>

              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                Tuition budget:{" "}
                {profile.budget.amount !== "" &&
                profile.budget.amount !== null
                  ? `${profile.budget.amount} ${profile.budget.currency} (${profile.budget.period})`
                  : "Not specified"}
              </p>

              <p
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                Scholarship needed:{" "}
                {profile.scholarshipRequired ? "Yes" : "No"}
              </p>
            </div>
          </section>

          {/* PROFILE SETTINGS */}
          <section
            id="profile-settings"
            className="dashboard-panel"
            style={{ marginBottom: 18, scrollMarginTop: 24 }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">ACCOUNT DETAILS</p>
                <h2>Profile settings</h2>
              </div>

              <span className="dashboard-sparkle">
                <QuickIcon name="profile" size={23} />
              </span>
            </div>

            <p className="dashboard-panel-description">
              Keep your student information up to date. Your changes will be
              saved to your account.
            </p>

            <form onSubmit={handleProfileSave}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                  marginTop: 20,
                }}
              >
                <label className="dashboard-profile-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="full_name"
                    value={profileDraft.full_name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                    required
                    minLength={2}
                  />
                </label>

                <label className="dashboard-profile-field">
                  <span>University</span>
                  <input
                    type="text"
                    name="university"
                    value={profileDraft.university}
                    onChange={handleProfileChange}
                    placeholder="Your university"
                  />
                </label>

                <label className="dashboard-profile-field">
                  <span>Degree / Department</span>
                  <input
                    type="text"
                    name="degree"
                    value={profileDraft.degree}
                    onChange={handleProfileChange}
                    placeholder="e.g. Computer Science & Engineering"
                  />
                </label>

                <label className="dashboard-profile-field">
                  <span>Academic year</span>
                  <input
                    type="text"
                    name="year"
                    value={profileDraft.year}
                    onChange={handleProfileChange}
                    placeholder="e.g. 2nd Year"
                  />
                </label>

                <label
                  className="dashboard-profile-field"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <span>Areas of interest</span>
                  <input
                    type="text"
                    name="interestsText"
                    value={profileDraft.interestsText}
                    onChange={handleProfileChange}
                    placeholder="e.g. Web Development, AI, UI/UX, Robotics"
                  />
                  <small>Separate each interest with a comma.</small>
                </label>
              </div>

              {/* UNIVERSITY MATCHING PREFERENCES */}
              <div
                style={{
                  marginTop: 30,
                  paddingTop: 24,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <p className="dashboard-eyebrow">UNIVERSITY MATCHING</p>

                <h3
                  style={{
                    color: "var(--foreground)",
                    fontSize: 17,
                    marginTop: 7,
                    marginBottom: 8,
                  }}
                >
                  What are you looking for?
                </h3>

                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: 12,
                    lineHeight: 1.7,
                    marginBottom: 18,
                  }}
                >
                  These preferences help Onkur recommend universities that
                  better match your study plans and financial situation.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 16,
                  }}
                >
                  <label
                    className="dashboard-profile-field"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <span>Preferred countries</span>
                    <input
                      type="text"
                      name="preferredCountriesText"
                      value={profileDraft.preferredCountriesText}
                      onChange={handleProfileChange}
                      placeholder="e.g. Canada, Australia, Germany"
                      style={fieldStyle}
                    />
                    <small>
                      Enter countries separated by commas. Leave empty if
                      you're open to studying anywhere.
                    </small>
                  </label>

                  <label className="dashboard-profile-field">
                    <span>Preferred study level</span>
                    <select
                      name="preferredStudyLevel"
                      value={profileDraft.preferredStudyLevel}
                      onChange={handleProfileChange}
                      style={fieldStyle}
                    >
                      <option value="">No preference</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  </label>

                  <label className="dashboard-profile-field">
                    <span>Tuition budget</span>
                    <input
                      type="number"
                      name="amount"
                      min="0"
                      step="any"
                      value={profileDraft.budget.amount}
                      onChange={handleBudgetChange}
                      placeholder="e.g. 10000"
                      style={fieldStyle}
                    />
                    <small>
                      Enter your maximum tuition budget. Leave empty if
                      undecided.
                    </small>
                  </label>

                  <label className="dashboard-profile-field">
                    <span>Budget currency</span>
                    <select
                      name="currency"
                      value={profileDraft.budget.currency}
                      onChange={handleBudgetChange}
                      style={fieldStyle}
                    >
                      <option value="BDT">BDT – Bangladeshi Taka</option>
                      <option value="USD">USD – US Dollar</option>
                      <option value="CAD">CAD – Canadian Dollar</option>
                      <option value="AUD">AUD – Australian Dollar</option>
                      <option value="GBP">GBP – British Pound</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="SGD">SGD – Singapore Dollar</option>
                      <option value="MYR">MYR – Malaysian Ringgit</option>
                      <option value="JPY">JPY – Japanese Yen</option>
                    </select>
                  </label>

                  <label className="dashboard-profile-field">
                    <span>Budget period</span>
                    <select
                      name="period"
                      value={profileDraft.budget.period}
                      onChange={handleBudgetChange}
                      style={fieldStyle}
                    >
                      <option value="Annual">Per year</option>
                      <option value="First year">First year</option>
                      <option value="Per semester">Per semester</option>
                      <option value="Per credit">Per credit</option>
                      <option value="Total programme">Total programme</option>
                    </select>
                  </label>
                </div>

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 11,
                    marginTop: 22,
                    cursor: "pointer",
                    color: "var(--foreground)",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={profileDraft.scholarshipRequired}
                    onChange={handleScholarshipChange}
                    style={{
                      width: 16,
                      height: 16,
                      marginTop: 2,
                      accentColor: "var(--yellow)",
                      flexShrink: 0,
                    }}
                  />

                  <span>
                    <strong>I need scholarship or financial aid.</strong>
                    <small
                      style={{
                        display: "block",
                        color: "var(--muted)",
                        fontSize: 11,
                        marginTop: 3,
                      }}
                    >
                      Prioritize universities with listed scholarship
                      opportunities when recommending options.
                    </small>
                  </span>
                </label>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  marginTop: 22,
                }}
              >
                <div
                  role="status"
                  style={{
                    color: profileMessage ? "#80c9a0" : "var(--muted)",
                    fontSize: 12,
                  }}
                >
                  {profileMessage}
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  style={{
                    background: "var(--yellow)",
                    color: "#171717",
                    border: "none",
                    padding: "11px 20px",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: isSavingProfile ? "not-allowed" : "pointer",
                    opacity: isSavingProfile ? 0.65 : 1,
                  }}
                >
                  {isSavingProfile ? "Saving..." : "Save changes ↗"}
                </button>
              </div>
            </form>
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
              <Link href="/universities">Explore universities ↗</Link>
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
              <Link href="/careers">Explore careers ↗</Link>
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
                  <p className="dashboard-eyebrow">STAY ON TRACK</p>
                  <h2>Your next steps</h2>
                </div>

                <button
                  className="dashboard-text-button"
                  onClick={() => setShowAllTasks(!showAllTasks)}
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

                    <span className="dashboard-task-arrow">↗</span>
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
                <p className="dashboard-eyebrow">YOUR DISCOVERIES</p>
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
                      {university.short || university.name?.slice(0, 3)}
                    </div>

                    <div className="dashboard-university-info">
                      <strong>{university.name}</strong>
                      <small>
                        {university.location ||
                          university.city ||
                          university.country}
                      </small>
                      <span>{university.type || "University"}</span>
                    </div>

                    <button
                      className="dashboard-remove-university"
                      onClick={() => removeUniversity(university.name)}
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
            style={{ marginBottom: 17, scrollMarginTop: 24 }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">BUILD YOUR SKILLS</p>
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

                <Link href="/develop">Explore learning paths →</Link>
              </div>
            )}
          </section>

          {/* COMMUNITY */}
          <section
            id="community"
            className="dashboard-panel"
            style={{ marginBottom: 17, scrollMarginTop: 24 }}
          >
            <div className="dashboard-panel-heading">
              <div>
                <p className="dashboard-eyebrow">YOUR STUDENT NETWORK</p>
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
                  <strong>{community.mentorshipRequests ?? 0}</strong>
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

                <Link href="/connect">Explore community →</Link>
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
