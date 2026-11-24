
const subjectAliases = {
  "Computer Science": [
    "computer science",
    "cse",
    "cs",
    "software engineering",
    "programming",
    "web development",
    "app development",
    "artificial intelligence",
    "machine learning",
    "data science",
    "cybersecurity",
    "robotics",
    "ui ux",
    "ui/ux",
    "technology",
  ],

  Engineering: [
    "engineering",
    "electrical engineering",
    "eee",
    "mechanical engineering",
    "civil engineering",
    "electronics",
    "robotics",
  ],

  Business: [
    "business",
    "business administration",
    "bba",
    "management",
    "entrepreneurship",
    "marketing",
    "finance",
    "economics",
  ],

  Science: [
    "science",
    "physics",
    "chemistry",
    "mathematics",
    "biology",
    "research",
  ],

  Arts: [
    "arts",
    "humanities",
    "literature",
    "creative writing",
    "english",
    "history",
    "design",
    "communication",
  ],

  Health: [
    "health",
    "healthcare",
    "medicine",
    "medical",
    "public health",
    "pharmacy",
    "biology",
  ],

  "Environmental Science": [
    "environment",
    "environmental science",
    "sustainability",
    "climate",
  ],

  Architecture: [
    "architecture",
    "architectural design",
    "urban planning",
  ],
};

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toArray(value) {
  if (!value) return [];

  return Array.isArray(value) ? value : [value];
}

function getText(value) {
  if (typeof value === "string") return value;

  if (typeof value === "object" && value !== null) {
    return (
      value.name ||
      value.title ||
      value.label ||
      value.value ||
      ""
    );
  }

  return "";
}

function getFirstValue(profile, keys) {
  for (const key of keys) {
    const value = profile?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function getStudentSubjects(profile) {
  const degree = getText(profile.degree);

  const interests = toArray(profile.interests).map(getText);
  const skills = toArray(profile.skills).map(getText);

  const careerInterests = toArray(
    profile.careerInterests
  ).map(getText);

  const development = profile.development || {};
  const developmentPaths = toArray(development.paths).map(getText);

  const signals = [
    {
      label: "Degree",
      values: degree ? [degree] : [],
      weight: 4,
    },
    {
      label: "Interests",
      values: interests,
      weight: 3,
    },
    {
      label: "Career interests",
      values: careerInterests,
      weight: 2,
    },
    {
      label: "Skills",
      values: skills,
      weight: 1,
    },
    {
      label: "Development",
      values: developmentPaths,
      weight: 1,
    },
  ];

  return signals
    .map((signal) => ({
      ...signal,

      subjects: [
        ...new Set(
          signal.values.flatMap((value) => {
            const normalized = normalize(value);

            if (!normalized) return [];

            return Object.entries(subjectAliases)
              .filter(([subject, aliases]) => {
                const normalizedSubject = normalize(subject);

                return (
                  normalized === normalizedSubject ||
                  aliases.some((alias) => {
                    const normalizedAlias = normalize(alias);

                    return (
                      normalized === normalizedAlias ||
                      normalized.includes(normalizedAlias) ||
                      normalizedAlias.includes(normalized)
                    );
                  })
                );
              })
              .map(([subject]) => subject);
          })
        ),
      ],
    }))
    .filter((signal) => signal.subjects.length > 0);
}

// --------------------------------------------------
// COUNTRY PREFERENCE
// --------------------------------------------------

function getCountryPreferences(profile) {
  const preference = getFirstValue(profile, [
    "preferredCountry",
    "preferredCountries",
    "targetCountries",
    "countriesOfInterest",
  ]);

  return toArray(preference)
    .map(getText)
    .map(normalize)
    .filter(Boolean);
}

function calculateCountryMatch(university, profile) {
  const preferredCountries = getCountryPreferences(profile);

  if (preferredCountries.length === 0) {
    return null;
  }

  const universityCountry = normalize(university.country);

  const matched = preferredCountries.some(
    (country) => country === universityCountry
  );

  return {
    score: matched ? 100 : 0,
    matched,
    message: matched
      ? `Located in your preferred country: ${university.country}.`
      : `Located in ${university.country}, which is outside your selected country preferences.`,
  };
}

// --------------------------------------------------
// STUDY LEVEL PREFERENCE
// --------------------------------------------------

function getStudyLevelPreferences(profile) {
  let preference = getFirstValue(profile, [
    "preferredStudyLevel",
    "intendedStudyLevel",
    "studyLevelPreference",
    "targetStudyLevel",
    "desiredLevel",
  ]);

  // A high-school student looking for recommendations
  // is generally exploring undergraduate programmes.
  if (!preference && profile.educationLevel === "high_school") {
    preference = "Undergraduate";
  }

  return toArray(preference)
    .map(getText)
    .map(normalize)
    .filter(Boolean);
}

function calculateStudyLevelMatch(university, profile) {
  const preferredLevels = getStudyLevelPreferences(profile);

  if (preferredLevels.length === 0) {
    return null;
  }

  const universityLevels = (university.levels || [])
    .map(getText)
    .map(normalize);

  const matched = preferredLevels.some((preferred) =>
    universityLevels.includes(preferred)
  );

  return {
    score: matched ? 100 : 0,
    matched,
    message: matched
      ? `Offers your preferred study level: ${preferredLevels.join(", ")}.`
      : `Your preferred study level (${preferredLevels.join(", ")}) was not found in the available university information.`,
  };
}

// --------------------------------------------------
// BUDGET AND TUITION COMPARISON
// --------------------------------------------------

function getStudentBudget(profile) {
  const budgetValue = getFirstValue(profile, [
    "budget",
    "tuitionBudget",
    "annualBudget",
    "maximumBudget",
    "maxTuition",
    "budgetAmount",
  ]);

  if (budgetValue === null) return null;

  if (typeof budgetValue === "object") {
    const amount = Number(budgetValue.amount);

    if (!Number.isFinite(amount) || amount <= 0) return null;

    return {
      amount,
      currency:
        budgetValue.currency ||
        profile.budgetCurrency ||
        profile.currency ||
        null,
      period:
        budgetValue.period ||
        profile.budgetPeriod ||
        null,
    };
  }

  const amount = Number(budgetValue);

  if (!Number.isFinite(amount) || amount <= 0) return null;

  return {
    amount,
    currency:
      profile.budgetCurrency ||
      profile.currency ||
      null,
    period:
      profile.budgetPeriod ||
      null,
  };
}

function calculateBudgetMatch(university, profile) {
  const studentBudget = getStudentBudget(profile);

  if (!studentBudget) return null;

  const universityBudget = university.budget;

  if (
    !universityBudget ||
    universityBudget.amount === null ||
    universityBudget.amount === undefined
  ) {
    return {
      score: null,
      comparable: false,
      warning: "Tuition amount is not available for a reliable budget comparison.",
    };
  }

  const universityAmount = Number(universityBudget.amount);

  if (!Number.isFinite(universityAmount) || universityAmount <= 0) {
    return {
      score: null,
      comparable: false,
      warning: "The published tuition amount cannot be compared reliably.",
    };
  }

  const studentCurrency = normalize(studentBudget.currency);
  const universityCurrency = normalize(universityBudget.currency);

  if (
    !studentCurrency ||
    !universityCurrency ||
    studentCurrency !== universityCurrency
  ) {
    return {
      score: null,
      comparable: false,
      warning: "Budget comparison requires the same currency. Currency conversion has not been applied.",
    };
  }

  const studentPeriod = normalize(studentBudget.period);
  const universityPeriod = normalize(universityBudget.period);

  if (
    !studentPeriod ||
    !universityPeriod ||
    studentPeriod !== universityPeriod
  ) {
    return {
      score: null,
      comparable: false,
      warning: `Your budget period must match the university's tuition period (${universityBudget.period}) for a reliable comparison.`,
    };
  }

  const affordable = universityAmount <= studentBudget.amount;

  return {
    score: affordable ? 100 : 0,
    comparable: true,
    affordable,
    message: affordable
      ? "The published tuition amount is within your stated budget."
      : "The published tuition amount exceeds your stated budget.",
  };
}

// --------------------------------------------------
// SCHOLARSHIP PREFERENCE
// --------------------------------------------------

function wantsScholarship(profile) {
  const preference = getFirstValue(profile, [
    "scholarshipRequired",
    "needsScholarship",
    "seekingScholarship",
    "financialAidNeeded",
    "scholarshipPreference",
    "wantsScholarship",
  ]);

  if (preference === true) return true;

  if (typeof preference === "string") {
    return [
      "yes",
      "true",
      "required",
      "needed",
      "interested",
    ].includes(normalize(preference));
  }

  return false;
}

function calculateScholarshipMatch(university, profile) {
  if (!wantsScholarship(profile)) {
    return null;
  }

  const scholarship = university.scholarships;

  const hasScholarships =
    Boolean(scholarship?.summary) ||
    (scholarship?.opportunities?.length || 0) > 0;

  return {
    score: hasScholarships ? 100 : 0,
    matched: hasScholarships,
    message: hasScholarships
      ? "Scholarship or financial-aid opportunities are listed for this university."
      : "No confirmed scholarship opportunities are listed in the available university data.",
  };
}

// --------------------------------------------------
// MAIN UNIVERSITY MATCHING ENGINE
// --------------------------------------------------

export function getUniversityMatches(universities, profile) {
  if (!Array.isArray(universities) || !profile) return [];

  const studentSignals = getStudentSubjects(profile);

  const totalAcademicWeight = studentSignals.reduce(
    (total, signal) => total + signal.weight,
    0
  );

  const hasAcademicSignals = studentSignals.length > 0;

  const criteriaWeights = {
    academic: 60,
    country: 15,
    studyLevel: 10,
    budget: 10,
    scholarship: 5,
  };

  return universities
    .map((university) => {
      const universitySubjects = (university.subjects || [])
        .map(normalize);

      let earnedAcademicWeight = 0;

      const reasons = [];
      const warnings = [];
      const matchedSubjects = new Set();

      // ACADEMIC MATCHING
      studentSignals.forEach((signal) => {
        const matches = signal.subjects.filter((subject) =>
          universitySubjects.includes(normalize(subject))
        );

        if (matches.length > 0) {
          earnedAcademicWeight += signal.weight;

          matches.forEach((subject) => matchedSubjects.add(subject));

          if (signal.label === "Degree") {
            reasons.push(
              `Your degree background connects with ${matches.join(", ")}.`
            );
          } else if (signal.label === "Interests") {
            reasons.push(
              `Matches your interests in ${matches.join(", ")}.`
            );
          } else if (signal.label === "Career interests") {
            reasons.push(
              `Supports your career interests in ${matches.join(", ")}.`
            );
          } else if (signal.label === "Skills") {
            reasons.push(
              `Your skills are relevant to ${matches.join(", ")}.`
            );
          } else {
            reasons.push(
              `Your development goals connect with ${matches.join(", ")}.`
            );
          }
        }
      });

      const academicScore = hasAcademicSignals
        ? Math.round(
            (earnedAcademicWeight / totalAcademicWeight) * 100
          )
        : null;

      // OTHER MATCHING CRITERIA
      const countryMatch = calculateCountryMatch(
        university,
        profile
      );

      const levelMatch = calculateStudyLevelMatch(
        university,
        profile
      );

      const budgetMatch = calculateBudgetMatch(
        university,
        profile
      );

      const scholarshipMatch = calculateScholarshipMatch(
        university,
        profile
      );

      // EXPLAINABLE MATCH DETAILS
      const matchDetails = [];

      if (academicScore !== null) {
        matchDetails.push({
          category: "Academic relevance",
          score: academicScore,
          weight: criteriaWeights.academic,
        });

        if (academicScore > 0) {
          reasons.push(
            `Your overall academic profile has ${academicScore}% subject relevance.`
          );
        }
      }

      if (countryMatch) {
        matchDetails.push({
          category: "Country preference",
          score: countryMatch.score,
          weight: criteriaWeights.country,
        });

        reasons.push(countryMatch.message);
      }

      if (levelMatch) {
        matchDetails.push({
          category: "Study level",
          score: levelMatch.score,
          weight: criteriaWeights.studyLevel,
        });

        reasons.push(levelMatch.message);
      }

      if (budgetMatch) {
        if (budgetMatch.comparable) {
          matchDetails.push({
            category: "Budget compatibility",
            score: budgetMatch.score,
            weight: criteriaWeights.budget,
          });

          reasons.push(budgetMatch.message);
        } else {
          warnings.push(budgetMatch.warning);
        }
      }

      if (scholarshipMatch) {
        matchDetails.push({
          category: "Scholarship availability",
          score: scholarshipMatch.score,
          weight: criteriaWeights.scholarship,
        });

        reasons.push(scholarshipMatch.message);
      }

      // DYNAMIC WEIGHT CALCULATION
      // Criteria without user preferences or comparable data
      // are excluded instead of unfairly reducing the score.

      let totalAvailableWeight = 0;
      let earnedScore = 0;

      if (academicScore !== null) {
        totalAvailableWeight += criteriaWeights.academic;

        earnedScore +=
          academicScore * criteriaWeights.academic;
      }

      if (countryMatch) {
        totalAvailableWeight += criteriaWeights.country;

        earnedScore +=
          countryMatch.score * criteriaWeights.country;
      }

      if (levelMatch) {
        totalAvailableWeight += criteriaWeights.studyLevel;

        earnedScore +=
          levelMatch.score * criteriaWeights.studyLevel;
      }

      if (budgetMatch?.comparable) {
        totalAvailableWeight += criteriaWeights.budget;

        earnedScore +=
          budgetMatch.score * criteriaWeights.budget;
      }

      if (scholarshipMatch) {
        totalAvailableWeight += criteriaWeights.scholarship;

        earnedScore +=
          scholarshipMatch.score * criteriaWeights.scholarship;
      }

      const matchScore =
        totalAvailableWeight > 0
          ? Math.round(earnedScore / totalAvailableWeight)
          : 0;

      return {
        ...university,

        matchScore,

        academicMatchScore: academicScore,

        matchReasons: reasons,

        matchedSubjects: [...matchedSubjects],

        matchDetails,

        matchWarnings: warnings,
      };
    })
    .filter((university) => university.matchScore > 0)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }

      return (
        (b.academicMatchScore || 0) -
        (a.academicMatchScore || 0)
      );
    });
}
