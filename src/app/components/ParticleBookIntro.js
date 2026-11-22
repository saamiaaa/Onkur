"use client";

import { useEffect, useRef, useState } from "react";

export default function ParticleBookIntro() {
  const canvasRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("onkur-intro-seen") === "true") return;
    } catch {}

    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finish = () => {
      try {
        localStorage.setItem("onkur-intro-seen", "true");
      } catch {}
      setVisible(false);
    };

    if (reducedMotion) {
      finish();
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrame;
    let startTime;
    let particles = [];

    const mobile = width < 600;
    const count = mobile ? 550 : 1200;
    const centerX = () => width / 2;
    const centerY = () => height / 2;

    const random = (min, max) => Math.random() * (max - min) + min;

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

    function pagePoint(side) {
      const u = Math.random();
      const v = Math.random();

      if (side === "left") {
        return {
          x: centerX() - 5 - u * 105,
          y: centerY() - 4 - v * 70 + u * 12,
        };
      }

      return {
        x: centerX() + 5 + u * 105,
        y: centerY() - 4 - v * 70 - u * 12,
      };
    }

    function createParticles() {
      particles = Array.from({ length: count }, (_, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        const u = Math.random();
        const v = Math.random();

        return {
          x: random(0, width),
          y: random(0, height),
          size: random(0.7, 2),
          alpha: random(0.45, 1),
          phase: random(0, Math.PI * 2),
          side,
          closed: {
            x: centerX() - 95 + u * 190,
            y: centerY() - 58 + v * 116,
          },
          open: pagePoint(side),
          driftX: random(-width * 0.55, width * 0.55),
          driftY: random(-height * 0.55, height * 0.55),
        };
      });
    }

    const ease = (t) => t * t * (3 - 2 * t);

    function drawBook(progress) {
      const x = centerX();
      const y = centerY();

      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = "rgba(248, 217, 67, 0.25)";
      ctx.lineWidth = 1.2;

      if (progress < 0.48) {
        ctx.fillStyle = "rgba(248, 217, 67, 0.08)";
        ctx.beginPath();
        ctx.moveTo(-95, -58);
        ctx.lineTo(95, -58);
        ctx.lineTo(95, 58);
        ctx.lineTo(-95, 58);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(248, 217, 67, 0.6)";
        ctx.beginPath();
        ctx.moveTo(-88, -50);
        ctx.lineTo(-88, 50);
        ctx.moveTo(-82, -50);
        ctx.lineTo(-82, 50);
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(248, 217, 67, 0.055)";

        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(-105, -74);
        ctx.lineTo(-105, 65);
        ctx.lineTo(0, 48);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -4);
        ctx.lineTo(105, -74);
        ctx.lineTo(105, 65);
        ctx.lineTo(0, 48);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "rgba(248, 217, 67, 0.4)";
        for (let i = 0; i < 4; i++) {
          const lineY = -35 + i * 20;
          ctx.beginPath();
          ctx.moveTo(-15, lineY);
          ctx.lineTo(-85, lineY - 22);
          ctx.moveTo(15, lineY);
          ctx.lineTo(85, lineY - 22);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const duration = 5600;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, width, height);

      const gather = ease(Math.min(progress / 0.25, 1));
      const opening = ease(Math.max(0, Math.min((progress - 0.38) / 0.25, 1)));
      const dissolve = ease(Math.max(0, Math.min((progress - 0.72) / 0.28, 1)));

      particles.forEach((p) => {
        let target;

        if (progress < 0.38) {
          target = {
            x: p.x + (p.closed.x - p.x) * gather,
            y: p.y + (p.closed.y - p.y) * gather,
          };
        } else {
          const openTarget = {
            x: p.closed.x + (p.open.x - p.closed.x) * opening,
            y: p.closed.y + (p.open.y - p.closed.y) * opening,
          };

          target = {
            x: openTarget.x + p.driftX * dissolve,
            y: openTarget.y + p.driftY * dissolve,
          };
        }

        const shimmer = Math.sin(timestamp * 0.002 + p.phase) * 0.5 + 0.5;
        const alpha = p.alpha * (1 - dissolve) * (0.55 + shimmer * 0.45);

        ctx.beginPath();
        ctx.fillStyle = `rgba(248, 217, 67, ${alpha})`;
        ctx.shadowBlur = 7;
        ctx.shadowColor = "rgba(248, 217, 67, 0.7)";
        ctx.arc(
          target.x,
          target.y,
          p.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      ctx.shadowBlur = 0;

      if (progress > 0.22 && progress < 0.78) {
        drawBook(progress);
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        finish();
      }
    }

    resize();
    createParticles();
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="particle-intro">
      <canvas ref={canvasRef} />
      <div className="intro-wordmark">ONKUR<span>.</span></div>
      <button className="skip-intro" onClick={() => {
        try {
          localStorage.setItem("onkur-intro-seen", "true");
        } catch {}
        setVisible(false);
      }}>
        Skip intro <span>↗</span>
      </button>
    </div>
  );
}