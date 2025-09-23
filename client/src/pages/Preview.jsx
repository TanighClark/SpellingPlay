import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Preview.css';

export default function Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { words, listName, activity, title, directions } = state || {};

  // redirect home if no data
  useEffect(() => {
    if (!words) navigate('/');
  }, [words, navigate]);

  if (!words) return null;

  // store the blob URL for our PDF
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const healthUrl = baseUrl ? `${baseUrl}/api/health` : `/api/health`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(healthUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        setServerOnline(res.ok);
      } catch (_) {
        setServerOnline(false);
      }
    }

    async function fetchPdf() {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL;

        const endpoint = baseUrl
          ? `${baseUrl}/api/generate-pdf`
          : `/api/generate-pdf`;

        // Abort fetch if it hangs too long
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            words,
            listName,
            activity,
            title,
            directions,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!resp.ok)
          throw new Error(`PDF generation failed: ${resp.statusText}`);

        const blob = await resp.blob();

        // Verify the content type
        if (blob.type !== 'application/pdf') {
          console.error('Unexpected content type:', blob.type);
          throw new Error('Failed to generate a valid PDF.');
        }

        const objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      } catch (err) {
        console.error('PDF fetch failed:', err);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
    fetchPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [words, listName, activity, title, directions]);

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
    <section className="preview-page" aria-labelledby="preview-title">
      <h1 id="preview-title" className="preview-title">
        {title} is Ready!
      </h1>

      <div className="preview-panel">
        <figure className="pdf-thumbnail" aria-label="Worksheet Preview">
          {loading ? (
            <div className="placeholder" role="status" aria-live="polite">
              Loading preview…
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={`Preview of ${title} worksheet`}
              width="100%"
              height="500"
              loading="lazy"
              aria-describedby="preview-description"
            />
          ) : (
            <div className="placeholder" role="status" aria-live="polite">
              Failed to load preview.
              {!serverOnline && (
                <div style={{ marginTop: 8, color: '#b91c1c' }}>
                  Server is offline. Please try again shortly.
                </div>
              )}
            </div>
          )}
        </figure>

        <div className="preview-details">
          <div style={{ marginBottom: 8, fontSize: 12 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: serverOnline ? '#16a34a' : '#b91c1c',
                marginRight: 6,
              }}
            />
            {serverOnline ? 'Server online' : 'Server offline'}
          </div>
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

          <div className="preview-actions">
            <button
              className="btn btn-primary"
              onClick={handleDownload}
              aria-label="Download the worksheet PDF"
              disabled={!pdfUrl}
            >
              Download PDF
            </button>
            {!pdfUrl && (
              <button
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
                aria-label="Retry loading the preview"
              >
                Retry
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate('/activities', { state: { words, listName } })
              }
              aria-label="Create a new worksheet activity"
            >
              Try Another Activity
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
