import { useMemo, useState } from 'react';

export default function Help() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const nextUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/help?sent=1`;
  }, []);

  const urlParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const sent = urlParams?.get('sent') === '1';

  return (
    <div className="help-page">
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <h1
            className="section-title"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 44px)',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: 24,
            }}
          >
            Help & Support
          </h1>

          <div
            className="card"
            style={{ textAlign: 'left', maxWidth: 900, margin: '0 auto' }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: 8,
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Getting Started
            </h2>
            <ul
              style={{
                paddingLeft: 18,
                lineHeight: 1.9,
                color: '#0f172a',
                marginTop: 8,
              }}
            >
              <li>
                <strong>Enter your words →</strong> Paste or write your weekly
                spelling words.
              </li>
              <li>
                <strong>Pick activities →</strong> Choose from
                fill-in-the-blank, scrambles, word search, and more.
              </li>
              <li>
                <strong>Generate & print →</strong> Click Generate and download
                a ready-to-print PDF.
              </li>
            </ul>
            <p style={{ marginTop: 8, color: '#0f172a' }}>
              That’s it—no logins, no dashboards, no extra setup.
            </p>

            <h2
              style={{
                marginTop: 24,
                marginBottom: 8,
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Tips for Best Results
            </h2>
            <ul style={{ paddingLeft: 18, lineHeight: 1.9, color: '#0f172a' }}>
              <li>Each word should be on its own line.</li>
              <li>Make sure to add your childs spelling list.</li>
              <li>
                Printing works best on desktop, but mobile devices are supported
                too.
              </li>
              <li>The download preview may take a moment to load.</li>
            </ul>
            <h2
              style={{
                marginTop: 24,
                marginBottom: 8,
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              AI & Privacy
            </h2>
            <p style={{ color: '#0f172a', margin: '8px 0 6px' }}>
              Some activities may use AI to generate example sentences. This is
              optional and worksheets still generate without AI.
            </p>
            <ul style={{ paddingLeft: 18, lineHeight: 1.9, color: '#0f172a' }}>
              <li>
                What’s sent: only your word list and brief instructions to
                create example sentences.
              </li>
              <li>
                We don’t store AI prompts. Any temporary handling is governed by
                the provider’s policy.
              </li>
              <li>
                Prefer not to use AI? Choose activities that don’t use Fill In
                The Blank activity, and no AI calls are made.
              </li>
            </ul>

            <h2
              style={{
                marginTop: 24,
                marginBottom: 8,
                fontSize: '1.375rem',
                fontWeight: 700,
                color: '#0f172a',
              }}
            >
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <h3
                  style={{
                    margin: '12px 0 6px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Do I need an account?
                </h3>
                <p style={{ color: '#0f172a', margin: 0 }}>
                  Nope. SpellPlay is designed to be fast and barrier-free.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    margin: '12px 0 6px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  What if my worksheet looks empty?
                </h3>
                <p style={{ color: '#0f172a', margin: 0 }}>
                  Double-check that you have entered your word list.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    margin: '12px 0 6px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Can I reuse word lists?
                </h3>
                <p style={{ color: '#0f172a', margin: 0 }}>
                  Yes, you can paste in any list you’ve used before, it’ll
                  generate a fresh worksheet each time.
                </p>
              </div>
              <div>
                <h3
                  style={{
                    margin: '12px 0 6px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0f172a',
                  }}
                >
                  Is my data stored?
                </h3>
                <p style={{ color: '#0f172a', margin: 0 }}>
                  No. We don’t store your data. Your word list and PDF are
                  processed in-memory and discarded. A short-lived cache (about
                  5 minutes) speeds up immediate retries, then it’s wiped.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: '#f3f4f6' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: '#0f172a' }}>
            Need Help? Contact Us
          </h2>

          {sent && (
            <div
              className="card"
              style={{
                maxWidth: 700,
                margin: '0 auto 16px',
                padding: 12,
                background: '#dcfce7',
                color: '#166534',
                borderRadius: 8,
              }}
            >
              Thanks! Your message has been sent.
            </div>
          )}
          <div></div>

          <form
            action="https://formsubmit.co/b95316bed3a9cb060204f8b64e259d13"
            method="POST"
            className="card form"
            style={{ maxWidth: 700, margin: '0 auto' }}
          >
            <input type="hidden" name="_next" value={nextUrl} />
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="hidden"
              name="_subject"
              value="SpellPlay Help: New message"
            />
            <input type="hidden" name="_template" value="box" />
            <input
              type="text"
              name="_honey"
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">How can we help?</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
