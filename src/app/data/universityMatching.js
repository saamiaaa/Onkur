
const subjectAliases = {
  "computer science": [
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

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toArray(value) {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  return [value];
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

// Convert a student's profile information into relevant academic subjects.
function getStudentSubjects(profile) {
  const degree = getText(profile.degree);
  const interests = toArray(profile.interests).map(getText);
  const skills = toArray(profile.skills).map(getText);
  const careerInterests = toArray(profile.careerInterests).map(getText);

  const development = profile.development || {};
  const developmentPaths = toArray(development.paths);

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
      values: developmentPaths.map((path) =>
        typeof path === "object"
          ? path.name || path.title || path.label || ""
          : path
      ),
      weight: 1,
    },
  ];

  return signals
    .map((signal) => ({
      ...signal,
      subjects: signal.values.flatMap((value) => {
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
      }),
    }))
    .filter((signal) => signal.subjects.length > 0);
}

// Calculate how relevant a university is to the student's profile.
export function getUniversityMatches(universities, profile) {
  if (!Array.isArray(universities) || !profile) return [];

  const studentSignals = getStudentSubjects(profile);

  if (studentSignals.length === 0) return [];

  const totalWeight = studentSignals.reduce(
    (total, signal) => total + signal.weight,
    0
  );

  return universities
    .map((university) => {
      const universitySubjects = (university.subjects || []).map(
        normalize
      );

      let earnedWeight = 0;
      const reasons = [];
      const matchedSubjects = new Set();

      studentSignals.forEach((signal) => {
        const matches = signal.subjects.filter((subject) =>
          universitySubjects.includes(normalize(subject))
        );

        if (matches.length > 0) {
          earnedWeight += signal.weight;

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
          } else {
            reasons.push(
              `Relevant to your skills and development in ${matches.join(", ")}.`
            );
          }
        }
      });

      const matchScore =
        totalWeight > 0
          ? Math.round((earnedWeight / totalWeight) * 100)
          : 0;

      return {
        ...university,
        matchScore,
        matchReasons: reasons,
        matchedSubjects: [...matchedSubjects],
      };
    })
    .filter((university) => university.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
