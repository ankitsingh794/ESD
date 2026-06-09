import React from "react";
import { Link } from "react-router-dom";
import LazyYouTube from "../Components/LazyYouTube";
import SplitText from "../Components/SplitText";
import StarBorder from "../Components/StarBorder";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import './Style/Home.css';

const FEATURES = [
  {
    icon: "🎯",
    title: "AI-Powered Career Matching",
    desc: "Our AI analyzes your skills and interests to suggest the most relevant career paths tailored specifically for you.",
    color: "#6366f1",
  },
  {
    icon: "🗺️",
    title: "Personalized Learning Roadmap",
    desc: "Get a step-by-step skill development plan — from beginner to job-ready, with curated resources at each stage.",
    color: "#8b5cf6",
  },
  {
    icon: "🛠️",
    title: "Portfolio Project Ideas",
    desc: "Receive project recommendations that showcase your growing skills to future employers and recruiters.",
    color: "#ec4899",
  },
  {
    icon: "📚",
    title: "Curated Course Suggestions",
    desc: "Hand-picked courses from Coursera, Udemy, YouTube and more — matched to your exact skill level and goals.",
    color: "#06b6d4",
  },
  {
    icon: "💼",
    title: "Job Role Discovery",
    desc: "Explore which job titles match your profile, what companies look for, and how to bridge remaining gaps.",
    color: "#10b981",
  },
  {
    icon: "⚡",
    title: "Instant AI Assistant",
    desc: "Ask anything — resume tips, interview prep, salary expectations — and get instant expert guidance.",
    color: "#f59e0b",
  },
];

export default function Home() {
  const opts = {
    height: '390',
    width: '640',
    playerVars: { autoplay: 0 },
  };

  return (
    <div className="home">
      <Navbar />

      {/* ── HERO ── */}
      <div className="home-container">
        <div className="home-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            AI-Powered Career Platform
          </div>

          <h1 className="hero-title">
            Navigate Your Career<br />
            with <span className="gradient-word">Confidence</span>
          </h1>

          <p className="hero-subtitle">
            EmpowerHub uses AI to map your skills and interests to a clear career path — complete with a personalized learning roadmap, project ideas, and job opportunities.
          </p>

          <div className="home-buttons">
            <Link to="/roadmap">
              <StarBorder as="button" color="cyan" speed="4s">
                ✨ Get My Roadmap
              </StarBorder>
            </Link>
            <a href="#features" className="btn-outline">See How It Works</a>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">10+</span>
              <span className="stat-label">Career Fields</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Personalized</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">Free</span>
              <span className="stat-label">AI Powered</span>
            </div>
          </div>
        </div>

        <img
          src="https://res.cloudinary.com/divulwxho/image/upload/v1751714762/img1_pxoc9g.svg"
          alt="Career navigation illustration"
          className="image-1"
        />
      </div>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div className="section-header">
            <div className="section-tag">Features</div>
            <h2 className="section-title">Everything You Need to<br />Launch Your Career</h2>
            <p className="section-subtitle">
              From identifying skill gaps to landing your first role — EmpowerHub guides every step.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title} style={{ "--card-color": f.color }}>
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG ALIGNMENT ── */}
      <section className="features-section" style={{ background: "transparent", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="sdg-section" style={{ padding: "0" }}>
          <div className="section-header">
            <div className="section-tag">UN Sustainable Development Goals</div>
            <h2 className="section-title">Built for a Better World</h2>
            <p className="section-subtitle">
              EmpowerHub directly contributes to two critical UN SDGs by making quality education and decent work accessible to all.
            </p>
          </div>
          <div className="sdg-grid">
            <div className="sdg-card sdg4">
              <div className="sdg-number">04</div>
              <div className="sdg-text">
                <h3>🎓 Quality Education</h3>
                <p>We bridge skill gaps by providing free, personalized learning pathways — ensuring inclusive and equitable quality education for every user, regardless of background.</p>
              </div>
            </div>
            <div className="sdg-card sdg8">
              <div className="sdg-number">08</div>
              <div className="sdg-text">
                <h3>💼 Decent Work & Economic Growth</h3>
                <p>By aligning skills with real job market demands and surfacing internship opportunities, we promote productive employment and sustained economic growth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2>Ready to Find Your Path?</h2>
        <p>Join thousands of students using AI to launch their careers.</p>
        <div className="cta-buttons">
          <Link to="/roadmap" className="btn-primary">✨ Generate My Roadmap</Link>
          <Link to="/login" className="btn-outline">Create Free Account</Link>
        </div>
      </section>

      {/* ── VIDEOS ── */}
      <div className="home-content-2" style={{ marginTop: "80px" }}>
        <div className="section-header" style={{ textAlign: "left" }}>
          <div className="section-tag">Learning Resources</div>
          <h2 className="section-title">Curated Career Videos</h2>
        </div>
      </div>
      <div className="home-content-3">
        <div className="yt-videos">
          <LazyYouTube videoId="J11Qme3vAio" opts={opts} />
          <LazyYouTube videoId="T9ti0_I04Xs" opts={opts} />
          <LazyYouTube videoId="2qH7ausehwE" opts={opts} />
          <LazyYouTube videoId="Z0fZ_GIT7vo" opts={opts} />
          <LazyYouTube videoId="O0VFTXkXcAE" opts={opts} />
          <LazyYouTube videoId="YG1sW00jwLY" opts={opts} />
          <LazyYouTube videoId="F6Nh1l-T1qY" opts={opts} />
          <LazyYouTube videoId="JJjBPBWaeYU" opts={opts} />
        </div>
      </div>
      <Footer />
    </div>
  );
}