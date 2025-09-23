import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WordEntry.css'; // <-- scoped styles for this page only

export default function WordEntry() {
  const [words, setWords] = useState('');
  const [listName, setListName] = useState('');
  const [saveList, setSaveList] = useState(false);
  const navigate = useNavigate();

  // if you still keep AOS on the site, this won't break if it's missing
  useEffect(() => {
    if (window.AOS) window.AOS.init({ duration: 800, once: true });
  }, []);

  const wordsPreview = words
    .split(/[\n,\s]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    const uniqueWords = Array.from(new Set(wordsPreview));
    const finalListName =
      listName.trim() || `List - ${new Date().toLocaleDateString()}`;
    if (uniqueWords.length === 0) {
      alert('Please enter at least one word.');
      return;
    }
    navigate('/activities', {
      state: { words: uniqueWords, listName: finalListName, saveList },
    });
  };

  return (
    <div className="landing">
      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-row">
            <div className="hero-text">
              <h1 className="hero-title">
                Effortless Spelling Practice Kids Enjoy
              </h1>
              <p className="hero-sub">
                Turn any word list into fun, printable activities that make
                learning stick.
              </p>
              <a href="#create-list" className="btn-cta">
                Paste My Word List
                <svg
                  className="icon-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>

            <div className="hero-image">
              {/* Put your image at: client/public/images/hero.png */}
              <img
                src="/images/hero.PNG"
                alt="Parent helping child with spelling practice"
                loading="lazy"
                width="1200"
                height="800"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section features" id="features">
        <div className="container">
          <h2 className="section-title">Professional-Grade Features</h2>

          <div className="features-grid">
            <Card
              title="Instant Worksheet Creation"
              text="Generate professional worksheets from any word list in seconds."
              icon="doc"
            />
            <Card
              title="Game-Based Activities"
              text="Fill-in-the-blank, word scrambles, and engaging word searches."
              icon="game"
            />
            <Card
              title="Printable PDFs"
              text="No logins, no ads, no distractions. Just ready-to-use materials."
              icon="printer"
            />
            <Card
              title="Time-Saving Design"
              text="Perfect for busy parents, teachers, and tutors on tight schedules."
              icon="clock"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section stats">
        <div className="container">
          <div className="stats-box">
            <h2>10,000+</h2>
            <p className="stats-sub">Weekly Spelling Lists Processed</p>
            <p className="stats-small">
              Helping children turn lists into learning, one activity at a time
            </p>
          </div>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="section why">
        <div className="container">
          <h2 className="section-title">Why SpellPlay Delivers Results</h2>

          <div className="why-grid">
            <Why
              title="Sustained Motivation"
              text="Children stay engaged because practice feels like enjoyable play."
            />
            <Why
              title="Time Efficiency"
              text="Parents & teachers reclaim hours of valuable preparation time."
            />
            <Why
              title="Confidence Building"
              text="Reinforces learning through strategic repetition and variety."
            />
            <Why
              title="Trusted Solution"
              text="Relied upon by families and educational professionals nationwide."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how" id="how-it-works">
        <div className="container">
          <h2 className="section-title">Get Started in 3 Easy Steps</h2>

          <div className="how-grid">
            <Step
              step={1}
              title="1. Drop in Your Word List"
              text="Copy and paste your weekly spelling words into our tool."
            />
            <Step
              step={2}
              title="2. Choose Activities"
              text="Select from fun, engaging practice exercises that feel like play."
            />
            <Step
              step={3}
              title="3. Print & Practice"
              text="Get ready-to-use materials instantly, no logins or dashboards."
            />
          </div>
        </div>
      </section>

      {/* CREATE LIST */}
      <section className="section create" id="create-list">
        <div className="container">
          <div className="create-inner">
            <h2 className="section-title light">
              Create Your Spelling Practice Now
            </h2>
            <p className="create-sub">
              Transform your word list into engaging, printable activities,ready
              in under a minute.
            </p>

            <div className="card">
              <p className="card-lead">
                Professional tools for parents and educators—quick setup,
                quality results, no distractions.
              </p>

              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="list-name">List Title (Optional)</label>
                  <input
                    id="list-name"
                    type="text"
                    placeholder="Week 1 Spelling Words"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="word-list">Paste Your Spelling Words</label>
                  <textarea
                    id="word-list"
                    rows={6}
                    placeholder="Paste your weekly spelling list here (one word per line)..."
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                  />
                </div>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={saveList}
                    onChange={() => setSaveList((v) => !v)}
                    aria-checked={saveList}
                  />
                  <span>Save this list</span>
                </label>

                {wordsPreview.length > 0 && (
                  <div className="preview" aria-live="polite">
                    <h4>Words Preview:</h4>
                    <ul className="preview-grid">
                      {wordsPreview.map((w, i) => (
                        <li key={i}>
                          <strong>{w}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button type="submit" className="submit-btn">
                  <svg
                    className="icon-download"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v10m0 0l-4-4m4 4l4-4M5 19h14"
                    />
                  </svg>
                  Generate Practice Activities
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Global footer is rendered by App layout */}
    </div>
  );
}

/* ---------- small presentational helpers ---------- */
function Card({ title, text, icon }) {
  return (
    <div className="card">
      <div className="icon-circle">
        {icon === 'doc' && (
          <svg viewBox="0 0 24 24" className="icon">
            <path
              d="M4 6h16v12H4zM9 8h6M9 12h6M9 16h6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
        {icon === 'game' && (
          <svg viewBox="0 0 24 24" className="icon">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="3"
              ry="3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
          </svg>
        )}
        {icon === 'printer' && (
          <svg viewBox="0 0 24 24" className="icon">
            <rect
              x="6"
              y="9"
              width="12"
              height="8"
              rx="2"
              ry="2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="8"
              y="4"
              width="8"
              height="4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <rect
              x="8"
              y="14"
              width="8"
              height="6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
        {icon === 'clock' && (
          <svg viewBox="0 0 24 24" className="icon">
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 7v5l3 3"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}

function Why({ title, text }) {
  return (
    <div className="why-item">
      <div className="tick">
        <svg viewBox="0 0 24 24" className="icon-small">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <h3>{title}</h3>
        <p className="muted">{text}</p>
      </div>
    </div>
  );
}

function Step({ title, text, step }) {
  return (
    <div className="card step">
      <div className="icon-circle" aria-label={`Step ${step}`}>
        <span className="icon-number">{step ?? ''}</span>
      </div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}
