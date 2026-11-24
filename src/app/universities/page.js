
"use client";

import "./universities.css";
import { getCareersForUniversity } from "../data/careerLinks";
import { getUniversityMatches } from "../data/universityMatching";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import universities from "../data/universities";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getCareerName(career) {
  if (typeof career === "string") return career;

  return (
    career?.name ||
    career?.title ||
    career?.label ||
    career?.career ||
    "Career path"
  );
}

function getCurrencySymbol(currency) {
  const symbols = {
    BDT: "৳",
    USD: "US$",
    CAD: "C$",
    SGD: "S$",
    AUD: "A$",
    GBP: "£",
  };

  return symbols[currency] || `${currency || ""} `;
}

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [level, setLevel] = useState("All");
  const [subject, setSubject] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState("az");

  const [saved, setSaved] = useState([]);
  const [compare, setCompare] = useState([]);
  const [selected, setSelected] = useState(null);

  const [showSaved, setShowSaved] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const [studentProfile, setStudentProfile] = useState(null);

  // CHECK LOGIN STATUS, LOAD PROFILE AND SAVED UNIVERSITIES
  useEffect(() => {
    let isMounted = true;

    async function loadStudentData() {
      try {
        const authResponse = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (authResponse.status === 401) {
          if (isMounted) {
            setIsAuthenticated(false);
            setStudentProfile(null);
          }
          return;
        }

        if (!authResponse.ok) {
          throw new Error("Unable to verify your account.");
        }

        const authData = await authResponse.json();

        const user =
          authData.user ||
          authData.data?.user ||
          authData;

        if (isMounted) setIsAuthenticated(true);

        const dashboardResponse = await fetch(`${API_URL}/dashboard`, {
          credentials: "include",
        });

        if (dashboardResponse.status === 401) {
          if (isMounted) {
            setIsAuthenticated(false);
            setStudentProfile(null);
          }
          return;
        }

        if (!dashboardResponse.ok) {
          throw new Error("Unable to load your student profile.");
        }

        const dashboardData = await dashboardResponse.json();
        const dashboard = dashboardData.dashboard || {};

        const savedUniversities = dashboard.universities || [];

        const savedIds = savedUniversities
          .map((university) => {
            const matched = universities.find(
              (item) =>
                item.id === university.id ||
                item.name === university.name
            );

            return matched?.id;
          })
          .filter(Boolean);

        const profile = {
          ...user,
          careerInterests: dashboard.careerInterests || [],
          development: dashboard.development || {},
        };

        if (isMounted) {
          setSaved(savedIds);
          setStudentProfile(profile);
        }
      } catch (error) {
        console.error("University loading error:", error);

        if (isMounted) setSaveError(error.message);
      } finally {
        if (isMounted) setIsLoadingSaved(false);
      }
    }

    loadStudentData();

    return () => {
      isMounted = false;
    };
  }, []);

  // LOGIN REQUIREMENT
  function requireLogin() {
    if (isLoadingSaved) return false;

    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return false;
    }

    return true;
  }

  // PERSONALIZED UNIVERSITY MATCHES
  const shouldShowRecommendations =
    isAuthenticated &&
    studentProfile?.educationLevel === "high_school";

  const recommendedUniversities = useMemo(() => {
    if (!shouldShowRecommendations || !studentProfile) return [];

    return getUniversityMatches(universities, studentProfile).slice(0, 3);
  }, [shouldShowRecommendations, studentProfile]);

  // FILTER OPTIONS
  const countries = useMemo(
    () => [
      "All",
      ...new Set(universities.map((uni) => uni.country).filter(Boolean)),
    ],
    []
  );

  const levels = useMemo(
    () => [
      "All",
      ...new Set(
        universities.flatMap((uni) => uni.levels || []).filter(Boolean)
      ),
    ],
    []
  );

  const subjects = useMemo(
    () => [
      "All",
      ...new Set(
        universities.flatMap((uni) => uni.subjects || []).filter(Boolean)
      ),
    ],
    []
  );

  const types = useMemo(
    () => [
      "All",
      ...new Set(universities.map((uni) => uni.type).filter(Boolean)),
    ],
    []
  );

  // SEARCH, FILTER AND SORT
  const filteredUniversities = useMemo(() => {
    let result = [...universities];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((uni) =>
        [
          uni.name,
          uni.location,
          uni.city,
          uni.country,
          uni.short,
          uni.shortName,
        ].some((value) => value?.toLowerCase().includes(query))
      );
    }

    if (country !== "All") {
      result = result.filter((uni) => uni.country === country);
    }

    if (level !== "All") {
      result = result.filter((uni) => uni.levels?.includes(level));
    }

    if (subject !== "All") {
      result = result.filter((uni) => uni.subjects?.includes(subject));
    }

    if (type !== "All") {
      result = result.filter((uni) => uni.type === type);
    }

    if (showSaved) {
      result = result.filter((uni) => saved.includes(uni.id));
    }

    result.sort((a, b) =>
      sort === "az"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return result;
  }, [search, country, level, subject, type, sort, showSaved, saved]);

  // SAVE OR REMOVE UNIVERSITY
  async function toggleSaved(university) {
    if (!requireLogin()) return;
    if (savingId) return;

    setSaveError("");

    const wasSaved = saved.includes(university.id);
    const previousSaved = saved;

    const updatedSaved = wasSaved
      ? saved.filter((id) => id !== university.id)
      : [...saved, university.id];

    setSaved(updatedSaved);
    setSavingId(university.id);

    const updatedUniversities = updatedSaved
      .map((id) => {
        const item = universities.find((uni) => uni.id === id);

        if (!item) return null;

        return {
          id: item.id,
          name: item.name,
          short: item.short,
          shortName: item.shortName,
          location: item.location,
          city: item.city,
          country: item.country,
          type: item.type,
          color: item.color,
          levels: item.levels,
          subjects: item.subjects,
        };
      })
      .filter(Boolean);

    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          universities: updatedUniversities,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save university.");
      }
    } catch (error) {
      console.error("University save error:", error);
      setSaved(previousSaved);
      setSaveError(error.message);
    } finally {
      setSavingId(null);
    }
  }

  // OPEN UNIVERSITY DETAILS
  function openUniversity(university) {
    if (!requireLogin()) return;
    setSelected(university);
  }

  // COMPARE UNIVERSITIES
  function toggleCompare(id) {
    setCompare((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      if (previous.length >= 3) return previous;

      return [...previous, id];
    });
  }

  function clearFilters() {
    setSearch("");
    setCountry("All");
    setLevel("All");
    setSubject("All");
    setType("All");
    setSort("az");
  }

  const comparedUniversities = universities.filter((uni) =>
    compare.includes(uni.id)
  );

  const relatedCareers = selected
    ? getCareersForUniversity(selected) || []
    : [];

  return (
    <main className="university-page">
      {/* NAVIGATION */}
      <nav className="university-navbar">
        <div className="container">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="active-nav"
          >
            {isAuthenticated ? "← Back to Dashboard" : "← Back to Home"}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="university-hero">
        <div className="container">
          <p className="eyebrow">Discover · University Explorer</p>

          <h1>
            Find your <span>next chapter.</span>
          </h1>

          <p>
            Explore universities, discover academic opportunities, and
            shortlist the places that match your future goals.
          </p>

          <div className="university-hero-stats">
            <div>
              <strong>{universities.length}</strong>
              <span>Universities</span>
            </div>

            <div>
              <strong>{countries.length - 1}</strong>
              <span>Countries</span>
            </div>

            <div>
              <strong>{saved.length}</strong>
              <span>Saved universities</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORER */}
      <section className="explorer-section">
        <div className="container">
          {/* PERSONALIZED RECOMMENDATIONS */}
          {shouldShowRecommendations && !isLoadingSaved && (
            <section style={{ marginBottom: "55px" }}>
              <div className="explorer-heading">
                <div>
                  <p className="eyebrow">Smart University Matching</p>

                  <h2>
                    Recommended <span>for you.</span>
                  </h2>

                  <p>
                    Universities ranked using your academic background,
                    interests, skills, and career goals.
                  </p>
                </div>
              </div>

              {recommendedUniversities.length > 0 ? (
                <div className="university-grid">
                  {recommendedUniversities.map((uni) => {
                    const isSaved = saved.includes(uni.id);
                    const isCompared = compare.includes(uni.id);

                    return (
                      <article className="university-card" key={uni.id}>
                        <div className="university-card-top">
                          <div
                            className="university-monogram"
                            style={
                              uni.color
                                ? { background: uni.color }
                                : undefined
                            }
                          >
                            {uni.shortName || uni.short || uni.name?.charAt(0)}
                          </div>

                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              padding: "8px 12px",
                              borderRadius: "20px",
                              background: "rgba(119, 112, 255, 0.14)",
                              color: "var(--violet, #7770ff)",
                            }}
                          >
                            {uni.matchScore}% match
                          </span>
                        </div>

                        <p className="university-location">
                          {uni.location || uni.city}
                          {uni.country ? `, ${uni.country}` : ""}
                        </p>

                        <h3>{uni.name}</h3>

                        <div className="university-tags">
                          {uni.type && <span>{uni.type}</span>}

                          {(uni.levels || []).slice(0, 2).map((item, index) => (
                            <span key={`${uni.id}-match-level-${index}`}>
                              {typeof item === "string"
                                ? item
                                : item?.name || item?.title}
                            </span>
                          ))}
                        </div>

                        <div style={{ margin: "16px 0" }}>
                          <strong style={{ fontSize: "13px" }}>
                            Why this matches your profile
                          </strong>

                          <ul
                            style={{
                              paddingLeft: "18px",
                              marginTop: "9px",
                              fontSize: "13px",
                              lineHeight: "1.7",
                              color: "var(--muted, #a0a0a0)",
                            }}
                          >
                            {uni.matchReasons.map((reason, index) => (
                              <li key={`${uni.id}-reason-${index}`}>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {uni.matchedSubjects.length > 0 && (
                          <div className="university-subjects">
                            {uni.matchedSubjects.map((item, index) => (
                              <span key={`${uni.id}-matched-${index}`}>
                                #{item}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="university-card-actions">
                          <button
                            className="details-button"
                            onClick={() => openUniversity(uni)}
                          >
                            Explore university
                          </button>

                          <button
                            className={`save-button ${
                              isSaved ? "is-saved" : ""
                            }`}
                            onClick={() => toggleSaved(uni)}
                            disabled={savingId === uni.id}
                          >
                            {savingId === uni.id
                              ? "…"
                              : isSaved
                              ? "♥ Saved"
                              : "♡ Save"}
                          </button>

                          <button
                            className={`compare-button ${
                              isCompared ? "compare-active" : ""
                            }`}
                            onClick={() => toggleCompare(uni.id)}
                            disabled={!isCompared && compare.length >= 3}
                          >
                            {isCompared ? "Added" : "Compare"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="directory-note">
                  <div className="directory-note-icon">✦</div>

                  <div>
                    <h3>Let's complete your student profile.</h3>
                    <p>
                      Add your degree, interests, and skills to receive
                      personalized university recommendations.
                    </p>

                    <Link href="/dashboard" className="reset-button">
                      Update my profile →
                    </Link>
                  </div>
                </div>
              )}

              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted, #999)",
                  marginTop: "18px",
                }}
              >
                Match scores represent profile relevance, not admission
                eligibility or acceptance probability. Always verify
                admission information on official university websites.
              </p>
            </section>
          )}

          <div className="explorer-heading">
            <div>
              <p className="eyebrow">Your academic journey</p>

              <h2>
                Explore <span>universities.</span>
              </h2>

              <p>
                Find a university that fits your interests and future plans.
              </p>
            </div>

            <button
              className={`saved-toggle ${showSaved ? "saved-active" : ""}`}
              onClick={() => {
                if (!requireLogin()) return;
                setShowSaved((previous) => !previous);
              }}
            >
              ♡ {showSaved ? "Show all universities" : `Saved (${saved.length})`}
            </button>
          </div>

          {saveError && <div className="save-error">{saveError}</div>}

          {!isAuthenticated && !isLoadingSaved && (
            <div className="directory-note">
              <div className="directory-note-icon">✦</div>
              <div>
                <h3>Build your personal university shortlist</h3>
                <p>
                  You can browse universities freely. Log in or create an
                  account to explore university details and save your
                  favourites.
                </p>
              </div>
            </div>
          )}

          {/* FILTER PANEL */}
          <div className="filter-panel">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by university, city, or country..."
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div className="filter-grid">
              <label>
                Country
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                >
                  {countries.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All countries" : item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Study level
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                >
                  {levels.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All study levels" : item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Subject
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                >
                  {subjects.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All subjects" : item}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                University type
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  {types.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All university types" : item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="filter-bottom">
              <span>
                Showing <strong>{filteredUniversities.length}</strong>{" "}
                universities
              </span>

              <div className="sort-control">
                <label htmlFor="university-sort">Sort by</label>

                <select
                  id="university-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="az">Name: A–Z</option>
                  <option value="za">Name: Z–A</option>
                </select>

                <button className="reset-button" onClick={clearFilters}>
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* UNIVERSITY GRID */}
          {isLoadingSaved ? (
            <div className="empty-state">
              <p>Loading universities...</p>
            </div>
          ) : filteredUniversities.length === 0 ? (
            <div className="empty-state">
              <div>⌕</div>
              <h3>No universities found</h3>
              <p>Try changing your search or filters.</p>

              <button className="details-button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="university-grid">
              {filteredUniversities.map((uni) => {
                const isSaved = saved.includes(uni.id);
                const isCompared = compare.includes(uni.id);

                return (
                  <article className="university-card" key={uni.id}>
                    <div className="university-card-top">
                      <div
                        className="university-monogram"
                        style={
                          uni.color
                            ? { background: uni.color }
                            : undefined
                        }
                      >
                        {uni.shortName || uni.short || uni.name?.charAt(0)}
                      </div>

                      <button
                        className={`save-button ${isSaved ? "is-saved" : ""}`}
                        onClick={() => toggleSaved(uni)}
                        disabled={savingId === uni.id || isLoadingSaved}
                        aria-label={
                          isSaved
                            ? "Remove saved university"
                            : "Save university"
                        }
                      >
                        {savingId === uni.id ? "…" : isSaved ? "♥" : "♡"}
                      </button>
                    </div>

                    <p className="university-location">
                      {uni.location || uni.city}
                      {uni.country ? `, ${uni.country}` : ""}
                    </p>

                    <h3>{uni.name}</h3>

                    <div className="university-tags">
                      {uni.type && <span>{uni.type}</span>}

                      {(uni.levels || []).slice(0, 2).map((item, index) => (
                        <span key={`${uni.id}-level-${index}`}>
                          {typeof item === "string"
                            ? item
                            : item?.name || item?.title}
                        </span>
                      ))}
                    </div>

                    <div className="university-subjects">
                      {(uni.subjects || []).slice(0, 3).map((item, index) => (
                        <span key={`${uni.id}-subject-${index}`}>
                          #{typeof item === "string"
                            ? item
                            : item?.name || item?.title}
                        </span>
                      ))}
                    </div>

                    <div className="university-card-actions">
                      <button
                        className="details-button"
                        onClick={() => openUniversity(uni)}
                      >
                        Explore university
                      </button>

                      <button
                        className={`compare-button ${
                          isCompared ? "compare-active" : ""
                        }`}
                        onClick={() => toggleCompare(uni.id)}
                        disabled={!isCompared && compare.length >= 3}
                      >
                        {isCompared ? "Added" : "Compare"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* DIRECTORY NOTE */}
          <div className="directory-note" style={{ marginTop: "35px" }}>
            <div className="directory-note-icon">✦</div>

            <div>
              <h3>Your next chapter starts with exploration.</h3>
              <p>
                Compare your options, explore different study areas, and
                build a shortlist of universities that interest you.
                Always check official university websites for current
                admission requirements and application information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON DOCK */}
      {compare.length > 0 && (
        <div className="compare-dock">
          <div>
            <strong>Compare universities ({compare.length}/3)</strong>
            <span>Select up to three universities</span>
          </div>

          <div className="compare-dock-names">
            {comparedUniversities.map((uni) => (
              <span key={uni.id}>
                {uni.shortName || uni.name}
              </span>
            ))}
          </div>

          <button
            className="compare-dock-button"
            onClick={() => {
              if (comparedUniversities.length > 0) {
                openUniversity(comparedUniversities[0]);
              }
            }}
          >
            View details
          </button>

          <button
            className="compare-clear"
            onClick={() => setCompare([])}
            aria-label="Clear comparison"
          >
            ×
          </button>
        </div>
      )}

      {/* UNIVERSITY DETAILS MODAL */}
      {selected && (
        <div
          className="university-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="university-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="university-modal-monogram">
              {selected.shortName ||
                selected.short ||
                selected.name?.charAt(0)}
            </div>

            <p className="eyebrow">University details</p>

            <h2>{selected.name}</h2>

            <p className="modal-location">
              {selected.location || selected.city}
              {selected.country ? `, ${selected.country}` : ""}
            </p>

            <p className="modal-intro">
              Explore the available study levels and academic subjects
              associated with this university.
            </p>

            {/* BASIC INFORMATION */}
            <div className="modal-info-grid">
              <div>
                <span>University type</span>
                <strong>{selected.type || "Not specified"}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {selected.location || selected.city || "Not specified"}
                </strong>
              </div>
            </div>

            {/* STUDY LEVELS */}
            <div className="modal-subjects">
              <span>Available study levels</span>

              <div className="university-subjects">
                {(selected.levels || []).length > 0 ? (
                  selected.levels.map((item, index) => (
                    <span key={`${selected.id}-modal-level-${index}`}>
                      {typeof item === "string"
                        ? item
                        : item?.name || item?.title}
                    </span>
                  ))
                ) : (
                  <span>Not specified</span>
                )}
              </div>
            </div>

            {/* SUBJECTS */}
            <div className="modal-subjects">
              <span>Subjects</span>

              <div className="university-subjects">
                {(selected.subjects || []).length > 0 ? (
                  selected.subjects.map((item, index) => (
                    <span key={`${selected.id}-modal-subject-${index}`}>
                      {typeof item === "string"
                        ? item
                        : item?.name || item?.title}
                    </span>
                  ))
                ) : (
                  <span>Not specified</span>
                )}
              </div>
            </div>

            {/* TUITION AND BUDGET */}
            <div className="official-info-note">
              <strong>Tuition & Budget</strong>

              {selected.budget?.amount !== null &&
                selected.budget?.amount !== undefined && (
                  <p style={{ marginTop: "10px", marginBottom: "8px" }}>
                    <strong
                      style={{
                        color: "var(--yellow, #f8d943)",
                        fontSize: "18px",
                      }}
                    >
                      {getCurrencySymbol(selected.budget.currency)}
                      {Number(selected.budget.amount).toLocaleString()}
                    </strong>
                    {" "}
                    <span>{selected.budget.period || ""}</span>
                  </p>
                )}

              <p>
                {selected.budget?.summary ||
                  "Tuition information is not currently available. Please check the official university fee page."}
              </p>

              {selected.budget?.studentCategory && (
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                  Student category: {selected.budget.studentCategory}
                </p>
              )}

              {selected.dataNote && (
                <p style={{ marginTop: "8px", fontSize: "12px" }}>
                  Note: {selected.dataNote}
                </p>
              )}
            </div>

            {/* SCHOLARSHIPS */}
            <div className="official-info-note" style={{ marginTop: "16px" }}>
              <strong>Scholarships & Financial Aid</strong>

              <p style={{ marginTop: "10px" }}>
                {selected.scholarships?.summary ||
                  "Scholarship information is not currently available. Check the university's official website."}
              </p>

              {selected.scholarships?.opportunities?.length > 0 && (
                <ul
                  style={{
                    paddingLeft: "20px",
                    marginTop: "10px",
                    lineHeight: "1.8",
                    color: "var(--muted, #a0a0a0)",
                  }}
                >
                  {selected.scholarships.opportunities.map((item, index) => (
                    <li key={`${selected.id}-scholarship-${index}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* OFFICIAL UNIVERSITY LINKS */}
            <div className="official-info-note" style={{ marginTop: "16px" }}>
              <strong>Official University Links</strong>

              <p style={{ marginTop: "8px" }}>
                Visit these official pages to verify current admission
                requirements, tuition fees, and scholarship eligibility.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "14px",
                }}
              >
                {selected.website && (
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reset-button"
                  >
                    University Website ↗
                  </a>
                )}

                {selected.officialLinks?.tuition && (
                  <a
                    href={selected.officialLinks.tuition}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reset-button"
                  >
                    Tuition & Fees ↗
                  </a>
                )}

                {selected.officialLinks?.scholarships && (
                  <a
                    href={selected.officialLinks.scholarships}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reset-button"
                  >
                    Scholarships ↗
                  </a>
                )}

                {selected.officialLinks?.admission && (
                  <a
                    href={selected.officialLinks.admission}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reset-button"
                  >
                    Admissions ↗
                  </a>
                )}
              </div>
            </div>

            {/* UNIVERSITY ACTIONS */}
            <div className="modal-actions">
              <button
                className="details-button"
                onClick={() => toggleSaved(selected)}
                disabled={savingId === selected.id}
              >
                {saved.includes(selected.id)
                  ? "♥ Saved"
                  : "♡ Save university"}
              </button>

              <button
                className="secondary-button compare-button"
                onClick={() => toggleCompare(selected.id)}
              >
                {compare.includes(selected.id)
                  ? "Remove from comparison"
                  : "Add to comparison"}
              </button>
            </div>

            {/* RELATED CAREERS */}
            <div className="modal-subjects">
              <span>Related career paths</span>

              {relatedCareers.length > 0 ? (
                <div className="university-subjects">
                  {relatedCareers.map((career, index) => (
                    <span key={`${selected.id}-career-${index}`}>
                      {getCareerName(career)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="modal-intro">
                  Explore the Career Explorer to discover related paths.
                </p>
              )}

              <Link href="/careers" className="reset-button">
                Explore Career Explorer →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN / SIGNUP POPUP */}
      {showAuthPrompt && (
        <div
          className="university-modal-backdrop"
          onClick={() => setShowAuthPrompt(false)}
        >
          <div
            className="university-modal auth-prompt-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setShowAuthPrompt(false)}
              aria-label="Close login prompt"
            >
              ×
            </button>

            <div className="university-modal-monogram">✦</div>

            <p className="eyebrow">Your journey starts here</p>

            <h2>Create your Onkur account.</h2>

            <p className="modal-intro">
              Join Onkur to explore university details, save your
              favourite universities, and build your personal academic
              shortlist.
            </p>

            <div className="modal-actions">
              <Link href="/login" className="details-button">
                Log in
              </Link>

              <Link href="/signup" className="compare-button">
                Create an account
              </Link>
            </div>

            <p className="modal-intro" style={{ textAlign: "center" }}>
              You can continue browsing universities without an account.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
