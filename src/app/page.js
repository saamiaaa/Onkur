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

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Python Development Program</h4>
                  <span className="match">87% match</span>
                </div>
                <p>Learning · Beginner friendly · Online</p>
              </div>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Student Research Fellowship</h4>
                  <span className="match">84% match</span>
                </div>
                <p>Research · Student program</p>
              </div>

              <div className="skill-row">
                <span className="skill">Python</span>
                <span className="skill">UI/UX</span>
                <span className="skill">Web Development</span>
              </div>
            </div>

            <div className="floating-note">
              <strong>03</strong>
              <p>Paths to explore</p>
            </div>
          </div>
        </section>

        <section className="container section" id="about">
          <div className="section-heading">
            <div className="eyebrow">Why Onkur exists</div>

            <h2>
              Being a student shouldn't mean
              <span> figuring everything out alone.</span>
            </h2>

            <p>
              Your ambitions deserve more than scattered resources,
              confusing roadmaps and missed connections.
            </p>
          </div>

          <div className="problem-grid">
            {problems.map((problem) => (
              <article className="problem-card" key={problem.number}>
                <div className="card-number">{problem.number}</div>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container section" id="discover">
          <div className="section-heading">
            <div className="eyebrow">Everything starts somewhere</div>

            <h2>
              Three pillars.
              <span> One journey.</span>
            </h2>

            <p>
              Everything you need to take your next step, brought
              together in one student-focused ecosystem.
            </p>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article
                className="pillar-card"
                key={pillar.number}
                id={pillar.title.toLowerCase()}
              >
                <div className="card-number">{pillar.number}</div>
                <div className="pillar-icon">{pillar.icon}</div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
                <a href="/signup" className="pillar-link">
                  {pillar.link} →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="container section feature-section">
          <div>
            <div className="eyebrow">Growth with direction</div>

            <div className="section-heading">
              <h2>
                Your growth,
                <span> made visible.</span>
              </h2>

              <p>
                A personalized development journey that helps you
                understand where you are, what you're learning and
                where you can go next.
              </p>
            </div>

            <ul className="feature-list">
              <li><span className="check">✦</span> Personalized skill roadmaps</li>
              <li><span className="check">✦</span> Track your learning progress</li>
              <li><span className="check">✦</span> Showcase projects and achievements</li>
              <li><span className="check">✦</span> Discover relevant mentors</li>
            </ul>
          </div>

          <div className="preview-panel">
            <p className="dashboard-label">YOUR DEVELOPMENT ROADMAP</p>
            <h3 style={{ marginTop: 10 }}>Your next steps</h3>

            <div className="progress-item">
              <div><span>Python fundamentals</span><span>100%</span></div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "100%" }} />
              </div>
            </div>

            <div className="progress-item">
              <div><span>Data analysis</span><span>70%</span></div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "70%" }} />
              </div>
            </div>

            <div className="progress-item">
              <div><span>Machine learning</span><span>35%</span></div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "35%" }} />
              </div>
            </div>

            <div className="progress-item">
              <div><span>Portfolio projects</span><span>10%</span></div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "10%" }} />
              </div>
            </div>

            <div className="skill-row">
              <span className="skill">4 learning paths</span>
              <span className="skill">Personalized plan</span>
            </div>
          </div>
        </section>

        <section className="container">
          <div className="cta-section">
            <div className="eyebrow">Your story starts here</div>

            <h2>
              Your next chapter
              <span> starts now.</span>
            </h2>

            <p>
              Don't just dream about your future.
              Start discovering, developing and connecting.
            </p>

            <a href="/signup" className="primary-button">
              Join Onkur →
            </a>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <div>
          <a href="#" className="logo">
            onkur<span>.</span>
          </a>
          <p style={{ marginTop: 12 }}>
            Discover. Develop. Connect.
          </p>
          <p style={{ marginTop: 8 }}>
            © 2026 Onkur. All rights reserved.
          </p>
        </div>

        <div className="footer-links">
          <a href="#discover">Discover</a>
          <a href="#develop">Develop</a>
          <a href="#connect">Connect</a>
          <a href="#about">About</a>
        </div>
      </footer>
    </>
  );
}