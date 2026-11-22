"use client";

import { useEffect, useRef, useState } from "react";

export default function ParticleBookIntro() {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setVisible(false);
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame;
    let startTime;
    let particles = [];

    const scale = Math.min(width / 650, height / 520, 1);
    const bookWidth = 340 * scale;
    const bookHeight = 220 * scale;
    const random = (min, max) => Math.random() * (max - min) + min;
    const cx = () => width / 2;
    const cy = () => height / 2;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      const count = width < 600 ? 650 : 1400;

      particles = Array.from({ length: count }, () => {
        const u = Math.random();
        const v = Math.random();
        const side = Math.random() < 0.5 ? -1 : 1;

        return {
          x: random(0, width),
          y: random(0, height),
          size: random(0.8, 2.1),
          phase: random(0, Math.PI * 2),
          closed: {
            x: cx() + random(-bookWidth / 2, bookWidth / 2),
            y: cy() + random(-bookHeight / 2, bookHeight / 2),
          },
          open: {
            x: cx() + side * u * bookWidth / 2,
            y: cy() - bookHeight * 0.35 + v * bookHeight * 0.8
              + side * u * bookHeight * 0.08,
          },
          driftX: random(-width * 0.45, width * 0.45),
          driftY: random(-height * 0.45, height * 0.45),
        };
      });
    }

    const ease = (t) => t * t * (3 - 2 * t);

    function drawBook(openAmount) {
      const x = cx();
      const y = cy();
      const w = bookWidth / 2;
      const h = bookHeight / 2;

      ctx.save();
      ctx.translate(x, y);

      ctx.lineWidth = 2 * scale;
      ctx.strokeStyle = "rgba(248, 217, 67, 0.85)";
      ctx.shadowColor = "rgba(248, 217, 67, 0.5)";
      ctx.shadowBlur = 18 * scale;

      if (openAmount < 0.05) {
        ctx.fillStyle = "rgba(248, 217, 67, 0.12)";
        ctx.fillRect(-w, -h, w * 2, h * 2);
        ctx.strokeRect(-w, -h, w * 2, h * 2);

        ctx.beginPath();
        ctx.moveTo(-w + 12, -h);
        ctx.lineTo(-w + 12, h);
        ctx.stroke();
      } else {
        const fold = 1 - openAmount;

        ctx.fillStyle = "rgba(248, 217, 67, 0.10)";

        ctx.beginPath();
        ctx.moveTo(0, -h * 0.15);
        ctx.lineTo(-w, -h);
        ctx.lineTo(-w, h * 0.78);
        ctx.lineTo(0, h * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -h * 0.15);
        ctx.lineTo(w, -h);
        ctx.lineTo(w, h * 0.78);
        ctx.lineTo(0, h * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.lineWidth = 1 * scale;
        ctx.strokeStyle = "rgba(248, 217, 67, 0.38)";

        for (let i = 0; i < 4; i++) {
          const lineY = -h * 0.35 + i * h * 0.25;

          ctx.beginPath();
          ctx.moveTo(-w * 0.15, lineY);
          ctx.lineTo(-w * 0.78, lineY - h * 0.18);
          ctx.moveTo(w * 0.15, lineY);
          ctx.lineTo(w * 0.78, lineY - h * 0.18);
          ctx.stroke();
        }

        ctx.strokeStyle = "rgba(248, 217, 67, 0.8)";
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(0, -h * 0.15);
        ctx.lineTo(0, h * 0.55);
        ctx.stroke();
      }

      ctx.restore();
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const duration = 6800;
      const progress = Math.min(elapsed / duration, 1);

      const gather = ease(Math.min(progress / 0.28, 1));
      const opening = ease(Math.max(0, Math.min((progress - 0.30) / 0.25, 1)));
      const dissolve = ease(Math.max(0, Math.min((progress - 0.73) / 0.27, 1)));

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        let target;

        if (progress < 0.30) {
          target = {
            x: p.x + (p.closed.x - p.x) * gather,
            y: p.y + (p.closed.y - p.y) * gather,
          };
        } else {
          const opened = {
            x: p.closed.x + (p.open.x - p.closed.x) * opening,
            y: p.closed.y + (p.open.y - p.closed.y) * opening,
          };

          target = {
            x: opened.x + p.driftX * dissolve,
            y: opened.y + p.driftY * dissolve,
          };
        }

        const shimmer = 0.55 + 0.45 *
          (Math.sin(timestamp * 0.002 + p.phase) * 0.5 + 0.5);

        ctx.beginPath();
        ctx.fillStyle = `rgba(248, 217, 67, ${(1 - dissolve) * shimmer})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = "rgba(248, 217, 67, 0.8)";
        ctx.arc(target.x, target.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      if (progress > 0.20 && progress < 0.80) {
        drawBook(opening);
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setVisible(false);
      }
    }

    resize();
    createParticles();

    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="particle-intro">
      <canvas ref={canvasRef} />

      <div className="intro-wordmark">
        ONKUR<span>.</span>
      </div>

      <button
        className="skip-intro"
        onClick={() => setVisible(false)}
      >
        Skip intro <span>↗</span>
      </button>
    </div>
  );
}