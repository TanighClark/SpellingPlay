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
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

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
      content: `
Words: ${JSON.stringify(words)}

Format exactly as valid JSON.
Each element should be an object with:
- "sentence": the sentence with the word replaced by "_____"
- "answer": the original word

Example:
[
  { "sentence": "The small fluffy_____ dog ran down the street fast.", "answer": "quick" },
  ...
]
`,
    },
  ];

  const resp = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return JSON.parse(resp.choices[0].message.content.trim());
}

function scrambleWord(word) {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
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

// -------- Route --------
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { words, listName, activity } = req.body;
    const config = activities.find((a) => a.id === activity);
    if (!config) throw new Error(`Unknown activity: ${activity}`);
    const { title, directions } = config;

    const itemStrategies = {
      fillblank: () => generateSentences(words),
      scrambledWords: () =>
        words.map((word) => ({ sentence: scrambleWord(word), answer: word })),
      default: () => words.map((word) => ({ sentence: word, answer: word })),
      fillingInLetters: () =>
        words.map((word) => ({
          sentence: hideLetters(word, Math.min(3, Math.floor(word.length / 2))),
          answer: word,
        })),
    };

    const items = await (itemStrategies[activity] || itemStrategies.default)();
    const grid =
      activity === 'wordsearch' ? generateWordSearchGrid(words) : null;
    const templatePath = path.join(__dirname, 'templates', `${activity}.ejs`);

    const html = await ejs.renderFile(templatePath, {
      title,
      directions,
      wordBank: words,
      items,
      grid,
    });

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: { top: '50px', bottom: '50px', left: '50px', right: '50px' },
    });

    await browser.close();

    res
      .status(200)
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${
          listName || 'worksheet'
        }_${activity}.pdf"`,
      })
      .send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Spelling Play Server is running.');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
