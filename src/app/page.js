import ParticleBookIntro from "./components/ParticleBookIntro";

const problems = [
  {
    number: "01",
    title: "Too many choices. No clear direction.",
    description:
      "Choosing a university, degree or career path can feel overwhelming when reliable guidance is scattered everywhere.",
  },
  {
    number: "02",
    title: "Studying abroad feels complicated.",
    description:
      "Tuition fees, scholarships, admission requirements and living costs make comparing international universities difficult.",
  },
  {
    number: "03",
    title: "Potential without a roadmap.",
    description:
      "Knowing your dream career is only the beginning. Understanding the skills and steps needed to reach it matters too.",
  },
];

const pillars = [
  {
    number: "01",
    icon: "⌕",
    title: "Discover",
    description:
      "Explore universities in Bangladesh and abroad, compare degrees, discover scholarships and find career paths aligned with your interests.",
    link: "Explore your options",
    id: "discover",
  },
  {
    number: "02",
    icon: "✳",
    title: "Develop",
    description:
      "Understand the skills your chosen path requires, follow personalized roadmaps and prepare for your academic and professional future.",
    link: "Build your future",
    id: "develop",
  },
  {
    number: "03",
    icon: "◎",
    title: "Connect",
    description:
      "Connect with mentors, university students and alumni. Share experiences, ask questions and grow with your community.",
    link: "Find your people",
    id: "connect",
  },
];

const features = [
  "Explore universities in Bangladesh and overseas",
  "Compare programs, tuition and admission requirements",
  "Discover scholarships and financial opportunities",
  "Explore careers based on your interests",
];

const comparison = [
  { label: "Location", local: "Bangladesh", abroad: "International" },
  { label: "Programs", local: "Explore degrees", abroad: "Explore degrees" },
  { label: "Costs", local: "Tuition overview", abroad: "Tuition + living costs" },
  { label: "Funding", local: "Scholarships", abroad: "Scholarships & aid" },
];

export default function Home() {
  return (
    <>
      <div className="site-background" />

      <header className="container navbar">
        <a href="#" className="logo">onkur<span>.</span></a>

        <nav className="nav-links">
          <a href="#discover">Universities</a>
          <a href="#careers">Careers</a>
          <a href="#develop">Develop</a>
          <a href="#connect">Connect</a>
        </nav>

        <div className="nav-actions">
          <a href="/login" className="login-link">Log in</a>
          <a href="/signup" className="primary-button">Get Started →</a>
        </div>
      </header>

      <main>
        <ParticleBookIntro />
        <section className="container hero">
          <div>
            <div className="eyebrow">Your future, figured out</div>

            <h1>
              Not sure where
              <br />
              your future <span>begins?</span>
            </h1>

            <p className="hero-description">
              Find the right university. Discover your career path.
              Make your next move. Explore opportunities in Bangladesh
              and abroad, all in one place.
            </p>

            <div className="hero-buttons">
              <a href="#discover" className="primary-button">
                Find your path →
              </a>
              <a href="#about" className="secondary-button">
                Explore Onkur ↓
              </a>
            </div>

            <p className="hero-note">
              UNIVERSITY &nbsp; · &nbsp; CAREER &nbsp; · &nbsp; GROWTH
            </p>
          </div>

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="dashboard-card">
              <div className="dashboard-top">
                <strong>onkur. / explore your future</strong>
                <span className="dashboard-label">Discover</span>
              </div>

              <p className="dashboard-label" style={{ marginTop: 22 }}>
                YOUR UNIVERSITY EXPLORER
              </p>

              <h3 className="dashboard-heading">
                Find your possibilities ✨
              </h3>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Computer Science & Engineering</h4>
                  <span className="match">Program</span>
                </div>
                <p>Explore universities · Compare programs</p>
              </div>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Study Abroad</h4>
                  <span className="match">Explore</span>
                </div>
                <p>Tuition · Living costs · Scholarships</p>
              </div>

              <div className="opportunity">
                <div className="opportunity-top">
                  <h4>Career Exploration</h4>
                  <span className="match">Discover</span>
                </div>
                <p>Interests · Skills · Career possibilities</p>
              </div>

              <div className="skill-row">
                <span className="skill">Bangladesh</span>
                <span className="skill">Abroad</span>
                <span className="skill">Career paths</span>
              </div>
            </div>

            <div className="floating-note">
              <strong>01</strong>
              <p>Your next chapter</p>
            </div>
          </div>
        </section>

        <section className="container section" id="about">
          <div className="section-heading">
            <div className="eyebrow">Why Onkur exists</div>
            <h2>
              Your future is too important
              <span> to figure out alone.</span>
            </h2>
            <p>
              From choosing a degree to planning a career, every
              student deserves access to clear information and
              meaningful guidance.
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

        <section className="container section">
          <div className="section-heading">
            <div className="eyebrow">One platform, three possibilities</div>
            <h2>
              Find your direction.
              <span> Build your future.</span>
            </h2>
            <p>
              From your first university search to your future career,
              Onkur helps you navigate every step.
            </p>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.number} id={pillar.id}>
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

        <section className="container section feature-section" id="discover">
          <div>
            <div className="eyebrow">Your options, side by side</div>
            <div className="section-heading">
              <h2>
                Bangladesh or
                <span> beyond?</span>
              </h2>
              <p>
                Explore academic opportunities locally and
                internationally. Compare what matters before
                making one of life's biggest decisions.
              </p>
            </div>

            <ul className="feature-list">
              {features.map((feature) => (
                <li key={feature}>
                  <span className="check">✦</span> {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="preview-panel">
            <p className="dashboard-label">UNIVERSITY EXPLORER</p>
            <h3 style={{ marginTop: 10 }}>Explore your options</h3>

            <div className="comparison-table">
              <div className="comparison-row comparison-header">
                <span>Explore</span>
                <span>Local</span>
                <span>Abroad</span>
              </div>

              {comparison.map((item) => (
                <div className="comparison-row" key={item.label}>
                  <span>{item.label}</span>
                  <span>{item.local}</span>
                  <span>{item.abroad}</span>
                </div>
              ))}
            </div>

            <p className="preview-caption">
              Compare academic pathways and explore what suits your goals.
            </p>
          </div>
        </section>

        <section className="container section" id="careers">
          <div className="section-heading">
            <div className="eyebrow">Beyond choosing a degree</div>
            <h2>
              Don't just choose what to study.
              <span> Discover why.</span>
            </h2>
            <p>
              Explore career possibilities, understand the skills
              different professions require and connect your
              academic choices with long-term ambitions.
            </p>
          </div>

          <div className="pillar-grid">
            <article className="pillar-card">
              <div className="pillar-icon">⌘</div>
              <h3>Explore careers</h3>
              <p>Discover career paths based on your interests, strengths and academic preferences.</p>
            </article>

            <article className="pillar-card">
              <div className="pillar-icon">✳</div>
              <h3>Understand skills</h3>
              <p>Learn about the technical and professional skills different careers demand.</p>
            </article>

            <article className="pillar-card">
              <div className="pillar-icon">↗</div>
              <h3>Plan your journey</h3>
              <p>Connect your education, learning goals and future career into a clearer roadmap.</p>
            </article>
          </div>
        </section>

        <section className="container section feature-section" id="develop">
          <div>
            <div className="eyebrow">Growth with direction</div>
            <div className="section-heading">
              <h2>
                Turn your ambitions
                <span> into action.</span>
              </h2>
              <p>
                Once you find your direction, Onkur helps you
                prepare for it with learning plans, skills and
                meaningful progress.
              </p>
            </div>

            <ul className="feature-list">
              <li><span className="check">✦</span> Personalized skill roadmaps</li>
              <li><span className="check">✦</span> Academic and career preparation</li>
              <li><span className="check">✦</span> Project and portfolio development</li>
              <li><span className="check">✦</span> Learning progress tracking</li>
            </ul>
          </div>

          <div className="preview-panel">
            <p className="dashboard-label">ILLUSTRATIVE LEARNING ROADMAP</p>
            <h3 style={{ marginTop: 10 }}>Prepare for your goals</h3>

            {[
              { name: "Explore your interests", width: "100%", value: "Done" },
              { name: "Research degree options", width: "70%", value: "In progress" },
              { name: "Build relevant skills", width: "35%", value: "Starting" },
              { name: "Prepare your portfolio", width: "10%", value: "Upcoming" },
            ].map((item) => (
              <div className="progress-item" key={item.name}>
                <div><span>{item.name}</span><span>{item.value}</span></div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container section" id="connect">
          <div className="section-heading">
            <div className="eyebrow">You don't have to do it alone</div>
            <h2>
              Learn from people
              <span> who've been there.</span>
            </h2>
            <p>
              Connect with mentors, university students and alumni
              who can share experiences and help you navigate
              your next steps.
            </p>
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
              Explore your possibilities. Make informed decisions.
              Start building the future you imagine.
            </p>
            <a href="/signup" className="primary-button">
              Find your path →
            </a>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <div>
          <a href="#" className="logo">onkur<span>.</span></a>
          <p style={{ marginTop: 12 }}>Find your direction. Build your future.</p>
          <p style={{ marginTop: 8 }}>© 2026 Onkur. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <a href="#discover">Universities</a>
          <a href="#careers">Careers</a>
          <a href="#develop">Develop</a>
          <a href="#connect">Connect</a>
        </div>
      </footer>
    </>
  );
}
