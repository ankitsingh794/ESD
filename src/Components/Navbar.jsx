import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "./EmpowerHub-logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} alt="EmpowerHub Logo" className="logo-image" />
        </div>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div
          ref={menuRef}
          className={`navbar-links ${menuOpen ? "active" : ""}`}
        >
          <Link to={"/explore"} className="nav-link">Explore</Link>
          <Link to={"/community"} className="nav-link">Community</Link>
          <Link to={"/login"} className="nav-cta">Join Us</Link>
        </div>
      </div>
    </nav>
  );
}
