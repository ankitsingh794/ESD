// components/AiAssistant.jsx
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
      const res = await axios.post("http://localhost:5000/ai-assist", { query });
      setResponse(res.data.response);
    } catch (err) {
      setResponse("❌ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbox">
      <textarea
        rows="3"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask me anything about jobs, skills, resumes..."
      />
      <button onClick={handleAsk}>{loading ? "Thinking..." : "Ask"}</button>
      {response && <div className="response">{response}</div>}
    </div>
  );
}
