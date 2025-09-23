import React, { useState, useEffect } from 'react';
import Meta from '../components/Meta';
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

  // store the blob URL for our PDF and image preview (for iOS)
  const [pdfUrl, setPdfUrl] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);
  const [supportsInlinePdf, setSupportsInlinePdf] = useState(true);

  useEffect(() => {
    // Detect environments where inline PDF preview is unreliable (iOS Safari)
    try {
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      setSupportsInlinePdf(!isIOS);
    } catch (_) {
      setSupportsInlinePdf(true);
    }

    async function checkHealth() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const healthUrl = baseUrl ? `${baseUrl}/api/health` : `/api/health`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(healthUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        setServerOnline(res.ok);
      } catch (_) {
        setServerOnline(false);
      }
    }

    async function sleep(ms) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function fetchPdf() {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL;

        const endpoint = baseUrl
          ? `${baseUrl}/api/generate-pdf`
          : `/api/generate-pdf`;

        // up to 3 attempts with short backoff to ride out warm-ups
        const MAX_RETRIES = 2;
        let attempt = 0;
        let lastErr;
        while (attempt <= MAX_RETRIES) {
          try {
            // Abort fetch if it hangs too long
            const controller = new AbortController();
            const timeoutMs = attempt === 0 ? 15000 : 12000; // give first try longer
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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

            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

            const blob = await resp.blob();
            if (blob.type !== 'application/pdf') {
              throw new Error(`Unexpected content type: ${blob.type}`);
            }

            const objectUrl = URL.createObjectURL(blob);
            setPdfUrl(objectUrl);
            setServerOnline(true);
            lastErr = undefined;
            break; // success
          } catch (e) {
            lastErr = e;
            if (attempt === MAX_RETRIES) break;
            // brief backoff then retry
            await sleep(1000 + attempt * 1000);
            attempt += 1;
          }
        }
        if (lastErr) throw lastErr;
      } catch (err) {
        console.error('PDF fetch failed:', err);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    }

    checkHealth();
    fetchPdf();
    // Also fetch a PNG preview image for environments where inline PDFs are unreliable
    async function fetchImagePreview() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const endpoint = baseUrl
          ? `${baseUrl}/api/generate-preview`
          : `/api/generate-preview`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
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

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        if (!blob.type.startsWith('image/')) throw new Error('Unexpected preview type');
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } catch (e) {
        setImgUrl(null);
      }
    }

    if (!supportsInlinePdf) fetchImagePreview();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [words, listName, activity, title, directions, supportsInlinePdf]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${listName || 'activity'}_${activity}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const openPreviewInNewTab = () => {
    if (!pdfUrl) return;
    const opened = window.open(pdfUrl, '_blank', 'noopener');
    if (!opened) {
      // fallback: navigate in the same tab
      window.location.href = pdfUrl;
    }
  };

  return (
    <section className="preview-page" aria-labelledby="preview-title">
      <Meta
        title={`${title || 'Worksheet'} — Preview | Spell & Play`}
        description={`Preview and download a printable ${
          title || 'worksheet'
        } for ${listName || 'your spelling list'} (${words.length} words).`}
      />
      <p id="preview-description" className="sr-only">
        Your worksheet preview. Use the Download PDF button to save a copy.
      </p>
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
            supportsInlinePdf ? (
              <iframe
                src={pdfUrl}
                title={`Preview of ${title} worksheet`}
                width="100%"
                height="500"
                loading="lazy"
                aria-describedby="preview-description"
              />
            ) : (
              imgUrl ? (
                <img
                  src={imgUrl}
                  alt="Worksheet preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div className="placeholder" role="status" aria-live="polite">
                  PDF preview isn’t supported on this device.
                  <br />
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 8 }}
                    onClick={openPreviewInNewTab}
                  >
                    Open Preview
                  </button>
                </div>
              )
            )
          ) : (
            <div className="placeholder" role="status" aria-live="polite">
              We’re having trouble connecting. Please try again.
            </div>
          )}
        </figure>

        <div className="preview-details">
          {(loading || !pdfUrl) && (
            <div
              aria-live="polite"
              style={{
                marginBottom: 8,
                fontSize: 12,
                color: !loading ? '#b91c1c' : undefined,
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: loading ? '#16a34a' : '#b91c1c',
                  marginRight: 6,
                }}
              />
              {loading
                ? 'Preparing your worksheet…'
                : 'Having trouble connecting. Please try again.'}
            </div>
          )}
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
            {!supportsInlinePdf && pdfUrl && (
              <button
                className="btn btn-secondary"
                onClick={openPreviewInNewTab}
                aria-label="Open PDF preview in a new tab"
              >
                Open Preview
              </button>
            )}
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
