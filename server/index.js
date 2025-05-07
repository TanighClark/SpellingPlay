import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { activities } from './data/activities.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const allowedOrigins = [
  'https://spelling-play.vercel.app',
  'https://spelling-app.fly.dev',
  'http://localhost:5174', // Include localhost during development
];

app.use(
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
);
console.log('API Key:', process.env.OPENAI_API_KEY);
app.use(express.json());

const PORT = process.env.PORT || 8080;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// -------- Helpers --------

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
    const resp = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const content = resp.choices[0].message.content.trim();
    console.log('Raw OpenAI Response:', content);

    return JSON.parse(content);
  } catch (err) {
    console.error('Error in generateSentences:', err.message);
    throw new Error(`Error generating sentences: ${err.message}`);
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
app.post('/api/generate-pdf', async (req, res) => {
  let browser;

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
      scrambledWords: () =>
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

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${listName || 'worksheet'}_${activity}.pdf"`
    );

    const pdfStream = await page.createPDFStream({
      format: 'Letter',
      printBackground: true,
      margin: { top: '30px', bottom: '30px', left: '30px', right: '30px' },
    });

    pdfStream.pipe(res);

    pdfStream.on('error', (err) => {
      console.error('PDF Stream Error:', err);
      res.status(500).end();
    });
  } catch (err) {
    console.error('Error generating PDF:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
