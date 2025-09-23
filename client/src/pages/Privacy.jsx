export default function Privacy() {
  return (
    <main className="section" style={{ background: '#fff' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title" style={{ textAlign: 'left' }}>
          Privacy
        </h1>
        <div className="card" style={{ textAlign: 'left' }}>
          <p>
            We don’t store your spelling lists or PDFs. Your words are processed
            in-memory to generate your worksheet and then discarded. We keep a
            short, in-memory cache (about 5 minutes) only to speed up immediate
            retries.
          </p>
          <p>
            PDFs are generated on demand and streamed to you; nothing is saved
            server-side. If you enable AI-generated sentences, only your words
            and minimal instructions are sent to our AI provider. We don’t store
            prompts, and any temporary handling follows the provider’s policy.
          </p>
          <p>
            Our contact form is powered by FormSubmit.co, which delivers your
            message to our inbox; retention is governed by their policy. We keep
            minimal operational logs and do not log your word lists or PDFs.
          </p>
        </div>
      </div>
    </main>
  );
}
