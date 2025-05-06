import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../pages/styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-logo">Spell & Play</div>
        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/activities" onClick={() => setIsOpen(false)}>
              Activities
            </Link>
          </li>
          <li>
            <Link to="/help" onClick={() => setIsOpen(false)}>
              Help
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
