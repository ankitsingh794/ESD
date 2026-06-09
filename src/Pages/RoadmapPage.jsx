import { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import "./Style/Roadmap.css";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const CAREER_FIELDS = [
  "Web Development",
  "Data Science",
  "Machine Learning / AI",
  "Cloud & DevOps",
  "UI/UX Design",
  "Cybersecurity",
  "Mobile Development",
  "Blockchain",
  "Digital Marketing",
  "Product Management",
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

// ── Robust parser that handles markdown bold headings, numbered headings, etc.
function parseRoadmap(raw) {
  const sections = {
    careerPaths: [],
    learningRoadmap: [],
    suggestedProjects: [],
    recommendedCourses: [],
    jobRoles: [],
    summary: "",
  };

  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  let currentSection = null;
  let foundAnySection = false;

  // Strip markdown bold/italic: **text** or *text*
  const strip = (s) => s.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#+\s*/g, "").trim();

  for (const line of lines) {
    const clean = strip(line);
    const lower = clean.toLowerCase();

    // Detect section headings (handles: "## 1. Career Paths", "**Career Paths**", "1. Career Paths", etc.)
    const isHeading =
      line.startsWith("#") ||
      (line.startsWith("**") && line.endsWith("**")) ||
      /^\d+[\.\)]\s/.test(line);

    if (isHeading || lower.endsWith(":")) {
      if (
        lower.includes("career path") ||
        lower.includes("suitable career") ||
        lower.includes("career option")
      ) {
        currentSection = "careerPaths";
        foundAnySection = true;
      } else if (
        lower.includes("learning roadmap") ||
        lower.includes("step") ||
        lower.includes("skill to acquire") ||
        lower.includes("learning path") ||
        (lower.includes("roadmap") && !lower.includes("your"))
      ) {
        currentSection = "learningRoadmap";
        foundAnySection = true;
      } else if (lower.includes("project")) {
        currentSection = "suggestedProjects";
        foundAnySection = true;
      } else if (
        lower.includes("course") ||
        lower.includes("resource") ||
        lower.includes("recommended")
      ) {
        currentSection = "recommendedCourses";
        foundAnySection = true;
      } else if (
        lower.includes("job role") ||
        lower.includes("job title") ||
        lower.includes("target role") ||
        lower.includes("career role")
      ) {
        currentSection = "jobRoles";
        foundAnySection = true;
      }
      continue;
    }

    // Collect bullet points into current section
    if (
      currentSection &&
      (line.startsWith("-") ||
        line.startsWith("•") ||
        line.startsWith("*") ||
        line.match(/^\d+[\.\)]/))
    ) {
      const item = clean.replace(/^[-•\d\.\)]\s*/, "").trim();
      if (item && sections[currentSection]) {
        sections[currentSection].push(item);
      }
    } else if (!foundAnySection && !line.startsWith("#")) {
      // Collect intro text as summary
      sections.summary += clean + " ";
    }
  }

  return sections;
}

// ── Fallback: split raw text into 5 even chunks for tabs if parser finds nothing
function fallbackParse(raw, sections) {
  const hasAny = Object.values(sections).some(
    (v) => Array.isArray(v) && v.length > 0
  );
  if (hasAny) return sections;

  // Just dump all lines as learning roadmap items so something always shows
  const lines = raw
    .split("\n")
    .map((l) => l.replace(/\*\*/g, "").replace(/\*/g, "").replace(/#+\s*/g, "").trim())
    .filter((l) => l.length > 3);

  return {
    ...sections,
    learningRoadmap: lines,
    summary: "Here is your AI-generated career roadmap:",
  };
}

export default function RoadmapPage() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [selectedField, setSelectedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [rawResponse, setRawResponse] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("roadmap");

  const handleGenerate = async () => {
    if (!skills.trim() && !interests.trim()) {
      setError("Please enter at least your skills or interests.");
      return;
    }
    setError("");
    setLoading(true);
    setRoadmap(null);
    setRawResponse("");

    const prompt = `You are EmpowerHub AI — a career guidance counselor helping students find their path.

User Profile:
- Current Skills: ${skills || "Not specified"}
- Interests: ${interests || "Not specified"}
- Career Goal: ${goal || "Not specified"}
- Skill Level: ${level}
- Preferred Field: ${selectedField || "Open to suggestions"}

Please generate a personalized career roadmap with EXACTLY these 5 sections. Use this exact format with these exact headings, followed by bullet points starting with "- ":

**Suitable Career Paths**
- [career path 1]
- [career path 2]
- [career path 3]

**Learning Roadmap**
- [step 1]
- [step 2]
- [step 3]
- [step 4]

**Suggested Projects**
- [project 1]
- [project 2]
- [project 3]

**Recommended Courses**
- [course name] on [platform]
- [course name] on [platform]
- [course name] on [platform]

**Job Roles to Target**
- [job title 1]
- [job title 2]
- [job title 3]

Be specific, practical, and encouraging. 4-6 bullets per section.`;

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemma-4-26b-a4b-it:free",
          messages: [
            {
              role: "system",
              content:
                "You are EmpowerHub AI, a career guidance assistant. Always respond using the exact section headings and bullet format the user requests. Never skip sections.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://empowerhub.app",
            "X-Title": "EmpowerHub",
          },
        }
      );

      const text = res.data.choices[0].message.content;
      setRawResponse(text);
      const parsed = parseRoadmap(text);
      setRoadmap(fallbackParse(text, parsed));
    } catch (err) {
      console.error("API Error:", err?.response?.data || err.message);
      const errMsg =
        err?.response?.data?.error?.message ||
        err?.response?.status === 401
          ? "❌ Invalid API key. Please check your OpenRouter key."
          : err?.response?.status === 429
          ? "⏳ Rate limit hit. Wait a moment and try again."
          : "❌ Failed to generate roadmap. Check console for details.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!rawResponse) return;
    const ts = new Date().toLocaleString();
    const header = `EmpowerHub — Personalized Career Roadmap\nGenerated: ${ts}\n\nYour Profile:\n- Skills: ${skills}\n- Interests: ${interests}\n- Goal: ${goal}\n- Level: ${level}\n- Field: ${selectedField || "Open"}\n\n${"=".repeat(50)}\n\n`;
    const blob = new Blob([header + rawResponse], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "empowerhub-roadmap.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const tabs = [
    { id: "roadmap", label: "📍 Learning Path", key: "learningRoadmap" },
    { id: "careers", label: "🎯 Career Paths", key: "careerPaths" },
    { id: "projects", label: "🛠 Projects", key: "suggestedProjects" },
    { id: "courses", label: "📚 Courses", key: "recommendedCourses" },
    { id: "jobs", label: "💼 Job Roles", key: "jobRoles" },
  ];

  return (
    <div className="roadmap-page">
      <Navbar />

      <div className="roadmap-hero">
        <div className="hero-badge">✨ AI-Powered</div>
        <h1 className="roadmap-title">Your Personalized Career Roadmap</h1>
        <p className="roadmap-subtitle">
          Tell us about yourself — our AI will craft a roadmap built just for you.
        </p>
      </div>

      <div className="roadmap-layout">
        {/* ── INPUT PANEL ── */}
        <div className="input-panel">
          <div className="panel-header">
            <span className="panel-icon">👤</span>
            <h2>Your Profile</h2>
          </div>

          <div className="form-group">
            <label>Current Skills</label>
            <textarea
              rows="3"
              placeholder="e.g. HTML, CSS, Python basics, Excel..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Interests</label>
            <textarea
              rows="2"
              placeholder="e.g. Building websites, working with data, design..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>
              Career Goal <span className="optional">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Become a full-stack developer in 6 months"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Skill Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                {SKILL_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>
                Preferred Field <span className="optional">(optional)</span>
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
              >
                <option value="">Any / Not sure</option>
                {CAREER_FIELDS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            id="generate-roadmap-btn"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Generating Roadmap...
              </>
            ) : (
              <>✨ Generate My Roadmap</>
            )}
          </button>
        </div>

        {/* ── OUTPUT PANEL ── */}
        <div className="output-panel">
          {!roadmap && !loading && (
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <h3>Your roadmap will appear here</h3>
              <p>Fill in your profile on the left and click Generate.</p>
              <div className="sdg-badges">
                <span className="sdg-badge sdg4">🎓 SDG 4 — Quality Education</span>
                <span className="sdg-badge sdg8">💼 SDG 8 — Decent Work</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loading-orb" />
              <h3>AI is crafting your roadmap...</h3>
              <p>Analyzing your skills and matching career paths</p>
              <div className="loading-steps">
                <div className="step active">🔍 Analyzing profile</div>
                <div className="step">🎯 Matching careers</div>
                <div className="step">📚 Finding resources</div>
                <div className="step">✍️ Writing roadmap</div>
              </div>
            </div>
          )}

          {roadmap && !loading && (
            <div className="roadmap-result">
              {roadmap.summary && (
                <div className="result-summary">
                  <p>{roadmap.summary}</p>
                </div>
              )}

              <div className="tab-bar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    {roadmap[tab.key]?.length > 0 && (
                      <span className="tab-count">{roadmap[tab.key].length}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="tab-content">
                {tabs.map((tab) =>
                  activeTab === tab.id ? (
                    <ul key={tab.id} className="result-list">
                      {roadmap[tab.key]?.length > 0 ? (
                        roadmap[tab.key].map((item, i) => (
                          <li key={i} className="result-item">
                            <span className="item-num">{i + 1}</span>
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="result-item no-data">
                          📄 See the full AI response below for this section.
                        </li>
                      )}
                    </ul>
                  ) : null
                )}
              </div>

              {/* Always-visible raw response */}
              <details className="raw-toggle" open={roadmap.learningRoadmap?.length === 0}>
                <summary>📄 View Full AI Response</summary>
                <pre className="raw-response">{rawResponse}</pre>
              </details>

              <button
                className="download-roadmap-btn"
                onClick={handleDownload}
                id="download-roadmap-btn"
              >
                ⬇ Download Roadmap (.txt)
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
