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
        Format exactly as valid JSON.
        Each element should be an object with:
        - "sentence": the sentence with the word replaced by "_____"
        - "answer": the original word
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

// -------- Route with Streaming PDF --------
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { words, listName, activity } = req.body;
    const config = activities.find((a) => a.id === activity);

    if (!config) {
      throw new Error(`Unknown activity: ${activity}`);
    }

    const { title, directions } = config;

    const itemStrategies = {
      fillblank: () => generateSentences(words),
      scrambledWords: () =>
        words.map((word) => ({
          sentence: word
            .split('')
            .sort(() => Math.random() - 0.5)
            .join(''),
          answer: word,
        })),
      default: () => words.map((word) => ({ sentence: word, answer: word })),
    };

    const items = await (itemStrategies[activity] || itemStrategies.default)();
    const templatePath = path.join(__dirname, 'templates', `${activity}.ejs`);

    const html = await ejs.renderFile(templatePath, {
      title,
      directions,
      wordBank: words,
      items,
    });

    const browser = await puppeteer.launch({
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

    pdfStream.on('end', async () => {
      await browser.close();
    });

    pdfStream.on('error', (err) => {
      console.error('PDF Stream Error:', err);
      res.status(500).end();
    });
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Spelling Play Server is running.');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
