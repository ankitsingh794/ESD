import { useState } from "react";
import axios from "axios";

export default function AiAssistant() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("https://esd-server-udwa.onrender.com/ai-assist", {
        query,
      });
      setResponse(res.data.response);
    } catch (err) {
      console.error("API Error:", err);
      setResponse("❌ Something went wrong. Try again later.");
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
    const blob = new Blob([text], { type: "text/plain" });
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
        placeholder="Ask me anything about jobs, skills, resumes..."
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {response && (
        <div className="response-wrapper">
          <div className="response">{response}</div>
          <button className="download-button" onClick={() => downloadTxtFile(response)}>
            Download as .txt
          </button>
        </div>
      )}
    </div>
  );
}
