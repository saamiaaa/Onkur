
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const filters = ["All Posts", "Discussions", "Projects", "Opportunities"];

function getInitials(name = "Onkur Student") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatPostTime(date) {
  if (!date) return "Recently";

  const postDate = new Date(date);

  if (Number.isNaN(postDate.getTime())) return "Recently";

  const difference = Math.max(0, Date.now() - postDate.getTime());
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return postDate.toLocaleDateString();
}

function normalizePost(post) {
  return {
    ...post,
    id: String(post.id || post._id),
    name: post.name || "Onkur Student",
    university: post.university || "University not added",
    initials: post.initials || getInitials(post.name),
    color: post.color || "violet",
    title: post.title || "",
    content: post.content || "",
    category: post.category || "Discussion",
    tags: Array.isArray(post.tags) ? post.tags : [],
    likes: Number(post.likes) || 0,
    liked: Boolean(post.liked),
    comments: Number(post.comments) || 0,
    shares: Number(post.shares) || 0,
    time: post.time || post.createdAt,
  };
}

export default function ConnectPage() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [likingPostId, setLikingPostId] = useState(null);

  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("Feed");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const userName = currentUser?.fullName || "Onkur Student";
  const userUniversity =
    currentUser?.university || "University not added";
  const userInitials = getInitials(userName);

  function showNotice(message) {
    setNotice(message);
    setTimeout(() => setNotice(""), 3000);
  }

  async function loadCommunityPosts() {
    setIsLoadingPosts(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/community/posts`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load community posts.");
      }

      setPosts(
        Array.isArray(data.posts)
          ? data.posts.map(normalizePost)
          : []
      );
    } catch (err) {
      console.error("Community posts error:", err);
      setError(err.message || "Unable to load community posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }

  // Authenticate the user and load their community feed.
  useEffect(() => {
    let isMounted = true;

    async function initializeCommunity() {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (isMounted) {
            setIsAuthenticated(false);
          }
          return;
        }

        const data = await response.json();

        if (!isMounted) return;

        setCurrentUser(data.user || data);
        setIsAuthenticated(true);

        const postsResponse = await fetch(`${API_URL}/community/posts`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const postsData = await postsResponse.json();

        if (!postsResponse.ok) {
          throw new Error(
            postsData.message || "Unable to load community posts."
          );
        }

        if (isMounted) {
          setPosts(
            Array.isArray(postsData.posts)
              ? postsData.posts.map(normalizePost)
              : []
          );
        }
      } catch (err) {
        console.error("Community initialization error:", err);

        if (isMounted) {
          setError(err.message || "Unable to load your community.");
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
          setIsLoadingPosts(false);
        }
      }
    }

    initializeCommunity();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchableText = [
        post.name,
        post.university,
        post.title,
        post.content,
        ...(post.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All Posts" ||
        (activeFilter === "Discussions" &&
          ["Discussion", "Question"].includes(post.category)) ||
        (activeFilter === "Projects" &&
          post.category === "Project Showcase") ||
        (activeFilter === "Opportunities" &&
          post.category === "Opportunity");

      return matchesSearch && matchesFilter;
    });
  }, [posts, search, activeFilter]);

  const myPosts = useMemo(() => {
    if (!currentUser) return [];

    return posts.filter((post) => {
      return post.name === userName;
    });
  }, [posts, currentUser, userName]);

  // Publish a post to MongoDB.
  async function publishPost() {
    if (!newPost.trim() || isPublishing) return;

    setIsPublishing(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/community/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: newPost.trim(),
          content: "",
          category: "Discussion",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to publish your post.");
      }

      if (data.post) {
        setPosts((current) => [
          normalizePost(data.post),
          ...current,
        ]);
      } else {
        await loadCommunityPosts();
      }

      setNewPost("");
      setShowComposer(false);
      setActiveFilter("All Posts");
      showNotice("Your post has been published!");
    } catch (err) {
      console.error("Publish post error:", err);
      showNotice(err.message || "Unable to publish your post.");
    } finally {
      setIsPublishing(false);
    }
  }

  // Like or unlike a post using the backend.
  async function toggleLike(id) {
    if (likingPostId) return;

    setLikingPostId(id);

    try {
      const response = await fetch(
        `${API_URL}/community/posts/${id}/like`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update like.");
      }

      setPosts((current) =>
        current.map((post) =>
          post.id === id
            ? {
                ...post,
                liked: data.liked,
                likes: data.likes,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      showNotice(err.message || "Unable to update like.");
    } finally {
      setLikingPostId(null);
    }
  }

  async function sharePost(post) {
    try {
      if (!navigator.clipboard) {
        throw new Error("Clipboard is not available in this browser.");
      }

      await navigator.clipboard.writeText(
        `${post.title}\n\n${post.content}`
      );

      showNotice("Post copied to clipboard!");
    } catch (err) {
      showNotice(err.message || "Unable to share this post.");
    }
  }

  // Loading screen.
  if (isCheckingAuth) {
    return (
      <main className="connect-page">
        <div className="connect-container">
          <div className="connect-empty-state">
            <h3>Checking your account...</h3>
            <p>Please wait while we verify your sign-in.</p>
          </div>
        </div>
      </main>
    );
  }

  // Signed-out screen.
  if (!isAuthenticated) {
    return (
      <main className="connect-page">
        <header className="connect-navbar">
          <Link href="/" className="connect-logo">
            onkur<span>.</span>
          </Link>
        </header>

        <div className="connect-container">
          <section
            className="connect-welcome"
            style={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div>
              <div className="connect-eyebrow">
                <span className="connect-eyebrow-dot" />
                YOUR STUDENT COMMUNITY
              </div>

              <h1>
                Your community
                <br />
                is waiting to <span>meet you.</span>
              </h1>

              <p>
                Please sign in to Onkur to connect with students,
                share ideas and explore opportunities.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  marginTop: "28px",
                  flexWrap: "wrap",
                }}
              >
                <Link href="/login" className="connect-create-button">
                  Sign in to continue ↗
                </Link>

                <Link href="/signup" className="connect-dashboard-link">
                  Create an account
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
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
          <Link href="/connect" className="active">
            Connect
          </Link>
        </nav>

        <div className="connect-nav-right">
          <Link href="/dashboard" className="connect-dashboard-link">
            My Dashboard <span>↗</span>
          </Link>
          <div className="connect-user-avatar">{userInitials}</div>
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
            <div className="connect-art-note note-one">
              Ideas grow here ✳
            </div>
            <div className="connect-art-note note-two">
              Let's collaborate!
            </div>
            <div className="connect-art-center">
              <span>✳</span>
              <span>↗</span>
              <span>✦</span>
            </div>
            <div className="connect-art-caption">
              A space to grow together.
            </div>
          </div>
        </section>

        <section className="connect-stat-row">
          <div className="connect-stat">
            <span className="connect-stat-icon yellow-icon">✳</span>
            <div>
              <strong>{posts.length}</strong>
              <small>Community posts</small>
            </div>
          </div>

          <div className="connect-stat">
            <span className="connect-stat-icon violet-icon">↗</span>
            <div>
              <strong>{myPosts.length}</strong>
              <small>Your published posts</small>
            </div>
          </div>

          <div className="connect-stat">
            <span className="connect-stat-icon pink-icon">♡</span>
            <div>
              <strong>
                {posts.reduce((total, post) => total + post.likes, 0)}
              </strong>
              <small>Total community likes</small>
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
                <div className="connect-profile-avatar">
                  {userInitials}
                </div>

                <h3>{userName}</h3>
                <p>{userUniversity}</p>

                <div className="connect-profile-progress">
                  <div>
                    <span>Your community activity</span>
                    <strong>{myPosts.length} posts</strong>
                  </div>

                  <div className="connect-progress-track">
                    <span
                      style={{
                        width: `${Math.min(myPosts.length * 10, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <Link href="/dashboard" className="connect-text-link">
                  View my dashboard <span>→</span>
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
                  className={`connect-side-link ${
                    activeTab === label ? "selected" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(label);

                    if (label === "Feed") {
                      document
                        .getElementById("connect-feed")
                        ?.scrollIntoView({ behavior: "smooth" });
                    } else if (label === "My Connections") {
                      showNotice(
                        "Connection management is not connected to the backend yet."
                      );
                    } else if (label === "Mentorship") {
                      showNotice(
                        "Mentorship features are not connected to the backend yet."
                      );
                    } else {
                      showNotice(
                        "Interest management will be available with your profile settings."
                      );
                    }
                  }}
                >
                  <span>{icon}</span>
                  {label}
                  {label === "My Connections" && <small>0</small>}
                </button>
              ))}
            </div>

            <div className="connect-side-card connect-guidelines">
              <span className="connect-guideline-icon">✦</span>
              <h3>Make this space yours.</h3>
              <p>
                Be curious, share generously, and help fellow students grow.
              </p>
              <span className="connect-guideline-tag">
                Community guidelines
              </span>
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
                  <div className="connect-avatar violet">
                    {userInitials}
                  </div>

                  <div>
                    <strong>Share something with the community</strong>
                    <small>Posting as {userName}</small>
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
                      onClick={() => {
                        setShowComposer(false);
                        setNewPost("");
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="connect-publish-button"
                      onClick={publishPost}
                      disabled={!newPost.trim() || isPublishing}
                    >
                      {isPublishing ? "Publishing..." : "Publish post ↗"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="connect-empty-state">
                <h3>Something went wrong</h3>
                <p>{error}</p>
                <button onClick={loadCommunityPosts}>
                  Try again
                </button>
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
              {isLoadingPosts ? (
                <div className="connect-empty-state">
                  <h3>Loading community posts...</h3>
                  <p>Fetching the latest posts from Onkur.</p>
                </div>
              ) : !error && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article className="connect-post-card" key={post.id}>
                    <div className="connect-post-top">
                      <div className={`connect-avatar ${post.color}`}>
                        {post.initials}
                      </div>

                      <div className="connect-post-author">
                        <strong>{post.name}</strong>
                        <span>{post.university}</span>
                        <small>{formatPostTime(post.time)}</small>
                      </div>
                    </div>

                    <div className="connect-post-body">
                      <span
                        className={`connect-category ${
                          post.category === "Opportunity"
                            ? "opportunity"
                            : post.category === "Question"
                              ? "question"
                              : ""
                        }`}
                      >
                        {post.category}
                      </span>

                      <h3>{post.title}</h3>

                      {post.content && <p>{post.content}</p>}

                      <div className="connect-post-tags">
                        {post.tags.map((tag, index) => (
                          <span key={`${post.id}-${tag}-${index}`}>
                            #{tag.replaceAll(" ", "")}
                          </span>
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
                        disabled={likingPostId === post.id}
                      >
                        <span>{post.liked ? "♥" : "♡"}</span>
                        {likingPostId === post.id
                          ? "Updating..."
                          : "Like"}
                      </button>

                      <button
                        onClick={() =>
                          showNotice(
                            "Comments are not connected to the backend yet."
                          )
                        }
                      >
                        <span>▢</span> Comment
                      </button>

                      <button onClick={() => sharePost(post)}>
                        <span>↗</span> Share
                      </button>
                    </div>
                  </article>
                ))
              ) : !error ? (
                <div className="connect-empty-state">
                  <span>⌕</span>
                  <h3>
                    {posts.length === 0
                      ? "Your community starts here!"
                      : "No posts found"}
                  </h3>
                  <p>
                    {posts.length === 0
                      ? "Be the first to share something with Onkur students."
                      : "Try a different search or select another category."}
                  </p>

                  {posts.length === 0 ? (
                    <button onClick={() => setShowComposer(true)}>
                      Create the first post
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSearch("");
                        setActiveFilter("All Posts");
                      }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : null}
            </div>

            {!isLoadingPosts && posts.length > 0 && (
              <div className="connect-feed-end">
                <span>✳</span>
                That's everything for now. Keep exploring!
              </div>
            )}
          </section>

          <aside className="connect-right-column">
            <div className="connect-side-card connect-students-card">
              <div className="connect-right-heading">
                <div>
                  <span className="connect-side-heading">YOUR ACTIVITY</span>
                  <h3>Your community journey.</h3>
                </div>
                <span className="connect-heading-decoration">✳</span>
              </div>

              <div className="connect-student-item">
                <div className="connect-avatar violet">
                  {userInitials}
                </div>

                <div className="connect-student-info">
                  <strong>{userName}</strong>
                  <span>{userUniversity}</span>
                  <small>{myPosts.length} published posts</small>
                </div>
              </div>

              <div className="connect-student-item">
                <div className="connect-avatar yellow">✳</div>
                <div className="connect-student-info">
                  <strong>Community contributions</strong>
                  <span>{myPosts.length} posts shared</span>
                  <small>
                    {myPosts.reduce(
                      (total, post) => total + post.likes,
                      0
                    )}{" "}
                    likes on your posts
                  </small>
                </div>
              </div>

              <Link href="/dashboard" className="connect-view-all">
                View your dashboard →
              </Link>
            </div>

            <div className="connect-side-card connect-mentors-card">
              <span className="connect-side-heading">COMMUNITY OVERVIEW</span>
              <h3>What's happening?</h3>
              <p>
                Explore what students are sharing across the Onkur community.
              </p>

              {[
                {
                  label: "Discussions",
                  count: posts.filter((p) =>
                    ["Discussion", "Question"].includes(p.category)
                  ).length,
                },
                {
                  label: "Projects",
                  count: posts.filter(
                    (p) => p.category === "Project Showcase"
                  ).length,
                },
                {
                  label: "Opportunities",
                  count: posts.filter(
                    (p) => p.category === "Opportunity"
                  ).length,
                },
              ].map((item) => (
                <div className="connect-mentor-item" key={item.label}>
                  <div className="connect-avatar violet">
                    ✳
                  </div>

                  <div className="connect-mentor-info">
                    <strong>{item.label}</strong>
                    <span>{item.count} posts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="connect-side-card connect-trending-card">
              <span className="connect-side-heading">YOUR CONTRIBUTIONS</span>
              <h3>My posts</h3>

              {myPosts.length > 0 ? (
                myPosts.slice(0, 4).map((post) => (
                  <button
                    className="connect-trend-item"
                    key={post.id}
                    onClick={() => {
                      setActiveFilter("All Posts");
                      setSearch(post.title);
                    }}
                  >
                    <span className="connect-trend-number">↗</span>
                    <span>
                      <strong>{post.title}</strong>
                      <small>{post.likes} likes</small>
                    </span>
                    <span className="connect-trend-arrow">→</span>
                  </button>
                ))
              ) : (
                <p>You haven't published any posts yet.</p>
              )}
            </div>

            <div className="connect-community-note">
              <span>
                onkur<span>.</span>
              </span>
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
