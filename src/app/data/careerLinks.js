
import { careers } from "./careers";
import universities from "./universities";

function normalizeSubject(subject) {
  const value = subject.toLowerCase().trim();

  const aliases = {
    "computer science and engineering": "computer science",
    "computer science & engineering": "computer science",
    cse: "computer science",
    "information technology": "it",
    "information technology and engineering": "it",
    "business administration": "business",
  };

  return aliases[value] || value;
}

function subjectsMatch(first, second) {
  const a = normalizeSubject(first);
  const b = normalizeSubject(second);

  if (a === b) return true;

  if (a.length < 5 || b.length < 5) return false;

  return a.includes(b) || b.includes(a);
}

export function getUniversitiesForCareer(career) {
  return universities.filter((university) =>
    career.subjects.some((careerSubject) =>
      university.subjects.some((universitySubject) =>
        subjectsMatch(careerSubject, universitySubject)
      )
    )
  );
}

export function getCareersForUniversity(university) {
  return careers.filter((career) =>
    career.subjects.some((careerSubject) =>
      university.subjects.some((universitySubject) =>
        subjectsMatch(careerSubject, universitySubject)
      )
    )
  );
}
