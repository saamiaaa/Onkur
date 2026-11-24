
"use client";

import DevelopHero from "./DevelopHero";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const learningPaths = [
  {
    id: "software",
    title: "Software Developer",
    category: "Technology",
    icon: "💻",
    description: "Build applications, websites and software solutions.",
    skills: ["Programming fundamentals", "JavaScript", "Data structures", "React", "Git & GitHub", "Backend development"],
    subjects: ["Computer Science", "Software Engineering", "Information Technology"],
    projects: [
      { name: "Personal portfolio website", level: "Beginner", time: "1 week" },
      { name: "Task management application", level: "Intermediate", time: "2 weeks" },
      { name: "Full-stack student platform", level: "Advanced", time: "4 weeks" },
    ],
  },
  {
    id: "data",
    title: "Data Analyst",
    category: "Data & Analytics",
    icon: "📊",
    description: "Turn data into useful insights and informed decisions.",
    skills: ["Excel & spreadsheets", "SQL fundamentals", "Python", "Data visualization", "Statistics", "Data storytelling"],
    subjects: ["Computer Science", "Statistics", "Mathematics", "Business"],
    projects: [
      { name: "Personal expense analysis", level: "Beginner", time: "1 week" },
      { name: "Sales data dashboard", level: "Intermediate", time: "2 weeks" },
      { name: "Exploratory data analysis project", level: "Advanced", time: "3 weeks" },
    ],
  },
  {
    id: "ai",
    title: "AI / ML Engineer",
    category: "Artificial Intelligence",
    icon: "🤖",
    description: "Create intelligent systems that learn from data.",
    skills: ["Python programming", "Mathematics for ML", "Data preprocessing", "Machine learning", "Model evaluation", "Deployment basics"],
    subjects: ["Computer Science", "Artificial Intelligence", "Mathematics", "Statistics"],
    projects: [
      { name: "Student performance predictor", level: "Beginner", time: "1 week" },
      { name: "Image classification model", level: "Intermediate", time: "2 weeks" },
      { name: "End-to-end prediction system", level: "Advanced", time: "4 weeks" },
    ],
  },
  {
    id: "design",
    title: "UI/UX Designer",
    category: "Creative Technology",
    icon: "🎨",
    description: "Design useful, accessible and engaging digital experiences.",
    skills: ["Design principles", "User research", "Wireframing", "Figma", "Prototyping", "Usability testing"],
    subjects: ["Computer Science", "Graphic Design", "Human-Computer Interaction", "Digital Media"],
    projects: [
      { name: "Redesign a mobile app screen", level: "Beginner", time: "3 days" },
      { name: "Student app prototype", level: "Intermediate", time: "2 weeks" },
      { name: "Complete UX case study", level: "Advanced", time: "3 weeks" },
    ],
  },
];

const stages = [
  { id: "foundation", title: "Build foundations", subtitle: "Understand the essentials", number: "01" },
  { id: "practice", title: "Learn by doing", subtitle: "Apply your knowledge", number: "02" },
  { id: "projects", title: "Build projects", subtitle: "Create practical work", number: "03" },
  { id: "portfolio", title: "Show your skills", subtitle: "Prepare your portfolio", number: "04" },
];

const defaultPathProgress = {
  completedSkills: [],
  completedProjects: [],
  activeStage: "foundation",
};

export default function DevelopPage() {
  const router = useRouter();

  const [selectedPath, setSelectedPath] = useState("software");
  const [completedSkills, setCompletedSkills] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [activeStage, setActiveStage] = useState("foundation");

  const [progressByPath, setProgressByPath] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [saveError, setSaveError] = useState("");

  const path = learningPaths.find((item) => item.id === selectedPath) || learningPaths[0];

  const totalTasks = path.skills.length + path.projects.length;
  const completedTasks = completedSkills.length + completedProjects.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  // Load the logged-in user's development progress.
  useEffect(() => {
    let isMounted = true;

    async function loadDevelopmentProgress() {
      try {
        const authResponse = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        if (!authResponse.ok) {
          if (isMounted) {
            setIsAuthenticated(false);
          }
          return;
        }

        const dashboardResponse = await fetch(`${API_URL}/dashboard`, {
          credentials: "include",
        });

        if (!dashboardResponse.ok) {
          throw new Error("Unable to load your learning progress.");
        }

        const dashboardData = await dashboardResponse.json();
        const savedDevelopment = dashboardData.dashboard?.development || {};
        const savedPaths = savedDevelopment.paths || {};

        const savedPath = learningPaths.some(
          (item) => item.id === savedDevelopment.selectedPath
        )
          ? savedDevelopment.selectedPath
          : "software";

        const savedPathProgress =
          savedPaths[savedPath] || defaultPathProgress;

        const validStage = stages.some(
          (stage) => stage.id === savedPathProgress.activeStage
        )
          ? savedPathProgress.activeStage
          : "foundation";

        if (isMounted) {
          setIsAuthenticated(true);
          setProgressByPath(savedPaths);
          setSelectedPath(savedPath);
          setCompletedSkills(savedPathProgress.completedSkills || []);
          setCompletedProjects(savedPathProgress.completedProjects || []);
          setActiveStage(validStage);
        }
      } catch (error) {
        if (isMounted) {
          setSaveError(error.message || "Unable to load your learning progress.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingProgress(false);
        }
      }
    }

    loadDevelopmentProgress();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save development progress to the logged-in user's dashboard.
  async function saveDevelopmentData(nextSelectedPath, nextPaths) {
    if (!isAuthenticated) {
      router.push("/login");
      return false;
    }

    try {
      setSaveError("");

      const response = await fetch(`${API_URL}/dashboard`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          development: {
            selectedPath: nextSelectedPath,
            paths: nextPaths,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save your learning progress.");
      }

      return true;
    } catch (error) {
      setSaveError(error.message || "Unable to save your learning progress.");
      return false;
    }
  }

  function changePath(id) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const nextPaths = {
      ...progressByPath,
      [selectedPath]: {
        completedSkills,
        completedProjects,
        activeStage,
      },
    };

    const nextProgress = nextPaths[id] || defaultPathProgress;

    const validStage = stages.some(
      (stage) => stage.id === nextProgress.activeStage
    )
      ? nextProgress.activeStage
      : "foundation";

    setProgressByPath(nextPaths);
    setSelectedPath(id);
    setCompletedSkills(nextProgress.completedSkills || []);
    setCompletedProjects(nextProgress.completedProjects || []);
    setActiveStage(validStage);

    saveDevelopmentData(id, nextPaths);
  }

  function toggleSkill(skill) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const nextSkills = completedSkills.includes(skill)
      ? completedSkills.filter((item) => item !== skill)
      : [...completedSkills, skill];

    const nextPaths = {
      ...progressByPath,
      [selectedPath]: {
        completedSkills: nextSkills,
        completedProjects,
        activeStage,
      },
    };

    setCompletedSkills(nextSkills);
    setProgressByPath(nextPaths);
    saveDevelopmentData(selectedPath, nextPaths);
  }

  function toggleProject(project) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const nextProjects = completedProjects.includes(project)
      ? completedProjects.filter((item) => item !== project)
      : [...completedProjects, project];

    const nextPaths = {
      ...progressByPath,
      [selectedPath]: {
        completedSkills,
        completedProjects: nextProjects,
        activeStage,
      },
    };

    setCompletedProjects(nextProjects);
    setProgressByPath(nextPaths);
    saveDevelopmentData(selectedPath, nextPaths);
  }

  function changeStage(stageId) {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const nextPaths = {
      ...progressByPath,
      [selectedPath]: {
        completedSkills,
        completedProjects,
        activeStage: stageId,
      },
    };

    setActiveStage(stageId);
    setProgressByPath(nextPaths);
    saveDevelopmentData(selectedPath, nextPaths);
  }

  const currentStageIndex = stages.findIndex(
    (stage) => stage.id === activeStage
  );

  const currentStage =
    stages.find((stage) => stage.id === activeStage) || stages[0];

  return (
    <main className="develop-page">
      <div className="site-background" />

      {saveError && (
        <div
          className="container"
          role="alert"
          style={{ color: "#ff8f8f", paddingTop: 12 }}
        >
          {saveError}
        </div>
      )}

      <header className="container navbar develop-navbar">
        <Link href="/" className="logo">
          onkur<span>.</span>
        </Link>

        <nav className="nav-links">
          <Link href="/universities">Universities</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/develop" className="active-nav">Develop</Link>
          <Link href="/connect">Connect</Link>
        </nav>

        <div className="nav-actions">
            <Link href="/dashboard" className="login-link">
             My Dashboard
           </Link>
        </div>
      </header>

      <DevelopHero />

      {isLoadingProgress && (
        <div
          className="container"
          style={{ paddingTop: 12, color: "var(--foreground)" }}
        >
          Loading your saved learning progress...
        </div>
      )}

      <section className="container develop-overview">
        <div className="develop-overview-heading">
          <div>
            <div className="eyebrow">YOUR DEVELOPMENT SPACE</div>
            <h2>A little progress goes a long way<span>.</span></h2>
            <p>
              Choose a direction and start building your own learning journey.
            </p>
          </div>
          <div className="develop-overview-tag">PERSONAL LEARNING SPACE</div>
        </div>

        <div className="develop-overview-grid">
          <article className="develop-overview-card">
            <span className="overview-card-icon">🧭</span>
            <div>
              <strong>Discover</strong>
              <p>Find a direction that interests you.</p>
            </div>
            <Link href="/careers">Explore careers ↗</Link>
          </article>

          <article className="develop-overview-card">
            <span className="overview-card-icon">🎓</span>
            <div>
              <strong>Learn</strong>
              <p>Connect skills with academic subjects.</p>
            </div>
            <Link href="/universities">Explore universities ↗</Link>
          </article>

          <article className="develop-overview-card">
            <span className="overview-card-icon">🌱</span>
            <div>
              <strong>Grow</strong>
              <p>Track your learning and build projects.</p>
            </div>
            <a href="#my-roadmap">View roadmap ↓</a>
          </article>
        </div>
      </section>

      <section className="container develop-path-section" id="learning-paths">
        <div className="develop-section-heading">
          <div>
            <div className="eyebrow">START WITH A DIRECTION</div>
            <h2>Choose your learning path<span>.</span></h2>
            <p>
              Select a career direction to see its suggested skills and projects.
            </p>
          </div>
          <Link href="/careers" className="text-link">
            Browse all careers ↗
          </Link>
        </div>

        <div className="develop-path-grid">
          {learningPaths.map((item) => (
            <button
              key={item.id}
              className={`develop-path-card ${
                selectedPath === item.id ? "path-selected" : ""
              }`}
              onClick={() => changePath(item.id)}
              aria-pressed={selectedPath === item.id}
              disabled={isLoadingProgress}
            >
              <div className="develop-path-card-top">
                <span className="develop-path-icon">{item.icon}</span>
                {selectedPath === item.id && (
                  <span className="path-check">✓</span>
                )}
              </div>
              <span className="develop-path-category">{item.category}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <span className="path-card-action">
                {selectedPath === item.id
                  ? "Selected path ✓"
                  : "Choose this path →"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="container roadmap-section" id="my-roadmap">
        <div className="roadmap-main">
          <div className="roadmap-heading">
            <div>
              <div className="eyebrow">YOUR LEARNING ROADMAP</div>
              <h2>{path.title}<span>.</span></h2>
              <p>{path.description}</p>
            </div>
            <span className="roadmap-path-icon">{path.icon}</span>
          </div>

          <div className="roadmap-progress-card">
            <div className="roadmap-progress-top">
              <div>
                <span>YOUR PROGRESS</span>
                <strong>{progress}%</strong>
              </div>
              <span>{completedTasks} of {totalTasks} completed</span>
            </div>
            <div className="roadmap-progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>
            <p>
              {progress === 100
                ? "Amazing work! You have completed this starter roadmap."
                : progress === 0
                ? "Your journey starts with one small step. Pick a skill below."
                : "Keep going. Every completed task brings you closer to your goal."}
            </p>
          </div>

          <div className="roadmap-stages">
            {stages.map((stage) => (
              <button
                key={stage.id}
                className={`roadmap-stage ${
                  activeStage === stage.id ? "stage-active" : ""
                }`}
                onClick={() => changeStage(stage.id)}
                disabled={isLoadingProgress}
              >
                <span className="stage-number">{stage.number}</span>
                <span className="stage-copy">
                  <strong>{stage.title}</strong>
                  <small>{stage.subtitle}</small>
                </span>
                <span className="stage-arrow">↗</span>
              </button>
            ))}
          </div>

          <div className="roadmap-stage-detail">
            <div className="roadmap-stage-detail-heading">
              <div>
                <span>STAGE {currentStageIndex + 1} OF 4</span>
                <h3>{currentStage.title}</h3>
              </div>
              <span>✦</span>
            </div>

            {activeStage === "projects" ? (
              <div className="roadmap-task-list">
                {path.projects.map((project) => (
                  <label className="roadmap-task" key={project.name}>
                    <input
                      type="checkbox"
                      checked={completedProjects.includes(project.name)}
                      onChange={() => toggleProject(project.name)}
                      disabled={isLoadingProgress}
                    />
                    <span className="task-checkmark" />
                    <span className="task-copy">
                      <strong>{project.name}</strong>
                      <small>{project.level} · {project.time}</small>
                    </span>
                  </label>
                ))}
              </div>
            ) : activeStage === "portfolio" ? (
              <div className="portfolio-stage-note">
                <span>✨</span>
                <div>
                  <strong>Make your work visible.</strong>
                  <p>
                    Collect your projects, document what you learned and
                    prepare a portfolio that shows your progress.
                  </p>
                  <Link href="/connect">
                    Discover the Onkur community ↗
                  </Link>
                </div>
              </div>
            ) : (
              <div className="roadmap-task-list">
                {path.skills
                  .slice(0, activeStage === "foundation" ? 3 : 6)
                  .map((skill, index) => (
                    <label className="roadmap-task" key={skill}>
                      <input
                        type="checkbox"
                        checked={completedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        disabled={isLoadingProgress}
                      />
                      <span className="task-checkmark" />
                      <span className="task-copy">
                        <strong>{skill}</strong>
                        <small>
                          {activeStage === "foundation"
                            ? "Foundation skill"
                            : index < 3
                            ? "Practice the basics"
                            : "Build on your knowledge"}
                        </small>
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>

        <aside className="roadmap-sidebar">
          <div className="roadmap-side-card">
            <div className="eyebrow">RELATED ACADEMICS</div>
            <h3>What could you study?</h3>
            <p>
              Explore academic subjects connected to this learning path.
            </p>
            <div className="related-subject-list">
              {path.subjects.map((subject) => (
                <div key={subject}>
                  <span>◈</span>{subject}
                </div>
              ))}
            </div>
            <Link href="/universities" className="sidebar-link">
              Find universities ↗
            </Link>
          </div>

          <div className="roadmap-side-card career-side-card">
            <div className="eyebrow">CAREER CONNECTION</div>
            <h3>Explore your destination.</h3>
            <p>
              Understand the roles, responsibilities and opportunities
              related to your chosen direction.
            </p>
            <Link href="/careers" className="sidebar-link">
              Explore career paths ↗
            </Link>
          </div>

          <div className="roadmap-tip-card">
            <span>💡</span>
            <strong>A small reminder</strong>
            <p>
              You don't need to learn everything at once. Focus on one skill,
              practise it and keep building.
            </p>
          </div>
        </aside>
      </section>

      <section className="container develop-project-section">
        <div className="develop-section-heading">
          <div>
            <div className="eyebrow">LEARN BY BUILDING</div>
            <h2>Turn knowledge into projects<span>.</span></h2>
            <p>Practical ideas to help you apply what you learn.</p>
          </div>
        </div>

        <div className="develop-project-grid">
          {path.projects.map((project, index) => (
            <article className="develop-project-card" key={project.name}>
              <div className="project-card-top">
                <span>PROJECT 0{index + 1}</span>
                <span>{project.level}</span>
              </div>
              <div className="project-illustration">
                {["✎", "⌘", "✧"][index]}
              </div>
              <h3>{project.name}</h3>
              <p>
                A practical project idea for your {path.title.toLowerCase()}
                learning journey.
              </p>
              <div className="project-card-bottom">
                <span>◷ {project.time}</span>
                <button
                  onClick={() => toggleProject(project.name)}
                  className={
                    completedProjects.includes(project.name)
                      ? "project-done"
                      : ""
                  }
                  disabled={isLoadingProgress}
                >
                  {completedProjects.includes(project.name)
                    ? "Completed ✓"
                    : "Mark complete +"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container develop-bottom-cta">
        <div>
          <div className="eyebrow">YOUR FUTURE IS A WORK IN PROGRESS</div>
          <h2>
            Discover. Learn. Build.
            <br />
            <span>Become.</span>
          </h2>
          <p>
            Keep exploring your options and take the next step at your own pace.
          </p>
        </div>
        <div className="develop-cta-actions">
          <Link href="/universities" className="secondary-button">
            Explore universities ↗
          </Link>
          <Link href="/careers" className="primary-button">
            Explore careers ↗
          </Link>
        </div>
      </section>

      <footer className="container footer develop-footer">
        <div>
          <Link href="/" className="logo">
            onkur<span>.</span>
          </Link>
          <p style={{ marginTop: 12 }}>
            Find your direction. Build your future.
          </p>
          <p style={{ marginTop: 8 }}>
            © 2026 Onkur. All rights reserved.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/universities">Universities</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/develop">Develop</Link>
        </div>
      </footer>
    </main>
  );
}
