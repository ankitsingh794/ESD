// components/ChatBot.jsx
import { useState } from "react";
import AiAssistant from "./AiAssistant";
import "./ChatBot.css";
import { RiRobot3Fill } from "react-icons/ri";

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="floating-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI Assistant"
      >
        <RiRobot3Fill />
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div className="panel-header">
            <div className="panel-header-avatar">
              <RiRobot3Fill size={18} />
            </div>
            <div className="panel-header-info">
              <h3>EmpowerHub AI</h3>
              <span>
                <span className="online-dot" />
                Online · Career Assistant
              </span>
            </div>
            <button
              className="panel-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Assistant body (messages + input) */}
          <AiAssistant />
        </div>
      )}
    </>
  );
}
