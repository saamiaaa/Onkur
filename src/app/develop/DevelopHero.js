
"use client";

import Link from "next/link";
import {
  Code2,
  ChartNoAxesCombined,
  Palette,
  Cpu,
  Microscope,
  BriefcaseBusiness,
  DraftingCompass,
  BrainCircuit,
} from "lucide-react";

import "./DevelopHero.css";

const professionIcons = [
  { Icon: Code2, x: "12%", delay: "0s", duration: "7s" },
  { Icon: ChartNoAxesCombined, x: "82%", delay: "2s", duration: "8s" },
  { Icon: Palette, x: "25%", delay: "3.5s", duration: "7.5s" },
  { Icon: Cpu, x: "72%", delay: "1s", duration: "9s" },
  { Icon: Microscope, x: "42%", delay: "5s", duration: "8s" },
  { Icon: BriefcaseBusiness, x: "92%", delay: "4s", duration: "7s" },
  { Icon: DraftingCompass, x: "5%", delay: "6s", duration: "9s" },
  { Icon: BrainCircuit, x: "58%", delay: "2.5s", duration: "8.5s" },
];

export default function DevelopHero() {
  return (
    <section className="container develop-hero">
      <div className="develop-orbit-stage">

        {/* Floating profession icons */}
        <div className="develop-profession-floats" aria-hidden="true">
          {professionIcons.map(({ Icon, x, delay, duration }, index) => (
            <span
              key={index}
              className="develop-profession-icon"
              style={{
                "--icon-x": x,
                "--icon-delay": delay,
                "--icon-duration": duration,
              }}
            >
              <Icon strokeWidth={1.5} />
            </span>
          ))}
        </div>

        {/* Orbit glow */}
        <div className="develop-orbit-halo" />

        {/* Orbit rings */}
        <div className="develop-orbit-ring develop-ring-outer" />
        <div className="develop-orbit-ring develop-ring-middle" />
        <div className="develop-orbit-ring develop-ring-inner" />

        {/* Moving particle trail */}
        <div className="develop-particle-track">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="develop-particle"
              style={{
                "--angle": `${index * 15}deg`,
                "--delay": `${index * -0.22}s`,
              }}
            />
          ))}
        </div>

        <div className="develop-orbit-comet" />

        {/* Orbit center */}
        <div className="develop-orbit-core">
          <span className="develop-core-symbol">✳</span>
          <span className="develop-core-label">ONKUR</span>
        </div>

        {/* Decorative stars */}
        <span className="develop-orbit-star star-one">✦</span>
        <span className="develop-orbit-star star-two">✧</span>
        <span className="develop-orbit-star star-three">✦</span>
      </div>

      {/* Text below the orbit */}
      <div className="develop-hero-content">
        <div className="eyebrow">YOUR GROWTH STARTS HERE</div>

        <h1>
          Turn your goals
          <br />
          into <span>real skills.</span>
        </h1>

        <p>
          Discover what to learn, build practical projects and make
          steady progress towards the future you want.
        </p>

        <div className="develop-hero-actions">
          <a href="#learning-paths" className="primary-button">
            Build my roadmap ↗
          </a>

          <Link href="/careers" className="secondary-button">
            Explore career paths
          </Link>
        </div>

        <div className="develop-hero-caption">
          <span />
          YOUR JOURNEY. YOUR PACE. YOUR FUTURE.
        </div>
      </div>
    </section>
  );
}
