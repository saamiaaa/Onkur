
"use client";

import { useEffect, useRef, useState } from "react";
import "./AIAssistant.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const suggestedQuestions = [
  "How do I choose the right career?",
  "What skills should I learn as a CSE student?",
  "How can I prepare to study abroad?",
  "How can I improve my university profile?",
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const trimmedText = text.trim();

    if (!trimmedText || isLoading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: trimmedText },
    ];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to connect to Onkur AI."
        );
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            error.message || "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="onkur-ai-root">
      <button
        type="button"
        className="onkur-ai-launcher"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close Onkur AI" : "Open Onkur AI"}
      >
        {isOpen ? (
          <span className="onkur-ai-close-icon">×</span>
        ) : (
          <>
            <span className="onkur-ai-launcher-icon">✦</span>
            <span className="onkur-ai-status-dot" />
          </>
        )}
      </button>

      {isOpen && (
        <section
          className="onkur-ai-panel"
          aria-label="Onkur AI Assistant"
        >
          <div className="onkur-ai-ambient onkur-ai-ambient-one" />
          <div className="onkur-ai-ambient onkur-ai-ambient-two" />

          <header className="onkur-ai-header">
            <div className="onkur-ai-brand">
              <div className="onkur-ai-brand-icon">✦</div>

              <div className="onkur-ai-brand-info">
                <h2>Onkur AI</h2>
                <span>
                  <i />
                  Your growth companion
                </span>
              </div>
            </div>

            <button
              type="button"
              className="onkur-ai-header-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="onkur-ai-conversation">
            {messages.length === 0 && (
              <div className="onkur-ai-welcome">
                <div className="onkur-ai-welcome-icon">✦</div>

                <span className="onkur-ai-eyebrow">
                  YOUR PERSONAL STUDENT COMPANION
                </span>

                <h3>What's on your mind?</h3>

                <p>
                  Explore your interests, figure out your next step,
                  and let's work on your growth together.
                </p>

                <div className="onkur-ai-suggestions-heading">
                  START A CONVERSATION
                </div>

                <div className="onkur-ai-suggestions">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                    >
                      <span>{question}</span>
                      <span className="onkur-ai-suggestion-arrow">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`onkur-ai-message-row ${
                  message.role === "user"
                    ? "onkur-ai-user-row"
                    : "onkur-ai-assistant-row"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="onkur-ai-message-avatar">✦</div>
                )}

                <div
                  className={`onkur-ai-message ${
                    message.role === "user"
                      ? "onkur-ai-user-message"
                      : "onkur-ai-assistant-message"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="onkur-ai-message-row onkur-ai-assistant-row">
                <div className="onkur-ai-message-avatar">✦</div>

                <div className="onkur-ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <footer className="onkur-ai-footer">
            <form
              className="onkur-ai-input-form"
              onSubmit={handleSubmit}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Onkur AI anything..."
                maxLength={2000}
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                ↑
              </button>
            </form>

            <p>AI can make mistakes. Verify important information.</p>
          </footer>
        </section>
      )}
    </div>
  );
}
