// client/src/pages/WordEntry.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/WordEntry.css';

export default function WordEntry() {
  const [words, setWords] = useState('');
  const [listName, setListName] = useState('');
  const [saveList, setSaveList] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const raw = words
      .split(/[\n,]+/)
      .map((w) => w.trim())
      .filter(Boolean);
    const uniqueWords = Array.from(new Set(raw));
    navigate('/activities', {
      state: { words: uniqueWords, listName, saveList },
    });
  };

  return (
    <div className="word-entry-container">
      <h1 className="word-entry-header">Enter Your Spelling Words</h1>
      <form onSubmit={handleSubmit} className="word-entry-form">
        <div>
          <label htmlFor="words">Words</label>
          <textarea
            id="words"
            className="word-entry-textarea"
            placeholder="One word per line or separated by commas"
            value={words}
            onChange={(e) => setWords(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="listName">List Name (optional)</label>
          <input
            id="listName"
            type="text"
            className="word-entry-input"
            placeholder="e.g. ‘Weekend Vocab’"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </div>

        <div className="word-entry-checkbox">
          <input
            id="saveList"
            type="checkbox"
            checked={saveList}
            onChange={() => setSaveList((v) => !v)}
          />
          <label htmlFor="saveList">Save this list</label>
        </div>

        <button type="submit" className="word-entry-button">
          Next
        </button>
      </form>
    </div>
  );
}
