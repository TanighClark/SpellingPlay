import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Preview.css';

export default function Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { words, listName, activity, title, directions } = state || {};

  // redirect home if no data
  if (!words) {
    navigate('/');
    return null;
  }

  // store the blob URL for our PDF
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch the PDF once, on mount
  useEffect(() => {
    async function fetchPdf() {
      try {
        const resp = await fetch(
          'https://spelling-app.fly.dev/api/generate-pdf',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              words,
              listName,
              activity,
              title,
              directions,
            }),
          }
        );
        if (!resp.ok) throw new Error(resp.statusText);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('PDF fetch failed:', err);
      }
    }
    fetchPdf();

    // cleanup URL on unmount
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [words, listName, activity, title, directions]);

  // Handler for download (reuses our blob URL)
  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${listName || 'activity'}_${activity}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="preview-page">
      <h1 className="preview-title">{title} is Ready!</h1>

      <div className="preview-panel">
        {/* left: PDF thumbnail */}
        <div className="pdf-thumbnail">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#zoom=page-width`}
              title="Worksheet Preview"
            />
          ) : (
            <div className="placeholder">Loading preview…</div>
          )}
        </div>

        {/* right: Details list */}
        <div className="preview-details">
          <dl>
            <dt>Activity:</dt>
            <dd>{title}</dd>

            <dt>List Name:</dt>
            <dd>{listName || '—'}</dd>

            <dt>Word Count:</dt>
            <dd>{words.length}</dd>

            <dt>Directions:</dt>
            <dd>{directions}</dd>
          </dl>

          {/* bottom: side-by-side buttons */}
          <div className="preview-actions">
            <button className="btn btn-primary" onClick={handleDownload}>
              Download PDF
            </button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate('/activities', { state: { words, listName } })
              }
            >
              Try Another Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
