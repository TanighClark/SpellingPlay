import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



export default function WordEntry() {
  const [words, setWords] = useState('');
  const [listName, setListName] = useState('');
  const [saveList, setSaveList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize AOS if present (loaded via CDN in index.html)
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
    <div className="bg-gray-50">
      

      {/* Hero */}
      <section className="text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' }}>
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-10 w-full md:mb-0 md:w-1/2" data-aos="fade-right">
              <h1 className="text-4xl font-bold md:text-6xl">Effortless Spelling Practice Kids Enjoy</h1>
              <p className="mt-6 text-xl">Turn any word list into fun, printable activities that make learning stick.</p>
              <a
                href="#create-list"
                className="mt-8 inline-flex items-center rounded-full bg-white px-8 py-4 font-semibold text-blue-800 transition-colors hover:bg-gray-100"
              >
                Paste My Word List
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            <div className="w-full md:w-1/2" data-aos="fade-left">
              {/* Replace with your image in client/public/images */}
              <img
  src="/images/hero.PNG"
  alt="Parent helping child with spelling practice"
  className="mx-auto rounded-2xl shadow-2xl"
  width="1200"
  height="800"
  loading="lazy"
  decoding="async"
/>

            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl" data-aos="fade-up">
            Professional-Grade Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              title="Instant Worksheet Creation"
              text="Generate professional worksheets from any word list in seconds"
              delay={100}
              icon={
                <svg className="h-8 w-8 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h6M4 6h16v12H4z" />
                </svg>
              }
            />
            <FeatureCard
              title="Game-Based Activities"
              text="Fill-in-the-blank, word scrambles, and engaging word searches"
              delay={200}
              icon={
                <svg className="h-8 w-8 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              }
            />
            <FeatureCard
              title="Printable PDFs"
              text="No logins, no ads, no distractions. Just ready-to-use materials"
              delay={300}
              icon={
                <svg className="h-8 w-8 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
              }
            />
            <FeatureCard
              title="Time-Saving Design"
              text="Perfect for busy parents, teachers, and tutors on tight schedules"
              delay={400}
              icon={
                <svg className="h-8 w-8 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4 0h8" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto max-w-2xl" data-aos="fade-up">
            <h2 className="mb-4 text-5xl font-bold text-blue-800">10,000+</h2>
            <p className="text-xl text-gray-600">Weekly Spelling Lists Processed</p>
            <p className="mt-2 text-gray-500">Helping children turn lists into learning, one activity at a time</p>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl" data-aos="fade-up">
            Why SpellPlay Delivers Results
          </h2>
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
            <WhyItem title="Sustained Motivation" text="Children stay engaged because practice feels like enjoyable play" />
            <WhyItem title="Time Efficiency" text="Parents & teachers reclaim hours of valuable preparation time" />
            <WhyItem title="Confidence Building" text="Reinforces learning through strategic repetition and engaging variety" />
            <WhyItem title="Trusted Solution" text="Relied upon by families and educational professionals nationwide" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl" data-aos="fade-up">
            Get Started in 3 Easy Steps
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              step="1. Drop in Your Word List"
              text="Simply copy and paste your weekly spelling words into our tool."
              delay={100}
              icon={
                <svg className="h-10 w-10 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.5L20.5 7.5 7 21H3v-4L16.5 3.5z" />
                </svg>
              }
            />
            <StepCard
              step="2. Choose Activities"
              text="Select from fun, engaging practice exercises that feel like play."
              delay={200}
              icon={
                <svg className="h-10 w-10 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              }
            />
            <StepCard
              step="3. Print & Practice"
              text="Get ready-to-use materials instantly—no logins, ads, or complicated dashboards."
              delay={300}
              icon={
                <svg className="h-10 w-10 text-blue-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Create list (wired to your state + handleSubmit) */}
      <section id="create-list" className="bg-gradient-to-br from-blue-900 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-bold md:text-4xl" data-aos="fade-up">
              Create Your Spelling Practice Now
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl opacity-90" data-aos="fade-up" data-aos-delay="100">
              Transform your word list into engaging, printable activities—ready in under a minute
            </p>

            <div className="mx-auto rounded-2xl bg-white p-8 text-gray-800 shadow-2xl" data-aos="fade-up" data-aos-delay="200">
              <p className="mb-6 text-center text-gray-600">
                Professional tools for parents and educators—quick setup, quality results, no distractions
              </p>

              <form onSubmit={handleSubmit} className="grid gap-6 text-left">
                <div>
                  <label htmlFor="list-name" className="mb-2 block text-sm font-medium text-gray-700">
                    List Title (Optional)
                  </label>
                  <input
                    id="list-name"
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    placeholder="Week 1 Spelling Words"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="word-list" className="mb-2 block text-sm font-medium text-gray-700">
                    Paste Your Spelling Words
                  </label>
                  <textarea
                    id="word-list"
                    className="word-input w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Paste your weekly spelling list here (one word per line)..."
                    value={words}
                    onChange={(e) => setWords(e.target.value)}
                  />
                </div>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={saveList}
                    onChange={() => setSaveList((v) => !v)}
                    aria-checked={saveList}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Save this list</span>
                </label>

                {wordsPreview.length > 0 && (
                  <div aria-live="polite" className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="font-semibold">Words Preview:</h4>
                    <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 md:grid-cols-4">
                      {wordsPreview.map((word, i) => (
                        <li key={i} className="text-sm">
                          <strong>{word}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-900"
                >
                  {/* download icon */}
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v10m0 0l-4-4m4 4l4-4M5 19h14" />
                  </svg>
                  Generate Practice Activities
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <span className="comic-font text-2xl font-bold">SpellPlay</span>
            <p className="mt-4 text-gray-400">Simple, effective spelling practice tools for parents and teachers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- small presentational helpers --- */
function FeatureCard({ title, text, delay = 0, icon }) {
  return (
    <div className="text-center" data-aos="fade-up" data-aos-delay={delay}>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  );
}

function WhyItem({ title, text }) {
  return (
    <div className="flex items-start" data-aos="fade-up">
      <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function StepCard({ step, text, icon, delay = 0 }) {
  return (
    <div className="activity-card rounded-2xl bg-white p-8 text-center shadow transition-all" data-aos="fade-up" data-aos-delay={delay}>
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{step}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}
