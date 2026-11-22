"use client";

import { useEffect, useRef } from "react";

export default function CursorParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Disable on mobile and for reduced-motion preferences
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let animationFrame;

    const colors = [
      "248, 217, 67",
      "119, 112, 255",
      "241, 240, 235",
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function addParticles(x, y) {
      // Add a small burst around the cursor
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2 + 0.7,
          life: 1,
          decay: Math.random() * 0.018 + 0.012,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      // Limit particles for performance
      if (particles.length > 100) {
        particles.splice(0, particles.length - 100);
      }
    }

    function handleMouseMove(event) {
      addParticles(event.clientX, event.clientY);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles = particles.filter((particle) => particle.life > 0);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Gentle upward floating motion
        particle.vy -= 0.015;

        particle.life -= particle.decay;

        const alpha = Math.max(particle.life, 0);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${particle.color}, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${particle.color}, ${alpha})`;

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animationFrame = requestAnimationFrame(animate);
    }

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handleMouseMove);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-particle-canvas"
      aria-hidden="true"
    />
  );
}