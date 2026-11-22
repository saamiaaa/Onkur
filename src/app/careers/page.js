"use client";

import { getUniversitiesForCareer } from "../data/careerLinks";
import { useMemo, useState } from "react";
import Link from "next/link";
import { careers, assessmentOptions } from "../data/careers";

export default function CareerExplorer() {
  const [interests, setInterests] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [workStyles, setWorkStyles] = useState([]);
  const [assessmentDone, setAssessmentDone] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [step, setStep] = useState(0);

  const categories = [
    "All",
    ...new Set(careers.map((career) => career.category)),
  ];

  function toggleOption(value, list, setList) {
    setList((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  }

  function calculateMatch(career) {
    const interestMatches = career.interests.filter((item) =>
      interests.includes(item)
    ).length;

    const strengthMatches = career.strengths.filter((item) =>
      strengths.includes(item)
    ).length;

    const workMatches = career.workStyles.filter((item) =>
      workStyles.includes(item)
    ).length;

    const interestScore = interests.length
      ? (interestMatches / interests.length) * 40
      : 0;

    const strengthScore = strengths.length
      ? (strengthMatches / strengths.length) * 40
      : 0;

    const workScore = workStyles.length
      ? (workMatches / workStyles.length) * 20
      : 0;

    const availableWeight =
      (interests.length ? 40 : 0) +
      (strengths.length ? 40 : 0) +
      (workStyles.length ? 20 : 0);

    if (!availableWeight) return 0;

    return Math.round(
      ((interestScore + strengthScore + workScore) / availableWeight) * 100
    );
  }

  const matchedCareers = useMemo(() => {
    if (!assessmentDone) return [];

    return careers
      .map((career) => ({
        ...career,
        match: calculateMatch(career),
      }))
      .sort((a, b) => b.match - a.match);
  }, [interests, strengths, workStyles, assessmentDone]);

  const filteredCareers = careers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(search.toLowerCase()) ||
      career.category.toLowerCase().includes(search.toLowerCase()) ||
      career.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || career.category === category;

    return matchesSearch && matchesCategory;
  });

  function finishAssessment() {
    setAssessmentDone(true);
    setShowAssessment(false);
    setStep(0);
  }

  function resetAssessment() {
    setInterests([]);
    setStrengths([]);
    setWorkStyles([]);
    setAssessmentDone(false);
    setStep(0);
  }

  const steps = [
    {
      title: "What are you interested in?",
      subtitle: "Choose the subjects and activities you enjoy.",
      key: "interests",
      options: assessmentOptions.interests,
      selected: interests,
      setter: setInterests,
    },
    {
      title: "What are your strengths?",
      subtitle: "Select the abilities that describe you best.",
      key: "strengths",
      options: assessmentOptions.strengths,
      selected: strengths,
      setter: setStrengths,
    },
    {
      title: "How do you prefer to work?",
      subtitle: "Choose the environments where you feel comfortable.",
      key: "workStyles",
      options: assessmentOptions.workStyles,
      selected: workStyles,
      setter: setWorkStyles,
    },
  ];

  const currentStep = steps[step];

  return (
    <main className="career-page">
      <nav className="career-nav">
        <Link href="/" className="career-logo">
          onkur<span>.</span>
        </Link>

        <div className="career-nav-links">
          <Link href="/universities">Universities</Link>
          <Link href="/careers" className="active">Careers</Link>
          <Link href="/develop">Develop</Link>
          <Link href="/connect">Connect</Link>
        </div>

        <Link href="/dashboard" className="career-nav-button">
          My Dashboard ↗
        </Link>
      </nav>

      <section className="career-hero">
        <div className="career-hero-content">
          <div className="career-eyebrow">
            <span></span> DISCOVER YOUR POSSIBILITIES
          </div>

          <h1>
            Your future,
            <br />
            <span>your direction.</span>
          </h1>

          <p>
            Explore career possibilities, understand what they involve,
            and discover paths that align with your interests and strengths.
          </p>

          <div className="career-hero-actions">
            <button
              className="career-primary-button"
              onClick={() => setShowAssessment(true)}
            >
              Find my career path <span>↗</span>
            </button>

            <a href="#career-directory" className="career-text-button">
              Explore careers ↓
            </a>
          </div>
        </div>

        <div className="career-hero-visual">
         <div className="career-orbit orbit-one">
          <span className="orbit-dot dot-one"></span>
          </div>

        <div className="career-orbit orbit-two">
         <span className="orbit-dot dot-two"></span>
        </div>

        <div className="career-center-glow"></div>
         <div className="career-center-icon">✳</div>

          <div className="career-floating-card float-one">
            <span>💻</span>
            <div>
              <strong>Technology</strong>
              <small>Build what's next</small>
            </div>
          </div>

          <div className="career-floating-card float-two">
            <span>🎨</span>
            <div>
              <strong>Creative fields</strong>
              <small>Turn ideas into reality</small>
            </div>
          </div>

          <div className="career-floating-card float-three">
            <span>🔬</span>
            <div>
              <strong>Research</strong>
              <small>Explore the unknown</small>
            </div>
          </div>

          <div className="career-floating-card float-four">
            <span>📈</span>
            <div>
              <strong>Business</strong>
              <small>Create opportunities</small>
            </div>
          </div>
        </div>
      </section>

      <section className="career-stats">
        <div>
          <strong>{careers.length}+</strong>
          <span>Career paths to explore</span>
        </div>
        <div>
          <strong>{categories.length - 1}</strong>
          <span>Career categories</span>
        </div>
        <div>
          <strong>01</strong>
          <span>Personalized assessment</span>
        </div>
      </section>

      {assessmentDone && matchedCareers.length > 0 && (
        <section className="career-matches">
          <div className="career-section-heading">
            <div>
              <div className="career-eyebrow">YOUR RESULTS</div>
              <h2>Career paths that match you.</h2>
              <p>
                These matches are calculated from the interests, strengths,
                and work preferences you selected.
              </p>
            </div>

            <button
              className="career-outline-button"
              onClick={() => setShowAssessment(true)}
            >
              Retake assessment
            </button>
          </div>

          <div className="career-match-grid">
            {matchedCareers.slice(0, 3).map((career, index) => (
              <article className="career-match-card" key={career.id}>
                <div className="career-match-top">
                  <span className="career-match-icon">{career.icon}</span>
                  <span className="career-match-rank">
                    MATCH #{index + 1}
                  </span>
                </div>

                <h3>{career.title}</h3>
                <span className="career-category-label">
                  {career.category}
                </span>

                <div className="career-match-score">
                  <strong>{career.match}%</strong>
                  <span>Compatibility score</span>
                </div>

                <div className="career-progress-track">
                  <div style={{ width: `${career.match}%` }}></div>
                </div>

                <button
                  className="career-card-link"
                  onClick={() => setSelectedCareer(career)}
                >
                  Explore this career ↗
                </button>
              </article>
            ))}
          </div>

          <p className="career-disclaimer">
            Match scores are indicative comparisons based only on your
            selections. They are not aptitude tests or guarantees of career
            success.
          </p>
        </section>
      )}

      <section className="career-directory" id="career-directory">
        <div className="career-section-heading">
          <div>
            <div className="career-eyebrow">EXPLORE YOUR OPTIONS</div>
            <h2>Find a path that inspires you.</h2>
            <p>
              Browse different fields and learn what each career involves.
            </p>
          </div>
        </div>

        <div className="career-directory-controls">
          <div className="career-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search careers or categories..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="career-category-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "selected" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredCareers.length > 0 ? (
          <div className="career-directory-grid">
            {filteredCareers.map((career) => (
              <article className="career-directory-card" key={career.id}>
                <div className="career-directory-card-top">
                  <span className="career-directory-icon">
                    {career.icon}
                  </span>
                  <span>{career.category}</span>
                </div>

                <h3>{career.title}</h3>
                <p>{career.description}</p>

                <div className="career-subject-tags">
                  {career.subjects.slice(0, 2).map((subject) => (
                    <span key={subject}>{subject}</span>
                  ))}
                </div>

                <button
                  className="career-card-link"
                  onClick={() => setSelectedCareer(career)}
                >
                  Explore career ↗
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="career-empty-state">
            <span>🔎</span>
            <h3>No careers found</h3>
            <p>Try another search term or category.</p>
            <button
              className="career-outline-button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="career-cta">
        <div>
          <div className="career-eyebrow">TAKE THE FIRST STEP</div>
          <h2>Not sure where to begin?</h2>
          <p>
            Start with what you enjoy, discover your strengths,
            and explore the possibilities.
          </p>
        </div>

        <button
          className="career-primary-button"
          onClick={() => setShowAssessment(true)}
        >
          Take the assessment ↗
        </button>
      </section>

      <footer className="career-footer">
        <Link href="/" className="career-logo">
          onkur<span>.</span>
        </Link>
        <p>Find your direction. Build your future.</p>
        <span>© 2026 Onkur</span>
      </footer>

      {showAssessment && (
        <div
          className="career-modal-backdrop"
          onClick={() => setShowAssessment(false)}
        >
          <div
            className="career-assessment-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="career-modal-top">
              <div>
                <div className="career-eyebrow">CAREER ASSESSMENT</div>
                <span>STEP {step + 1} OF 3</span>
              </div>

              <button
                className="career-close-button"
                onClick={() => setShowAssessment(false)}
                aria-label="Close assessment"
              >
                ×
              </button>
            </div>

            <div className="career-step-track">
              <div style={{ width: `${((step + 1) / 3) * 100}%` }}></div>
            </div>

            <h2>{currentStep.title}</h2>
            <p className="career-modal-subtitle">
              {currentStep.subtitle}
            </p>

            <div className="career-assessment-options">
              {currentStep.options.map((option) => {
                const isSelected =
                  currentStep.selected.includes(option.id);

                return (
                  <button
                    key={option.id}
                    className={`career-option ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      toggleOption(
                        option.id,
                        currentStep.selected,
                        currentStep.setter
                      )
                    }
                  >
                    {option.icon && <span>{option.icon}</span>}
                    {option.label}
                    <span className="career-option-check">
                      {isSelected ? "✓" : "+"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="career-assessment-footer">
              <button
                className="career-outline-button"
                onClick={() => {
                  if (step === 0) {
                    setShowAssessment(false);
                  } else {
                    setStep((previous) => previous - 1);
                  }
                }}
              >
                {step === 0 ? "Cancel" : "← Back"}
              </button>

              {step < 2 ? (
                <button
                  className="career-primary-button"
                  disabled={currentStep.selected.length === 0}
                  onClick={() => setStep((previous) => previous + 1)}
                >
                  Continue →
                </button>
              ) : (
                <button
                  className="career-primary-button"
                  disabled={
                    interests.length === 0 ||
                    strengths.length === 0 ||
                    workStyles.length === 0
                  }
                  onClick={finishAssessment}
                >
                  See my matches ↗
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCareer && (
        <div
          className="career-modal-backdrop"
          onClick={() => setSelectedCareer(null)}
        >
          <div
            className="career-detail-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="career-close-button"
              onClick={() => setSelectedCareer(null)}
              aria-label="Close career details"
            >
              ×
            </button>

            <span className="career-detail-icon">
              {selectedCareer.icon}
            </span>

            <div className="career-eyebrow">
              {selectedCareer.category.toUpperCase()}
            </div>

            <h2>{selectedCareer.title}</h2>
            <p className="career-detail-description">
              {selectedCareer.description}
            </p>

            <div className="career-detail-section">
              <h3>Related academic subjects</h3>
              <div className="career-detail-section">
  <h3>Universities to explore</h3>

  {getUniversitiesForCareer(selectedCareer).length > 0 ? (
    <div className="related-university-list">
      {getUniversitiesForCareer(selectedCareer).map((university) => (
        <div className="related-university-item" key={university.id}>
          <div>
            <strong>{university.name}</strong>
            <span>
              {university.city}, {university.country}
            </span>
          </div>

          <Link href="/universities">Explore ↗</Link>
        </div>
      ))}
    </div>
  ) : (
    <p className="career-detail-description">
      No matching universities have been added to the directory yet.
    </p>
  )}
</div>
              <div className="career-detail-tags">
                {selectedCareer.subjects.map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
              </div>
            </div>

            <div className="career-detail-section">
              <h3>Skills to develop</h3>
              <div className="career-detail-tags">
                {selectedCareer.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="career-detail-section">
              <h3>Possible career paths</h3>
              <ul className="career-path-list">
                {selectedCareer.paths.map((path) => (
                  <li key={path}>{path}</li>
                ))}
              </ul>
            </div>

            <p className="career-disclaimer">
              These are illustrative pathways, not guaranteed job outcomes.
              Requirements vary by employer and location.
            </p>

            <button
              className="career-primary-button career-detail-done"
              onClick={() => setSelectedCareer(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
