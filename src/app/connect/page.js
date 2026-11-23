
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const students = [
  {
    id: 1,
    name: "Ariana Rahman",
    university: "University of Dhaka",
    subject: "Computer Science",
    year: "3rd Year",
    initials: "AR",
    color: "lavender",
    skills: ["React", "UI Design", "Figma"],
    mutual: 8,
  },
  {
    id: 2,
    name: "Nabil Hasan",
    university: "BRAC University",
    subject: "Computer Science",
    year: "2nd Year",
    initials: "NH",
    color: "yellow",
    skills: ["Python", "Machine Learning"],
    mutual: 5,
  },
  {
    id: 3,
    name: "Mehjabin Noor",
    university: "North South University",
    subject: "Business Administration",
    year: "3rd Year",
    initials: "MN",
    color: "pink",
    skills: ["Marketing", "Research"],
    mutual: 3,
  },
];

const initialPosts = [
  {
    id: 1,
    name: "Ariana Rahman",
    initials: "AR",
    color: "lavender",
    university: "University of Dhaka",
    time: "2 hours ago",
    category: "Project Showcase",
    title: "Finally launched my first UI/UX case study!",
    content:
      "After weeks of research, wireframing and countless iterations, I finally finished my first complete case study. I redesigned a local food delivery experience with accessibility and simplicity in mind. Would love to hear your feedback!",
    tags: ["UI/UX", "Figma", "Portfolio"],
    likes: 42,
    comments: 12,
    shares: 5,
    liked: false,
    featured: true,
  },
  {
    id: 2,
    name: "Nabil Hasan",
    initials: "NH",
    color: "yellow",
    university: "BRAC University",
    time: "4 hours ago",
    category: "Question",
    title: "What resources helped you get started with machine learning?",
    content:
      "I'm currently learning Python and exploring ML fundamentals. There are so many courses out there that I'm a little overwhelmed. I'd love recommendations from people who have actually followed a beginner-friendly roadmap.",
    tags: ["Python", "Machine Learning", "Learning"],
    likes: 28,
    comments: 19,
    shares: 2,
    liked: false,
  },
  {
    id: 3,
    name: "Mehjabin Noor",
    initials: "MN",
    color: "pink",
    university: "North South University",
    time: "Yesterday",
    category: "Opportunity",
    title: "Looking for teammates for a student startup competition",
    content:
      "We're putting together a small interdisciplinary team for an upcoming startup competition. Looking for people interested in product design, development and business strategy. Let's build something meaningful together!",
    tags: ["Teamwork", "Startup", "Collaboration"],
    likes: 35,
    comments: 8,
    shares: 11,
    liked: false,
  },
];

const mentors = [
  {
    name: "Farhan Ahmed",
    role: "Software Engineer",
    company: "Tech Company",
    initials: "FA",
    color: "blue",
    expertise: "Software Development",
  },
  {
    name: "Nusrat Jahan",
    role: "Product Designer",
    company: "Design Studio",
    initials: "NJ",
    color: "pink",
    expertise: "UI/UX Design",
  },
];

const trends = [
  { tag: "#InternshipSeason", posts: "1.2k posts" },
  { tag: "#StudyAbroad", posts: "860 posts" },
  { tag: "#BuildInPublic", posts: "540 posts" },
  { tag: "#TechForGood", posts: "320 posts" },
];

const filters = ["All Posts", "Discussions", "Projects", "Opportunities"];

export default function ConnectPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState([]);
  const [connected, setConnected] = useState([]);
  const [commenting, setCommenting] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("Feed");
  const [notice, setNotice] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        `${post.name} ${post.title} ${post.content} ${post.tags.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All Posts" ||
        (activeFilter === "Discussions" && post.category === "Question") ||
        (activeFilter === "Projects" && post.category === "Project Showcase") ||
        (activeFilter === "Opportunities" && post.category === "Opportunity");

      return matchesSearch && matchesFilter;
    });
  }, [posts, search, activeFilter]);

  function toggleLike(id) {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1),
            }
          : post
      )
    );
  }

  function toggleFollow(name) {
    setFollowing((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  function toggleConnect(name) {
    setConnected((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  function publishPost() {
    if (!newPost.trim()) return;

    const post = {
      id: Date.now(),
      name: "You",
      initials: "ME",
      color: "violet",
      university: "Your university",
      time: "Just now",
      category: "Discussion",
      title: newPost.trim(),
      content: "",
      tags: ["Community"],
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
    };

    setPosts((current) => [post, ...current]);
    setNewPost("");
    setShowComposer(false);
    setActiveFilter("All Posts");
    setNotice("Your post has been published!");
    setTimeout(() => setNotice(""), 2500);
  }

  function addComment(id) {
    if (!commentText.trim()) return;

    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    );

    setCommentText("");
    setCommenting(null);
    setNotice("Comment added!");
    setTimeout(() => setNotice(""), 2500);
  }

  return (
    <main className="connect-page">
      <header className="connect-navbar">
        <Link href="/" className="connect-logo">
          onkur<span>.</span>
        </Link>

        <nav className="connect-main-nav">
          <Link href="/universities">Universities</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/develop">Develop</Link>
          <Link href="/connect" className="active">Connect</Link>
        </nav>

        <div className="connect-nav-right">
          <Link href="/dashboard" className="connect-dashboard-link">
            My Dashboard <span>↗</span>
          </Link>
          <div className="connect-user-avatar">ME</div>
        </div>
      </header>

      <div className="connect-container">
        <section className="connect-welcome">
          <div>
            <div className="connect-eyebrow">
              <span className="connect-eyebrow-dot" />
              YOUR STUDENT COMMUNITY
            </div>
            <h1>
              Good things happen
              <br />
              when we <span>connect.</span>
            </h1>
            <p>
              Share ideas, meet people who inspire you, and find your
              next opportunity.
            </p>
          </div>

          <div className="connect-welcome-art" aria-hidden="true">
            <div className="connect-art-note note-one">Ideas grow here ✳</div>
            <div className="connect-art-note note-two">Let's collaborate!</div>
            <div className="connect-art-center">
              <span>✳</span>
              <span>↗</span>
              <span>✦</span>
            </div>
            <div className="connect-art-caption">A space to grow together.</div>
          </div>
        </section>

        <section className="connect-stat-row">
          <div className="connect-stat">
            <span className="connect-stat-icon yellow-icon">✳</span>
            <div>
              <strong>Community</strong>
              <small>Learn from each other</small>
            </div>
          </div>
          <div className="connect-stat">
            <span className="connect-stat-icon violet-icon">↗</span>
            <div>
              <strong>Opportunities</strong>
              <small>Discover what's next</small>
            </div>
          </div>
          <div className="connect-stat">
            <span className="connect-stat-icon pink-icon">♡</span>
            <div>
              <strong>Connections</strong>
              <small>Build meaningful relationships</small>
            </div>
          </div>
        </section>

        <div className="connect-workspace">
          <aside className="connect-left-column">
            <div className="connect-side-card connect-profile-card">
              <div className="connect-profile-cover">
                <span>YOUR SPACE</span>
              </div>
              <div className="connect-profile-content">
                <div className="connect-profile-avatar">ME</div>
                <h3>Your profile</h3>
                <p>Complete your profile to help others find you.</p>
                <div className="connect-profile-progress">
                  <div><span>Profile strength</span><strong>60%</strong></div>
                  <div className="connect-progress-track">
                    <span />
                  </div>
                </div>
                <Link href="/dashboard" className="connect-text-link">
                  Complete profile <span>→</span>
                </Link>
              </div>
            </div>

            <div className="connect-side-card connect-navigation-card">
              <span className="connect-side-heading">EXPLORE</span>
              {[
                ["Feed", "▤"],
                ["My Connections", "♧"],
                ["Mentorship", "✳"],
                ["My Interests", "◇"],
              ].map(([label, icon]) => (
                <button
                  key={label}
                  className={`connect-side-link ${activeTab === label ? "selected" : ""}`}
                  onClick={() => {
                    setActiveTab(label);
                    if (label === "Mentorship") {
                      document.getElementById("connect-mentors")?.scrollIntoView({ behavior: "smooth" });
                    } else if (label === "My Connections") {
                      document.getElementById("connect-students")?.scrollIntoView({ behavior: "smooth" });
                    } else if (label === "Feed") {
                      document.getElementById("connect-feed")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      setNotice("Interest management will be available with your profile settings.");
                      setTimeout(() => setNotice(""), 3000);
                    }
                  }}
                >
                  <span>{icon}</span> 
                  {label}
                  {label === "My Connections" && (
                    <small>{connected.length}</small>
                  )}
                </button>
              ))}
            </div>

            <div className="connect-side-card connect-guidelines">
              <span className="connect-guideline-icon">✦</span>
              <h3>Make this space yours.</h3>
              <p>Be curious, share generously, and help fellow students grow.</p>
              <span className="connect-guideline-tag">Community guidelines</span>
            </div>
          </aside>

          <section className="connect-feed-column" id="connect-feed">
            <div className="connect-feed-heading">
              <div>
                <span className="connect-side-heading">THE COMMUNITY</span>
                <h2>Community feed</h2>
              </div>
              <button
                className="connect-create-button"
                onClick={() => setShowComposer(!showComposer)}
              >
                <span>＋</span> Create post
              </button>
            </div>

            {showComposer && (
              <div className="connect-composer connect-side-card">
                <div className="connect-composer-top">
                  <div className="connect-avatar violet">ME</div>
                  <div>
                    <strong>Share something with the community</strong>
                    <small>What's on your mind?</small>
                  </div>
                </div>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share an idea, ask a question, or tell us what you're working on..."
                  maxLength={1000}
                />
                <div className="connect-composer-bottom">
                  <span>{newPost.length}/1000</span>
                  <div>
                    <button
                      className="connect-cancel-button"
                      onClick={() => setShowComposer(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="connect-publish-button"
                      onClick={publishPost}
                      disabled={!newPost.trim()}
                    >
                      Publish post ↗
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="connect-feed-controls">
              <div className="connect-filter-tabs">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={activeFilter === filter ? "active" : ""}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="connect-search">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts..."
                />
              </div>
            </div>

            <div className="connect-post-list">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article className="connect-post-card" key={post.id}>
                    <div className="connect-post-top">
                      <div className={`connect-avatar ${post.color}`}>
                        {post.initials}
                      </div>
                      <div className="connect-post-author">
                        <strong>{post.name}</strong>
                        <span>{post.university}</span>
                        <small>{post.time}</small>
                      </div>
                      <button
                        className="connect-post-more"
                        aria-label="More post options"
                        onClick={() => {
                          setNotice("More post options will be available soon.");
                          setTimeout(() => setNotice(""), 2500);
                        }}
                      >
                        ···
                      </button>
                    </div>

                    <div className="connect-post-body">
                      <span className={`connect-category ${post.category === "Opportunity" ? "opportunity" : post.category === "Question" ? "question" : ""}`}>
                        {post.category}
                      </span>
                      <h3>{post.title}</h3>
                      {post.content && <p>{post.content}</p>}

                      {post.featured && (
                        <div className="connect-featured-project">
                          <div className="connect-project-graphic">
                            <span>CASE</span>
                            <strong>STUDY<br />01</strong>
                            <small>DESIGN PROCESS</small>
                          </div>
                          <div className="connect-project-info">
                            <span>FEATURED WORK</span>
                            <strong>Food delivery app redesign</strong>
                            <small>Research · Wireframes · UI Design</small>
                          </div>
                          <span className="connect-project-arrow">↗</span>
                        </div>
                      )}

                      <div className="connect-post-tags">
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag.replaceAll(" ", "")}</span>
                        ))}
                      </div>
                    </div>

                    <div className="connect-post-stats">
                      <span>{post.likes} likes</span>
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>

                    <div className="connect-post-actions">
                      <button
                        className={post.liked ? "liked" : ""}
                        onClick={() => toggleLike(post.id)}
                      >
                        <span>{post.liked ? "♥" : "♡"}</span> Like
                      </button>
                      <button
                        onClick={() =>
                          setCommenting(commenting === post.id ? null : post.id)
                        }
                      >
                        <span>▢</span> Comment
                      </button>
                      <button
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(
                              `${post.title}\n\n${post.content}`
                            );
                            setNotice("Post copied to clipboard!");
                          } else {
                            setNotice("Clipboard is not available in this browser.");
                          }
                          setTimeout(() => setNotice(""), 2500);
                        }}
                      >
                        <span>↗</span> Share
                      </button>
                    </div>

                    {commenting === post.id && (
                      <div className="connect-comment-box">
                        <input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a thoughtful comment..."
                          maxLength={300}
                        />
                        <button
                          onClick={() => addComment(post.id)}
                          disabled={!commentText.trim()}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </article>
                ))
              ) : (
                <div className="connect-empty-state">
                  <span>⌕</span>
                  <h3>No posts found</h3>
                  <p>Try a different search or select another category.</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveFilter("All Posts");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <div className="connect-feed-end">
              <span>✳</span>
              That's everything for now. Keep exploring!
            </div>
          </section>

          <aside className="connect-right-column">
            <div className="connect-side-card connect-students-card" id="connect-students">
              <div className="connect-right-heading">
                <div>
                  <span className="connect-side-heading">PEOPLE TO KNOW</span>
                  <h3>Find your people.</h3>
                </div>
                <span className="connect-heading-decoration">✳</span>
              </div>

              {students.map((student) => (
                <div className="connect-student-item" key={student.id}>
                  <div className={`connect-avatar ${student.color}`}>
                    {student.initials}
                  </div>
                  <div className="connect-student-info">
                    <strong>{student.name}</strong>
                    <span>{student.subject} · {student.year}</span>
                    <small>{student.mutual} mutual connections</small>
                    <div className="connect-student-skills">
                      {student.skills.slice(0, 2).map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                    <button
                      className={`connect-follow-button ${following.includes(student.name) ? "following" : ""}`}
                      onClick={() => toggleFollow(student.name)}
                    >
                      {following.includes(student.name) ? "Following ✓" : "+ Follow"}
                    </button>
                  </div>
                </div>
              ))}

              <button
                className="connect-view-all"
                onClick={() => setNotice("More student profiles will be available soon.")}
              >
                Discover more students →
              </button>
            </div>

            <div className="connect-side-card connect-mentors-card" id="connect-mentors">
              <span className="connect-side-heading">LEARN FROM OTHERS</span>
              <h3>Meet a mentor.</h3>
              <p>Get guidance from people who have already walked the path.</p>

              {mentors.map((mentor) => (
                <div className="connect-mentor-item" key={mentor.name}>
                  <div className={`connect-avatar ${mentor.color}`}>
                    {mentor.initials}
                  </div>
                  <div className="connect-mentor-info">
                    <strong>{mentor.name}</strong>
                    <span>{mentor.role}</span>
                    <small>{mentor.expertise}</small>
                  </div>
                  <button
                    className={`connect-mentor-add ${connected.includes(mentor.name) ? "added" : ""}`}
                    onClick={() => toggleConnect(mentor.name)}
                    aria-label={`Connect with ${mentor.name}`}
                  >
                    {connected.includes(mentor.name) ? "✓" : "+"}
                  </button>
                </div>
              ))}

              <button
                className="connect-view-all"
                onClick={() => setNotice("The full mentor directory is coming soon.")}
              >
                Explore mentors →
              </button>
            </div>

            <div className="connect-side-card connect-trending-card">
              <span className="connect-side-heading">WHAT'S HAPPENING</span>
              <h3>Trending topics</h3>
              {trends.map((trend, index) => (
                <button
                  className="connect-trend-item"
                  key={trend.tag}
                  onClick={() => setSearch(trend.tag.replace("#", ""))}
                >
                  <span className="connect-trend-number">0{index + 1}</span>
                  <span>
                    <strong>{trend.tag}</strong>
                    <small>{trend.posts}</small>
                  </span>
                  <span className="connect-trend-arrow">↗</span>
                </button>
              ))}
            </div>

            <div className="connect-community-note">
              <span>onkur<span>.</span></span>
              <p>Growing together, one connection at a time.</p>
              <small>© 2026 Onkur Community</small>
            </div>
          </aside>
        </div>
      </div>

      {notice && (
        <div className="connect-toast" role="status">
          <span>✓</span> {notice}
        </div>
      )}
    </main>
  );
}
