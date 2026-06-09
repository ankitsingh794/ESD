import { useState } from "react";
import axios from "axios";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Simple markdown renderer: bold, bullets
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    // Bold headings: **text**
    if (trimmed.startsWith("**") && trimmed.endsWith("**") && trimmed.length > 4) {
      const content = trimmed.slice(2, -2);
      return (
        <p key={i} style={{ fontWeight: "700", color: "#1e3a5f", margin: "12px 0 4px" }}>
          {content}
        </p>
      );
    }
    // Bullet: starts with - or •
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const content = trimmed.replace(/^[-•]\s/, "");
      return (
        <div key={i} style={{ display: "flex", gap: "8px", margin: "4px 0", paddingLeft: "4px" }}>
          <span style={{ color: "#4a90e2", flexShrink: 0 }}>▸</span>
          <span>{content}</span>
        </div>
      );
    }
    // Numbered: 1. text
    if (/^\d+[\.\)]\s/.test(trimmed)) {
      return (
        <div key={i} style={{ display: "flex", gap: "8px", margin: "4px 0", paddingLeft: "4px" }}>
          <span style={{ color: "#4a90e2", flexShrink: 0, fontWeight: "600" }}>
            {trimmed.match(/^\d+/)?.[0]}.
          </span>
          <span>{trimmed.replace(/^\d+[\.\)]\s/, "")}</span>
        </div>
      );
    }
    // Empty line
    if (!trimmed) return <div key={i} style={{ height: "6px" }} />;
    // Regular paragraph
    return (
      <p key={i} style={{ margin: "4px 0", lineHeight: "1.6" }}>
        {trimmed}
      </p>
    );
  });
}

export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemma-4-26b-a4b-it:free",
          messages: [
            {
              role: "system",
              content:
                "You are EmpowerHub AI — a career guidance assistant. Help students and job seekers with career paths, skills, resume tips, job roles, and learning resources. Be concise, encouraging, and practical. Use bullet points where helpful.",
            },
            {
              role: "user",
              content: query,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
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
      const aiText = res.data.choices[0].message.content;
      setResponse(aiText);
    } catch (err) {
      console.error("API Error:", err?.response?.data || err.message);
      const status = err?.response?.status;
      if (status === 401) {
        setResponse("❌ Invalid API key. Please check your OpenRouter key in .env");
      } else if (status === 429) {
        setResponse("⏳ Rate limit reached. Please wait a moment and try again.");
      } else {
        setResponse("❌ Something went wrong. Check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleAsk();
    }
  };

  const downloadTxtFile = (text) => {
    const timestamp = new Date().toLocaleString();
    const header = `EmpowerHub AI Assistant Response\nGenerated at: ${timestamp}\n\n`;
    const blob = new Blob([header + text], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = "empowerhub-ai-response.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="chatbox">
      <textarea
        rows="3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about jobs, skills, resumes... (Ctrl+Enter to send)"
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {response && (
        <div className="response-wrapper">
          <div className="response">{renderMarkdown(response)}</div>
          <button className="download-button" onClick={() => downloadTxtFile(response)}>
            ⬇ Download as .txt
          </button>
        </div>
      )}
    </div>
  );
}
