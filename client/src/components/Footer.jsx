import '../pages/styles/Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <span className="brand">SpellPlay</span>
          <p className="muted">
            Simple, effective spelling practice tools for parents and teachers.
          </p>
        </div>
        <div className="footer-meta">
          <span>© {year} SpellPlay</span>
        </div>
      </div>
    </footer>
  );
}
