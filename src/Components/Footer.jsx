import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "./EmpowerHub-logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <img src={logo} alt="EmpowerHub Logo" className="footer-logo" />
          <p className="footer-tagline">
            Empowering students and job seekers to navigate their careers with confidence using AI-driven guidance.
          </p>
          <div className="footer-sdg">
            <span className="sdg-pill sdg4">🎓 SDG 4</span>
            <span className="sdg-pill sdg8">💼 SDG 8</span>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links-group">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/roadmap">AI Career Roadmap</Link></li>
            <li><Link to="/explore">Explore Careers</Link></li>
            <li><Link to="/community">Community</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Resources</h4>
          <ul>
            <li><a href="#features">How It Works</a></li>
            <li><Link to="/">Curated Videos</Link></li>
            <li><Link to="/login">Create Account</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>About</h4>
          <ul>
            <li><a href="#">Mission</a></li>
            <li><a href="#">SDG Alignment</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} EmpowerHub. Built for SDG 4 & SDG 8.</p>
        <p className="footer-built">Powered by <span>Google Gemma</span> via OpenRouter</p>
      </div>
    </footer>
  );
}
