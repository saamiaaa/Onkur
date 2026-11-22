const problems = [
  {
    number: "01",
    title: "Opportunities are scattered.",
    description:
      "Scholarships, internships and programs are spread across countless platforms. Finding the right ones takes time.",
  },
  {
    number: "02",
    title: "Learning without direction.",
    description:
      "You want to build skills, but figuring out what to learn next and how to get there can be overwhelming.",
  },
  {
    number: "03",
    title: "Finding your people is hard.",
    description:
      "The right mentor, supportive community or collaborator can change your journey. Finding them shouldn't be difficult.",
  },
];

const pillars = [
  {
    number: "01",
    icon: "⌕",
    title: "Discover",
    description:
      "Find scholarships, internships, programs and opportunities that match your interests and qualifications.",
    link: "Explore opportunities",
  },
  {
    number: "02",
    icon: "✳",
    title: "Develop",
    description:
      "Build meaningful skills, follow personalized learning roadmaps and track your progress.",
    link: "Build your future",
  },
  {
    number: "03",
    icon: "◎",
    title: "Connect",
    description:
      "Meet mentors, interact with fellow students and become part of a supportive community.",
    link: "Find your community",
  },
];

export default function Home() {
  return (
    <>
      <div className="site-background" />

      {/* NAVIGATION */}
      <header className="container navbar">
        <a href="#" className="logo">
          onkur<span>.</span>
        </a>

        <nav className="nav-links">
          <a href="#discover">Discover</a>
          <a href="#develop">Develop</a>
          <a href="#connect">Connect</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-actions">
          <a href="/login" className="login-link">
            Log in
          </a>
          <a href="/signup" className="primary-button">
            Get Started →
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="container hero">
          <div>
            <div className="eyebrow">A new chapter begins</div>

            <h1>
              Your potential
              <br />
              has <span>no limits.</span>
            </h1>

            <p className="hero-description">
              Discover opportunities. Build skills. Find your people.
              One platform to help you navigate your student journey
              and turn your ambitions into action.
            </p>

            <div className="hero-buttons">
              <a href="/signup" className="primary-button">
                Start your journey →
              </a>
              <a href="#discover" className="secondary-button">
                Explore Onkur ↓
              </a>
            </div>

            <p className="hero-note">
              DISCOVER &nbsp; · &nbsp; DEVELOP &nbsp; · &nbsp; CONNECT
            </p>
          </div>

          {/* PRODUCT PREVIEW */}
          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="dashboard-card">
              <div className="dashboard-top">
                <strong>onkur. / your dashboard</strong>
                <span className="dashboard-label">
                  <span className="online-dot" />
                  Your journey
                </span>
              </div>

              <p className="dashboard-label" style={{ marginTop: 22 }}>
                YOUR PERSONAL SPACE
              </p>

              <h3 className="dashboard-heading">
                Opportunities for you ✨
              </h3>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>AI & Machine Learning Internship</h4>
                  <span className="match">92% match</span>
                </div>
                <p>Technology · Internship · Skill development</p>
              </div>
