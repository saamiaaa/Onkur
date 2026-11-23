
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function AnalysisSection({ title, subtitle, children }) {
  return (
    <section
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 22,
        marginBottom: 18,
      }}
    >
      <p
        style={{
          color: "var(--yellow)",
          fontSize: 10,
          letterSpacing: 2,
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {subtitle}
      </p>

      <h2
        style={{
          fontSize: 19,
          marginBottom: 18,
          color: "var(--foreground)",
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

function AnalysisList({ items, renderItem }) {
  if (!items || items.length === 0) {
    return (
      <p style={{ color: "var(--muted)", fontSize: 13 }}>
        No recommendations available yet.
      </p>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {items.map((item, index) => (
        <article
          key={index}
          style={{
            padding: 15,
            borderRadius: 10,
            background: "rgba(255,255,255,0.035)",
            border: "1px solid var(--border)",
          }}
        >
          {renderItem(item, index)}
        </article>
      ))}
    </div>
  );
}

export default function AnalyzerPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    let active = true;

    async function verifyUser() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to verify your account.");
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setCheckingAuth(false);
      }
    }

    verifyUser();

    return () => {
      active = false;
    };
  }, [router]);

  async function generateAnalysis() {
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch(`${API_URL}/ai/analyze-profile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not analyze your profile.");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const headingStyle = {
    color: "var(--foreground)",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 7,
  };

  const descriptionStyle = {
    color: "var(--muted)",
    fontSize: 13,
    lineHeight: 1.7,
  };

  if (checkingAuth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        Checking your account...
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--background)",
        color: "var(--foreground)",
        padding: "35px 20px 70px",
      }}
    >
      <div style={{ maxWidth: 950, margin: "0 auto" }}>
        <Link
          href="/dashboard"
          style={{
            color: "var(--muted)",
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          ← Back to dashboard
        </Link>

        <header style={{ margin: "35px 0 28px" }}>
          <p
            style={{
              color: "var(--yellow)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            ONKUR INTELLIGENCE
          </p>

          <h1
            style={{
              fontSize: "clamp(30px, 5vw, 44px)",
              lineHeight: 1.15,
              marginBottom: 13,
            }}
          >
            AI Student Profile Analyzer<span style={{ color: "var(--yellow)" }}>.</span>
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 14,
              lineHeight: 1.8,
              maxWidth: 650,
            }}
          >
            Understand your strengths, discover possible career directions,
            identify missing skills, and get a practical plan for your next
            steps.
          </p>
        </header>

        <section
          style={{
            padding: 23,
            border: "1px solid var(--border)",
            borderRadius: 14,
            background: "rgba(255,255,255,0.025)",
            marginBottom: 22,
          }}
        >
          <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
            <div style={{ fontSize: 24, color: "var(--yellow)" }}>✦</div>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 17, marginBottom: 8 }}>
                Get your personalized analysis
              </h2>

              <p style={descriptionStyle}>
                Onkur will use your saved academic profile, interests, skills,
                career choices, university shortlist, and learning progress.
              </p>

              <button
                type="button"
                onClick={generateAnalysis}
                disabled={loading}
                style={{
                  marginTop: 20,
                  padding: "13px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: "var(--yellow)",
                  color: "#171717",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.65 : 1,
                }}
              >
                {loading ? "Analyzing your profile..." : "✦ Analyze my profile"}
              </button>
            </div>
          </div>

          <p
            style={{
              color: "var(--muted)",
              fontSize: 11,
              lineHeight: 1.6,
              marginTop: 18,
              borderTop: "1px solid var(--border)",
              paddingTop: 13,
            }}
          >
            Your relevant profile information is sent to Google's Gemini API
            to generate this report. Your API key stays on the backend.
            AI suggestions are guidance, not guaranteed outcomes.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            style={{
              padding: 14,
              border: "1px solid #d97757",
              borderRadius: 9,
              color: "var(--foreground)",
              fontSize: 13,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: 35,
              color: "var(--muted)",
              fontSize: 13,
            }}
          >
            <div style={{ fontSize: 27, marginBottom: 12 }}>✦</div>
            Gemini is reviewing your student profile and preparing your
            recommendations. This may take a little while.
          </div>
        )}

        {analysis && (
          <div>
            <AnalysisSection
              title="Your profile overview"
              subtitle="01 / OVERALL ANALYSIS"
            >
              <p style={{ ...descriptionStyle, fontSize: 14 }}>
                {analysis.summary}
              </p>
            </AnalysisSection>

            <AnalysisSection
              title="Your strengths"
              subtitle="02 / WHAT YOU ALREADY HAVE"
            >
              <AnalysisList
                items={analysis.strengths}
                renderItem={(item) => (
                  <p style={descriptionStyle}>✦ {item}</p>
                )}
              />
            </AnalysisSection>

            <AnalysisSection
              title="Areas to improve"
              subtitle="03 / GROWTH OPPORTUNITIES"
            >
              <AnalysisList
                items={analysis.growthAreas}
                renderItem={(item) => (
                  <p style={descriptionStyle}>{item}</p>
                )}
              />
            </AnalysisSection>

            <AnalysisSection
              title="Possible career directions"
              subtitle="04 / EXPLORE YOUR FUTURE"
            >
              <AnalysisList
                items={analysis.careerDirections}
                renderItem={(item) => (
                  <>
                    <h3 style={headingStyle}>{item.title}</h3>
                    <p style={descriptionStyle}>{item.reason}</p>
                  </>
                )}
              />
            </AnalysisSection>

            <AnalysisSection
              title="Skills worth building"
              subtitle="05 / YOUR NEXT SKILLS"
            >
              <AnalysisList
                items={analysis.skillsToBuild}
                renderItem={(item) => (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <h3 style={headingStyle}>{item.skill}</h3>
                      <span
                        style={{
                          color: "var(--yellow)",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {item.priority} PRIORITY
                      </span>
                    </div>
                    <p style={descriptionStyle}>{item.reason}</p>
                  </>
                )}
              />
            </AnalysisSection>

            <AnalysisSection
              title="Your action plan"
              subtitle="06 / TURN INSIGHT INTO ACTION"
            >
              <AnalysisList
                items={analysis.actionPlan}
                renderItem={(item, index) => (
                  <div style={{ display: "flex", gap: 13 }}>
                    <span
                      style={{
                        color: "var(--yellow)",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <p style={descriptionStyle}>{item.step}</p>
                      <p
                        style={{
                          color: "var(--yellow)",
                          fontSize: 11,
                          marginTop: 7,
                        }}
                      >
                        Suggested timeframe: {item.timeline}
                      </p>
                    </div>
                  </div>
                )}
              />
            </AnalysisSection>

            <p
              style={{
                color: "var(--muted)",
                fontSize: 11,
                lineHeight: 1.7,
                textAlign: "center",
                marginTop: 25,
              }}
            >
              This analysis is AI-generated guidance based on the information
              currently saved in your Onkur account. Review recommendations
              and verify important decisions independently.
            </p>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                type="button"
                onClick={generateAnalysis}
                disabled={loading}
                style={{
                  padding: "11px 18px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--foreground)",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ↻ Generate a new analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
