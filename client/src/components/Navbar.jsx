import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../pages/styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-content">
        <div className="navbar-logo">
          <Link to="/" aria-label="Go to homepage">
            Spell & Play
          </Link>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          ☰
        </button>

        <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Home page"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/activities"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Activities page"
            >
              Activities
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Help page"
            >
              Help
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
