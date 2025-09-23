import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import '../pages/styles/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Focus trap within the mobile menu; Esc closes
  useEffect(() => {
    if (!isOpen) return;
    const menu = menuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key === 'Tab' && focusable.length > 0) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // focus the first item when opening
    first?.focus();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

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
          aria-controls="mobile-menu"
          ref={toggleRef}
        >
          ☰
        </button>

        <ul
          id="mobile-menu"
          className={`navbar-links ${isOpen ? 'open' : ''}`}
          role="menu"
          aria-hidden={!isOpen}
          ref={menuRef}
        >
          <li>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Home page"
              role="menuitem"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/activities"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Activities page"
              role="menuitem"
            >
              Activities
            </Link>
          </li>
          <li>
            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              aria-label="Go to Help page"
              role="menuitem"
            >
              Help
            </Link>
          </li>
        </ul>
      </div>
      {/* overlay for mobile menu */}
      {isOpen && (
        <div
          className="navbar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
