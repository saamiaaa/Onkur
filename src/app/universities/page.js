"use client";

import { getCareersForUniversity } from "../data/careerLinks";
import { useMemo, useState } from "react";
import Link from "next/link";
import universities from "../data/universities";

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

  const countries = ["All", ...new Set(universities.map((u) => u.country))];
  const subjects = [
    "All",
    ...new Set(universities.flatMap((u) => u.subjects)),
  ];

  const filteredUniversities = useMemo(() => {
    let results = universities.filter((university) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        university.name.toLowerCase().includes(searchText) ||
        university.city.toLowerCase().includes(searchText) ||
        university.country.toLowerCase().includes(searchText) ||
        university.subjects.some((item) =>
          item.toLowerCase().includes(searchText)
        );

      const matchesCountry =
        country === "All" || university.country === country;

      const matchesLevel =
        level === "All" || university.levels.includes(level);

      const matchesSubject =
        subject === "All" || university.subjects.includes(subject);

      const matchesType = type === "All" || university.type === type;

      const matchesSaved = !showSaved || saved.includes(university.id);

      return (
        matchesSearch &&
        matchesCountry &&
        matchesLevel &&
        matchesSubject &&
        matchesType &&
        matchesSaved
      );
    });

    if (sort === "az") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      results.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "country") {
      results.sort((a, b) => a.country.localeCompare(b.country));
    }

    return results;
  }, [search, country, level, subject, type, sort, saved, showSaved]);

  function toggleSaved(id) {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleCompare(id) {
    setCompare((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, id];
    });
  }

  function resetFilters() {
    setSearch("");
    setCountry("All");
    setLevel("All");
    setSubject("All");
    setType("All");
    setSort("az");
    setShowSaved(false);
  }

  const comparedUniversities = universities.filter((u) =>
    compare.includes(u.id)
  );

  return (
    <main className="university-page">
      <div className="site-background" />

      <header className="container navbar university-navbar">
        <Link href="/" className="logo">
          onkur<span>.</span>
        </Link>

        <nav className="nav-links">
          <Link href="/universities" className="active-nav">
            Universities
          </Link>
          <Link href="/#careers">Careers</Link>
          <Link href="/#develop">Develop</Link>
          <Link href="/#connect">Connect</Link>
        </nav>

        <div className="nav-actions">
          <Link href="/login" className="login-link">
            Log in
          </Link>
          <Link href="/signup" className="primary-button">
            Get Started →
          </Link>
        </div>
      </header>

      <section className="container university-hero">
        <div className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>

        <h1>
          Find the university
          <br />
          <span>that fits your future.</span>
        </h1>

        <p>
          Explore universities in Bangladesh and around the world.
          Discover your options, narrow down your choices and make
          more informed decisions.
        </p>

        <div className="university-hero-stats">
          <div>
            <strong>{universities.length.toString().padStart(2, "0")}</strong>
            <span>Starter listings</span>
          </div>
          <div>
            <strong>{countries.length - 1}</strong>
            <span>Countries</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Compare at once</span>
          </div>
        </div>
      </section>

      <section className="container explorer-section">
        <div className="explorer-heading">
          <div>
            <div className="eyebrow">DISCOVER YOUR OPTIONS</div>
            <h2>University explorer<span>.</span></h2>
            <p>Search, filter and shortlist universities that interest you.</p>
          </div>

          <button
            className={`saved-toggle ${showSaved ? "saved-active" : ""}`}
            onClick={() => setShowSaved(!showSaved)}
          >
            ♡ Saved ({saved.length})
          </button>
        </div>

        <div className="filter-panel">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search university, country, city or subject..."
              aria-label="Search universities"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>

          <div className="filter-grid">
            <label>
              Country
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                {countries.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Study level
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option>All</option>
                <option>Undergraduate</option>
                <option>Postgraduate</option>
              </select>
            </label>

            <label>
              Subject
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                {subjects.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              University type
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option>All</option>
                <option>Public</option>
                <option>Private</option>
              </select>
            </label>
          </div>

          <div className="filter-bottom">
            <span>
              Showing <strong>{filteredUniversities.length}</strong> of{" "}
              {universities.length} universities
            </span>

            <div className="sort-control">
              <label htmlFor="university-sort">Sort by</label>
              <select
                id="university-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="az">Name: A–Z</option>
                <option value="za">Name: Z–A</option>
                <option value="country">Country</option>
              </select>

              <button className="reset-button" onClick={resetFilters}>
                Reset filters
              </button>
            </div>
          </div>
        </div>

        {filteredUniversities.length > 0 ? (
          <div className="university-grid">
            {filteredUniversities.map((university) => {
              const isSaved = saved.includes(university.id);
              const isCompared = compare.includes(university.id);

              return (
                <article className="university-card" key={university.id}>
                  <div className="university-card-top">
                    <div className="university-monogram">
                      {university.shortName.slice(0, 2)}
                    </div>

                    <button
                      className={`save-button ${isSaved ? "is-saved" : ""}`}
                      onClick={() => toggleSaved(university.id)}
                      aria-label={isSaved ? "Remove saved university" : "Save university"}
                      title={isSaved ? "Remove from saved" : "Save university"}
                    >
                      {isSaved ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="university-location">
                    {university.city}, {university.country}
                  </div>

                  <h3>{university.name}</h3>

                  <div className="university-tags">
                    <span>{university.type}</span>
                    <span>{university.levels[0]}</span>
                  </div>

                  <p>{university.description}</p>

                  <div className="university-subjects">
                    {university.subjects.slice(0, 3).map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                    {university.subjects.length > 3 && (
                      <span>+{university.subjects.length - 3}</span>
                    )}
                  </div>

                  <div className="university-card-actions">
                    <button
                      className="details-button"
                      onClick={() => setSelected(university)}
                    >
                      View details ↗
                    </button>

                    <button
                      className={`compare-button ${isCompared ? "compare-active" : ""}`}
                      onClick={() => toggleCompare(university.id)}
                      disabled={!isCompared && compare.length >= 3}
                    >
                      {isCompared ? "✓ Added" : "+ Compare"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div>⌕</div>
            <h3>No universities found</h3>
            <p>Try changing your search or removing some filters.</p>
            <button className="primary-button" onClick={resetFilters}>
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <section className="container directory-note">
        <div className="directory-note-icon">✦</div>
        <div>
          <h3>Make informed decisions.</h3>
          <p>
            This is an initial directory. Always confirm programs,
            tuition fees, scholarships and admission requirements
            through the university&apos;s official website.
          </p>
        </div>
      </section>

      <footer className="container footer university-footer">
        <div>
          <Link href="/" className="logo">
            onkur<span>.</span>
          </Link>
          <p style={{ marginTop: 12 }}>Find your direction. Build your future.</p>
          <p style={{ marginTop: 8 }}>© 2026 Onkur. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/universities">Universities</Link>
          <Link href="/#careers">Careers</Link>
        </div>
      </footer>

      {compare.length > 0 && (
        <div className="compare-dock">
          <div>
            <strong>Compare universities</strong>
            <span>{compare.length} of 3 selected</span>
          </div>

          <div className="compare-dock-names">
            {comparedUniversities.map((u) => (
              <span key={u.id}>{u.shortName}</span>
            ))}
          </div>

          <button
            className="compare-dock-button"
            onClick={() => setSelected({ comparison: true })}
            disabled={compare.length < 2}
          >
            Compare now →
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

      {selected && (
        <div
          className="university-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div
            className="university-modal"
            role="dialog"
            aria-modal="true"
            aria-label="University information"
          >
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              ×
            </button>

            {selected.comparison ? (
              <>
                <div className="eyebrow">YOUR SHORTLIST</div>
                <h2>Compare your choices<span>.</span></h2>
                <p className="modal-intro">
                  Compare the basic information available in this starter directory.
                </p>

                <div className="comparison-table">
                  <div
                    className="comparison-row comparison-header"
                      style={{
                        gridTemplateColumns: `0.8fr repeat(${comparedUniversities.length}, minmax(0, 1fr))`,
                      }}
                  >
                    <span>Information</span>
                    {comparedUniversities.map((u) => (
                      <span key={u.id}>{u.shortName}</span>
                    ))}
                  </div>

                  {[
                    ["Location", (u) => `${u.city}, ${u.country}`],
                    ["Type", (u) => u.type],
                    ["Study levels", (u) => u.levels.join(", ")],
                    ["Subjects", (u) => u.subjects.join(", ")],
                  ].map(([label, getValue]) => (
                    <div
                      className="comparison-row"
                        key={label}
                          style={{
                            gridTemplateColumns: `0.8fr repeat(${comparedUniversities.length}, minmax(0, 1fr))`,
                          }}
                    >
                      <span>{label}</span>
                      {comparedUniversities.map((u) => (
                        <span key={u.id}>{getValue(u)}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="university-modal-monogram">
                  {selected.shortName}
                </div>
                <div className="eyebrow">UNIVERSITY PROFILE</div>
                <h2>{selected.name}</h2>
                <p className="modal-location">
                  {selected.city}, {selected.country}
                </p>
                <p className="modal-intro">{selected.description}</p>

                <div className="modal-info-grid">
                  <div>
                    <span>Institution type</span>
                    <strong>{selected.type}</strong>
                  </div>
                  <div>
                    <span>Study levels</span>
                    <strong>{selected.levels.join(", ")}</strong>
                  </div>
                </div>

                <div className="modal-subjects">
                  <span>Subject areas</span>
                  <div className="university-subjects">
                    {selected.subjects.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>


<div className="university-career-connections">
  <div className="university-career-heading">
    <div>
      <span>EXPLORE YOUR FUTURE</span>
      <h3>Where could these subjects take you?</h3>
    </div>
    <span className="career-connection-icon">✳</span>
  </div>

  {getCareersForUniversity(selected).length > 0 ? (
    <div className="university-related-careers">
      {getCareersForUniversity(selected).map((career) => (
        <div className="university-related-career" key={career.id}>
          <div className="related-career-icon">{career.icon}</div>

          <div className="related-career-info">
            <strong>{career.title}</strong>
            <span>{career.category}</span>
          </div>

          <Link href="/careers" aria-label={`Explore ${career.title}`}>
            ↗
          </Link>
        </div>
      ))}
    </div>
  ) : (
    <p className="career-connection-empty">
      We haven't found related career paths in our current directory.
      Check back as we expand our information.
    </p>
  )}

  <Link href="/careers" className="all-careers-link">
    Explore all career paths →
  </Link>
</div>


                <div className="official-info-note">
                  <strong>Admission and fee information</strong>
                  <p>
                    Check the official university website for current
                    programs, tuition, scholarships and admission requirements.
                  </p>
                </div>

                <div className="modal-actions">
                  <a
                    href={selected.website}
                    target="_blank"
                    rel="noreferrer"
                    className="primary-button"
                  >
                    Official website ↗
                  </a>
                  <button
                    className="secondary-button"
                    onClick={() => toggleSaved(selected.id)}
                  >
                    {saved.includes(selected.id) ? "♥ Saved" : "♡ Save university"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
