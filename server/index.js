import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { activities } from './data/activities.js';
import nodemailer from 'nodemailer';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const allowedOrigins = [
  'https://spelling-play.vercel.app',
  'https://spelling-app.fly.dev',
  'http://localhost:5173',
  'https://www.spelling-play.vercel.app', // Example for subdomain
];

/*app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  })
);*/

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// -------- Helpers --------

// Reuse a single Puppeteer browser to avoid cold-start overhead per request
let browserPromise;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--no-zygote',
        '--disable-gpu',
      ],
    });
  }
  return browserPromise;
}

// Simple in-memory cache for recently generated PDFs
const PDF_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const pdfCache = new Map(); // key -> { buffer, expiresAt }
function getCacheKey({ words, listName, activity }) {
  return JSON.stringify({ w: words, l: listName, a: activity });
}

function withTimeout(promise, ms, label = 'operation') {
  let id;
  const timeout = new Promise((_, reject) => {
    id = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(id));
}

async function generateSentences(words) {
  const messages = [
    {
      role: 'system',
      content:
        'You are an assistant that returns a JSON array of fill-in-the-blank sentences.',
    },
    {
      role: 'user',
      content: `Words: ${JSON.stringify(words)}
      Format strictly as a JSON array.
      Each element should be an object with:
      - "sentence": a sentence with the word replaced by "_____"
      - "answer": the original word
      Only return the JSON array.`,
    },
  ];

  try {
    const response = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-4o-mini', // or gpt-4, etc.
        messages, // use your full messages array
        max_tokens: 500,
        temperature: 0.7,
      }),
      8000,
      'OpenAI generation'
    );

    let content = response.choices[0].message.content.trim();
    console.log('Raw OpenAI Response:', content);

    // Strip code fences if present:
    content = content
      .replace(/^```json\s*/, '') // remove leading ```json
      .replace(/```$/m, ''); // remove trailing ```
    console.log('Cleaned JSON payload:', content);

    return JSON.parse(content);
  } catch (err) {
    console.warn('OpenAI unavailable, using fallback sentences:', err.message);
    return words.map((word) => ({
      sentence: `Use the word _____ in a sentence.`,
      answer: word,
    }));
  }
}

function scrambleWord(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

function hideLetters(word, numMissing = 2) {
  const indices = [];
  while (indices.length < numMissing && indices.length < word.length) {
    const idx = Math.floor(Math.random() * word.length);
    if (!indices.includes(idx)) indices.push(idx);
  }

  return word
    .split('')
    .map((ch, i) => (indices.includes(i) ? '_' : ch))
    .join('');
}

function generateWordSearchGrid(words, size = 15) {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
  ];

  const placeWord = (word) => {
    for (let attempts = 0; attempts < 100; attempts++) {
      const dir = directions[Math.floor(Math.random() * directions.length)];
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      let r = row,
        c = col;
      let fits = true;

      for (let i = 0; i < word.length; i++) {
        if (
          r < 0 ||
          c < 0 ||
          r >= size ||
          c >= size ||
          (grid[r][c] && grid[r][c] !== word[i].toUpperCase())
        ) {
          fits = false;
          break;
        }
        r += dir[0];
        c += dir[1];
      }

      if (fits) {
        r = row;
        c = col;
        for (let i = 0; i < word.length; i++) {
          grid[r][c] = word[i].toUpperCase();
          r += dir[0];
          c += dir[1];
        }
        return true;
      }
    }
    return false;
  };

  words.forEach(placeWord);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
}

// -------- Route with Streaming PDF --------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: Date.now() });
});

app.post('/api/generate-pdf', async (req, res) => {
  let page;

  try {
    const { words, listName, activity } = req.body || {};
    console.log('Received request with activity:', activity);

    const config = activities.find((a) => a.id === activity);

    if (!config) {
      console.error(`Unknown activity: ${activity}`);
      return res.status(400).json({ error: `Unknown activity: ${activity}` });
    }

    const { title, directions } = config;

    const itemStrategies = {
      fillblank: () => generateSentences(words),
      scrambleWords: () =>
        words.map((word) => ({
          sentence: scrambleWord(word),
          answer: word,
        })),
      fillingInLetters: () =>
        words.map((word) => ({
          sentence: hideLetters(word, Math.min(3, Math.floor(word.length / 2))),
          answer: word,
        })),
      default: () => words.map((word) => ({ sentence: word, answer: word })),
    };

    const items = await (itemStrategies[activity] || itemStrategies.default)();
    const grid =
      activity === 'wordsearch' ? generateWordSearchGrid(words) : null;

    console.log('Generated items:', items);
    console.log('Generated grid:', grid);

    const templatePath = path.join(__dirname, 'templates', `${activity}.ejs`);

    const html = await ejs.renderFile(templatePath, {
      title,
      directions,
      wordBank: words,
      items,
      grid,
    });

    // Cache check
    const key = getCacheKey({ words, listName, activity });
    const cached = pdfCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${listName || 'worksheet'}_${activity}.pdf"`
      );
      return res.send(cached.buffer);
    }

    const browser = await getBrowser();
    page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // new code
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' },
    });

    // write to cache
    pdfCache.set(key, {
      buffer: pdfBuffer,
      expiresAt: Date.now() + PDF_CACHE_TTL_MS,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${listName || 'worksheet'}_${activity}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error('*** PDF ROUTE ERROR START ***');
    console.error(err); // full error + stack
    console.error('*** PDF ROUTE ERROR END ***');
    res.status(500).json({ error: err.message });
  } finally {
    if (page) {
      try {
        await page.close();
      } catch {}
    }
  }
});

// --- Contact form endpoint ---
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      CONTACT_TO,
      CONTACT_FROM,
    } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) {
      const missing = [
        !SMTP_HOST && 'SMTP_HOST',
        !SMTP_PORT && 'SMTP_PORT',
        !SMTP_USER && 'SMTP_USER',
        !SMTP_PASS && 'SMTP_PASS',
        !CONTACT_TO && 'CONTACT_TO',
      ].filter(Boolean);
      const baseMsg = 'Email is not configured.';
      const detail =
        process.env.NODE_ENV === 'production'
          ? ''
          : ` Missing: ${missing.join(', ')}`;
      return res.status(500).json({ error: baseMsg + detail });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const info = await transporter.sendMail({
      from: CONTACT_FROM || SMTP_USER,
      to: CONTACT_TO,
      subject: `SpellPlay Help: Message from ${name}`,
      replyTo: email,
      text: `From: ${name} <${email}>

${message}`,
    });

    res.json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('CONTACT ERROR:', err);
    const msg =
      process.env.NODE_ENV === 'production'
        ? 'Failed to send message.'
        : `Failed to send message: ${err.message}`;
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
