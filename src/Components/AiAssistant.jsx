import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// ── Inline renderer: converts **bold**, *italic*, `code` → React elements ──
function renderInline(text) {
  // Split on bold, italic, or inline code patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, j) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={j}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={j}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={j} style={{
          background: "rgba(99,102,241,0.1)", borderRadius: "4px",
          padding: "1px 5px", fontSize: "0.80rem", fontFamily: "monospace",
          color: "#4f46e5"
        }}>{part.slice(1, -1)}</code>
      );
    return part;
  });
}

// ── Block renderer: headings, bullets, numbered, blockquote, paragraph ──
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();

    // ### Heading 3
    if (/^###\s+/.test(trimmed)) {
      return (
        <p key={i} style={{ fontWeight: "700", color: "#6d28d9", margin: "10px 0 3px", fontSize: "0.82rem", letterSpacing: "0.01em" }}>
          {renderInline(trimmed.replace(/^###\s+/, ""))}
        </p>
      );
    }
    // ## Heading 2
    if (/^##\s+/.test(trimmed)) {
      return (
        <p key={i} style={{ fontWeight: "700", color: "#4f46e5", margin: "12px 0 4px", fontSize: "0.86rem", letterSpacing: "0.01em" }}>
          {renderInline(trimmed.replace(/^##\s+/, ""))}
        </p>
      );
    }
    // # Heading 1
    if (/^#\s+/.test(trimmed)) {
      return (
        <p key={i} style={{ fontWeight: "800", color: "#3730a3", margin: "14px 0 5px", fontSize: "0.9rem" }}>
          {renderInline(trimmed.replace(/^#\s+/, ""))}
        </p>
      );
    }
    // Bullet: - or * or •
    if (/^[-*•]\s+/.test(trimmed)) {
      return (
        <div key={i} style={{ display: "flex", gap: "7px", margin: "3px 0", paddingLeft: "2px", alignItems: "flex-start" }}>
          <span style={{ color: "#8b5cf6", flexShrink: 0, marginTop: "2px", fontSize: "0.75rem" }}>▸</span>
          <span>{renderInline(trimmed.replace(/^[-*•]\s+/, ""))}</span>
        </div>
      );
    }
    // Numbered list: 1. or 1)
    if (/^\d+[.)]\s/.test(trimmed)) {
      const num = trimmed.match(/^\d+/)?.[0];
      return (
        <div key={i} style={{ display: "flex", gap: "7px", margin: "3px 0", paddingLeft: "2px", alignItems: "flex-start" }}>
          <span style={{ color: "#8b5cf6", flexShrink: 0, fontWeight: "600", minWidth: "18px", fontSize: "0.82rem" }}>
            {num}.
          </span>
          <span>{renderInline(trimmed.replace(/^\d+[.)]\s/, ""))}</span>
        </div>
      );
    }
    // Blockquote: > text
    if (/^>\s+/.test(trimmed)) {
      return (
        <div key={i} style={{
          borderLeft: "3px solid #a78bfa", paddingLeft: "10px",
          color: "#6d28d9", fontStyle: "italic", margin: "6px 0",
          fontSize: "0.82rem"
        }}>
          {renderInline(trimmed.replace(/^>\s+/, ""))}
        </div>
      );
    }
    // Horizontal rule
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      return <hr key={i} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />;
    }
    // Empty line → small spacer
    if (!trimmed) return <div key={i} style={{ height: "5px" }} />;
    // Regular paragraph with inline formatting
    return (
      <p key={i} style={{ margin: "3px 0", lineHeight: "1.58" }}>
        {renderInline(trimmed)}
      </p>
    );
  });
}

export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll when response arrives
  useEffect(() => {
    if (response || loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [response, loading]);

  // Auto-grow textarea
  const handleInput = (e) => {
    setQuery(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  };

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
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
            { role: "user", content: query },
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
      setResponse(res.data.choices[0].message.content);
    } catch (err) {
      console.error("API Error:", err?.response?.data || err.message);
      const status = err?.response?.status;
      if (status === 401) setResponse("❌ Invalid API key. Check your OpenRouter key in .env");
      else if (status === 429) setResponse("⏳ Rate limit reached. Please wait a moment and try again.");
      else setResponse("❌ Something went wrong. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleAsk();
    }
  };

  const downloadTxtFile = () => {
    const timestamp = new Date().toLocaleString();
    const blob = new Blob(
      [`EmpowerHub AI Response\nGenerated: ${timestamp}\n\n${response}`],
      { type: "text/plain" }
    );
    const link = document.createElement("a");
    link.download = "empowerhub-ai-response.txt";
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <>
      {/* Messages area */}
      <div className="panel-messages">
        {/* Welcome bubble (always shown) */}
        <div className="msg-bubble">
          <div className="msg-avatar">AI</div>
          <div className="msg-text">
            👋 Hi! I'm <strong>EmpowerHub AI</strong>. Ask me anything about careers, skills, resumes, or job roles!
          </div>
        </div>

        {/* Typing indicator */}
        {loading && (
          <div className="msg-bubble">
            <div className="msg-avatar">AI</div>
            <div className="typing-indicator">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        {/* AI Response bubble */}
        {response && !loading && (
          <div className="msg-bubble">
            <div className="msg-avatar">AI</div>
            <div className="ai-response-bubble">{renderMarkdown(response)}</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Download strip */}
      {response && !loading && (
        <div className="download-strip">
          <button className="download-button" onClick={downloadTxtFile}>
            ⬇ Save response
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="panel-input-area">
        <textarea
          ref={textareaRef}
          className="panel-textarea"
          rows={1}
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask about careers, skills, resumes…"
        />
        <button
          className="panel-send-btn"
          onClick={handleAsk}
          disabled={loading || !query.trim()}
          aria-label="Send"
        >
          <IoSend />
        </button>
      </div>
      <div className="panel-hint">Ctrl + Enter to send</div>
    </>
  );
}
