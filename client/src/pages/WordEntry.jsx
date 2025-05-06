import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/WordEntry.css'; // Import your CSS file

export default function WordEntry() {
  const [words, setWords] = useState('');
  const [listName, setListName] = useState('');
  const [saveList, setSaveList] = useState(false);
  const navigate = useNavigate();

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
    <div className="landing-container">
      <section className="hero-section">
        <div className="hero-text">
          <h1>
            Make Spelling <br></br>Practice Fun
          </h1>
          <p>
            Improve your spelling skills with engaging printable activities.
          </p>
          <a href="#entry-form" className="get-started-btn">
            Get Started
          </a>
        </div>
        <div className="hero-image">
          <img src="/images/hero-boy.png" alt="Kid practicing spelling" />
        </div>
      </section>

      <section className="stats-section">
        <h2>10,000+</h2>
        <p>Lists created by users</p>
      </section>

      <section className="how-it-works">
        <h2>Get Started in 3 Easy Steps</h2>
        <p>
          Spell & Play makes practicing spelling quick and simple. Here’s how:
        </p>
        <div className="steps">
          <div className="step">
            <img src="/images/icon-pencil.png" alt="Enter words" />
            <h3>1. Enter Words</h3>
            <p>Type or paste your spelling list into the box.</p>
          </div>
          <div className="step">
            <img src="/images/icon-click.png" alt="Choose activity" />
            <h3>2. Choose an Activity</h3>
            <p>Select from fun printable worksheets or games.</p>
          </div>
          <div className="step">
            <img src="/images/icon-download.png" alt="Download" />
            <h3>3. Download & Play</h3>
            <p>Print or save your activity. Ready to go!</p>
          </div>
        </div>
      </section>

      <section id="entry-form" className="entry-form-section">
        <h2>Enter your own spelling words</h2>
        <p>Create a custom practice list, then save it for future use.</p>

        <form onSubmit={handleSubmit} className="word-entry-form">
          <textarea
            placeholder="e.g. hare, monkey, cat, chair"
            value={words}
            onChange={(e) => setWords(e.target.value)}
            className="word-entry-textarea"
          />

          <input
            type="text"
            placeholder="List name (optional)"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="word-entry-input"
          />

          <label className="word-entry-checkbox">
            <input
              type="checkbox"
              checked={saveList}
              onChange={() => setSaveList((v) => !v)}
            />
            Save this list
          </label>

          {wordsPreview.length > 0 && (
            <div className="words-preview">
              <h4>Words Preview:</h4>
              <ul>
                {wordsPreview.map((word, i) => (
                  <li key={i}>
                    <strong>{word}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="word-entry-button">
            Generate Activities
          </button>
        </form>
      </section>
    </div>
  );
}
