"use client";

import { getCareersForUniversity } from "../data/careerLinks";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import universities from "../data/universities";

const API_URL = "http://localhost:5000/api";

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

  // LOAD THE LOGGED-IN USER'S SAVED UNIVERSITIES
  useEffect(() => {
    let isMounted = true;

    async function loadSavedUniversities() {
      try {
        const authResponse = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (authResponse.status === 401) {
          if (isMounted) setIsAuthenticated(false);
          return;
        }

        if (!authResponse.ok) {
          throw new Error("Unable to verify your account.");
        }

        if (isMounted) setIsAuthenticated(true);

        const dashboardResponse = await fetch(`${API_URL}/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        if (dashboardResponse.status === 401) {
          if (isMounted) setIsAuthenticated(false);
          return;
        }

        if (!dashboardResponse.ok) {
          throw new Error("Unable to load your saved universities.");
        }

        const dashboardData = await dashboardResponse.json();
        const savedUniversities = dashboardData.dashboard?.universities || [];

        const savedIds = savedUniversities
          .map((university) => {
            const matchedUniversity = universities.find(
              (item) =>
                item.id === university.id ||
                item.name === university.name
            );

            return matchedUniversity?.id;
          })
          .filter(Boolean);

        if (isMounted) {
          setSaved(savedIds);
        }
      } catch (error) {
        console.error("University loading error:", error);

        if (isMounted) {
          setSaveError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSaved(false);
        }
      }
    }

    loadSavedUniversities();

    return () => {
      isMounted = false;
    };
  }, []);

  const countries = useMemo(() => {
    return [
      "All",
      ...new Set(universities.map((uni) => uni.country).filter(Boolean)),
    ];
  }, []);

  const levels = useMemo(() => {
    return [
      "All",
      ...new Set(
        universities.flatMap((uni) => uni.levels || []).filter(Boolean)
      ),
    ];
  }, []);

  const subjects = useMemo(() => {
    return [
      "All",
      ...new Set(
        universities.flatMap((uni) => uni.subjects || []).filter(Boolean)
      ),
    ];
  }, []);

  const types = useMemo(() => {
    return [
      "All",
      ...new Set(universities.map((uni) => uni.type).filter(Boolean)),
    ];
  }, []);

  const filteredUniversities = useMemo(() => {
    let result = [...universities];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((uni) => {
        return (
          uni.name?.toLowerCase().includes(query) ||
          uni.location?.toLowerCase().includes(query) ||
          uni.city?.toLowerCase().includes(query) ||
          uni.country?.toLowerCase().includes(query) ||
          uni.short?.toLowerCase().includes(query) ||
          uni.shortName?.toLowerCase().includes(query)
        );
      });
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

    result.sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [search, country, level, subject, type, sort, showSaved, saved]);

  // SAVE OR REMOVE A UNIVERSITY FROM THE USER'S ACCOUNT
  async function toggleSaved(university) {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    if (savingId) return;

    setSaveError("");

    const wasSaved = saved.includes(university.id);

    const updatedSaved = wasSaved
      ? saved.filter((id) => id !== university.id)
      : [...saved, university.id];

    const previousSaved = saved;

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

  function toggleCompare(id) {
    setCompare((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      if (previous.length >= 3) {
        return previous;
      }

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

  const savedUniversities = universities.filter((uni) =>
    saved.includes(uni.id)
  );

  const comparedUniversities = universities.filter((uni) =>
    compare.includes(uni.id)
  );

  return (
    <main className="min-h-screen bg-[#101116] text-[#f1f0eb]">
      {/* PAGE HEADER */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 text-sm text-[#a4a4b0] transition hover:text-[#f8d943]"
            >
              ← Back to Dashboard
            </Link>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f8d943]">
              Discover · University Explorer
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Find your <span className="text-[#f8d943]">next chapter.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#a4a4b0] sm:text-base">
              Explore universities, discover academic opportunities, and
              shortlist the places that match your future goals.
            </p>
          </div>

          <button
            onClick={() => setShowSaved((previous) => !previous)}
            className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
              showSaved
                ? "border-[#f8d943] bg-[#f8d943] text-[#101116]"
                : "border-[#34343e] text-[#f1f0eb] hover:border-[#f8d943]"
            }`}
          >
            ♡ {showSaved ? "Show all universities" : `Saved (${saved.length})`}
          </button>
        </div>

        {saveError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {saveError}
          </div>
        )}

        {!isAuthenticated && !isLoadingSaved && (
          <div className="mb-6 rounded-xl border border-[#7770ff]/30 bg-[#7770ff]/10 px-4 py-3 text-sm text-[#c5c2ff]">
            Sign in to save universities to your personal dashboard.
          </div>
        )}

        {/* SEARCH */}
        <div className="rounded-2xl border border-[#292a33] bg-[#17181f] p-5">
          <label className="mb-3 block text-sm font-medium text-[#c7c6ce]">
            Search universities
          </label>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by university, city, or country..."
              className="w-full rounded-xl border border-[#34343e] bg-[#101116] px-5 py-4 text-sm text-white outline-none transition placeholder:text-[#666673] focus:border-[#7770ff]"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#7770ff]">
              ⌕
            </span>
          </div>

          {/* FILTERS */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="rounded-xl border border-[#34343e] bg-[#101116] px-4 py-3 text-sm text-[#f1f0eb] outline-none focus:border-[#7770ff]"
            >
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All countries" : item}
                </option>
              ))}
            </select>

            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="rounded-xl border border-[#34343e] bg-[#101116] px-4 py-3 text-sm text-[#f1f0eb] outline-none focus:border-[#7770ff]"
            >
              {levels.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All study levels" : item}
                </option>
              ))}
            </select>

            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="rounded-xl border border-[#34343e] bg-[#101116] px-4 py-3 text-sm text-[#f1f0eb] outline-none focus:border-[#7770ff]"
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All subjects" : item}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="rounded-xl border border-[#34343e] bg-[#101116] px-4 py-3 text-sm text-[#f1f0eb] outline-none focus:border-[#7770ff]"
            >
              {types.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All university types" : item}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-[#34343e] bg-[#101116] px-4 py-3 text-sm text-[#f1f0eb] outline-none focus:border-[#7770ff]"
            >
              <option value="az">Name: A–Z</option>
              <option value="za">Name: Z–A</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#858592]">
              Showing {filteredUniversities.length} universities
            </p>

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-[#f8d943] transition hover:text-white"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </section>

      {/* UNIVERSITY GRID */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        {isLoadingSaved ? (
          <div className="py-20 text-center text-sm text-[#858592]">
            Loading your saved universities...
          </div>
        ) : filteredUniversities.length === 0 ? (
          <div className="rounded-2xl border border-[#292a33] bg-[#17181f] px-6 py-16 text-center">
            <div className="mb-4 text-4xl">⌕</div>
            <h2 className="text-xl font-semibold">No universities found</h2>
            <p className="mt-2 text-sm text-[#858592]">
              Try changing your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-[#f8d943] px-5 py-3 text-sm font-semibold text-[#101116]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredUniversities.map((uni) => {
              const isSaved = saved.includes(uni.id);
              const isCompared = compare.includes(uni.id);

              return (
                <article
                  key={uni.id}
                  className="group overflow-hidden rounded-2xl border border-[#292a33] bg-[#17181f] transition duration-300 hover:-translate-y-1 hover:border-[#7770ff]/60"
                >
                  <div
                    className="flex h-32 items-center justify-center"
                    style={{
                      background:
                        uni.color ||
                        "linear-gradient(135deg, #29264a, #191a27)",
                    }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-black/20 text-2xl font-bold text-white">
                      {uni.shortName || uni.short || uni.name?.charAt(0)}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold leading-snug">
                          {uni.name}
                        </h2>
                        <p className="mt-2 text-xs text-[#9999a6]">
                          {uni.location || uni.city}
                          {uni.country ? `, ${uni.country}` : ""}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleSaved(uni)}
                        disabled={savingId === uni.id || isLoadingSaved}
                        aria-label={
                          isSaved
                            ? "Remove saved university"
                            : "Save university"
                        }
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isSaved
                            ? "border-[#f8d943] bg-[#f8d943] text-[#101116]"
                            : "border-[#34343e] text-[#a4a4b0] hover:border-[#f8d943] hover:text-[#f8d943]"
                        }`}
                      >
                        {savingId === uni.id ? "…" : isSaved ? "♥" : "♡"}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {uni.type && (
                        <span className="rounded-full bg-[#7770ff]/10 px-3 py-1 text-[11px] text-[#aaa5ff]">
                          {uni.type}
                        </span>
                      )}

                      {(uni.levels || []).slice(0, 2).map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[#292a33] px-3 py-1 text-[11px] text-[#b7b6c0]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(uni.subjects || []).slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="text-[11px] text-[#858592]"
                        >
                          #{item}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => setSelected(uni)}
                        className="flex-1 rounded-xl bg-[#7770ff] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#6860ec]"
                      >
                        Explore university
                      </button>

                      <button
                        onClick={() => toggleCompare(uni.id)}
                        className={`rounded-xl border px-4 py-3 text-xs font-semibold transition ${
                          isCompared
                            ? "border-[#f8d943] text-[#f8d943]"
                            : "border-[#34343e] text-[#a4a4b0] hover:border-[#f8d943]"
                        }`}
                      >
                        {isCompared ? "Added" : "Compare"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* COMPARE BAR */}
      {compare.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-2xl border border-[#44415f] bg-[#1b1b27] p-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">
                Compare universities ({compare.length}/3)
              </p>
              <p className="mt-1 text-xs text-[#9999a6]">
                {comparedUniversities.map((uni) => uni.shortName || uni.name).join(" · ")}
              </p>
            </div>

            <button
              onClick={() => setCompare([])}
              className="rounded-full border border-[#555568] px-4 py-2 text-xs text-[#c7c6ce] transition hover:border-[#f8d943] hover:text-[#f8d943]"
            >
              Clear comparison
            </button>
          </div>
        </div>
      )}

      {/* UNIVERSITY DETAILS MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#34343e] bg-[#17181f] p-6 sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f8d943]">
                  University details
                </p>
                <h2 className="mt-3 text-2xl font-bold">{selected.name}</h2>
                <p className="mt-2 text-sm text-[#9999a6]">
                  {selected.location || selected.city}
                  {selected.country ? `, ${selected.country}` : ""}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-[#34343e] px-3 py-2 text-sm text-[#a4a4b0] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#101116] p-4">
                <p className="text-xs text-[#858592]">University type</p>
                <p className="mt-2 text-sm font-semibold">
                  {selected.type || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl bg-[#101116] p-4">
                <p className="text-xs text-[#858592]">Location</p>
                <p className="mt-2 text-sm font-semibold">
                  {selected.location || selected.city || "Not specified"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Available study levels</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selected.levels || []).length > 0 ? (
                  selected.levels.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#7770ff]/10 px-3 py-2 text-xs text-[#aaa5ff]"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#858592]">Not specified</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Subjects</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selected.subjects || []).length > 0 ? (
                  selected.subjects.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#292a33] px-3 py-2 text-xs text-[#c7c6ce]"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-[#858592]">Not specified</p>
                )}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => toggleSaved(selected)}
                disabled={savingId === selected.id}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                  saved.includes(selected.id)
                    ? "border border-[#f8d943] bg-transparent text-[#f8d943]"
                    : "bg-[#f8d943] text-[#101116]"
                }`}
              >
                {saved.includes(selected.id)
                  ? "♥ Saved"
                  : "♡ Save university"}
              </button>

              <button
                onClick={() => toggleCompare(selected.id)}
                className="rounded-xl border border-[#34343e] px-5 py-3 text-sm font-semibold text-[#c7c6ce] transition hover:border-[#7770ff]"
              >
                {compare.includes(selected.id)
                  ? "Remove from comparison"
                  : "Add to comparison"}
              </button>
            </div>

            <div className="mt-7 border-t border-[#292a33] pt-5">
              <h3 className="text-sm font-semibold">Related career paths</h3>
              <div className="mt-3">
                {getCareersForUniversity(selected).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {getCareersForUniversity(selected).map((career) => (
                      <span
                        key={career}
                        className="rounded-full bg-[#7770ff]/10 px-3 py-2 text-xs text-[#aaa5ff]"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#858592]">
                    Explore the Career Explorer to discover related paths.
                  </p>
                )}

                <Link
                  href="/careers"
                  className="mt-4 inline-flex text-xs font-semibold text-[#f8d943] hover:text-white"
                >
                  Explore Career Explorer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}