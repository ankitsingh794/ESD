// components/AiAssistantWidget.jsx
import { useState } from "react";
import AiAssistant from "./AiAssistant";
import "./ChatBot.css";
import { RiRobot3Fill } from "react-icons/ri";

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
    <button className="floating-button" onClick={() => setIsOpen(true)}>
  <RiRobot3Fill className="robot-icon" />
</button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>EmpowerHub AI Assistant</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
            </div>
            <AiAssistant />
          </div>
        </div>
      )}
    </>
  );
}
