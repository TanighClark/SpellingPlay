# Spell & Play

**Spell & Play** is a web application that lets teachers, parents, and students create custom printable spelling worksheets (fill-in-the-blank, word search, scramble words, etc.) from their own word lists. It consists of:

1. **Client**: A React/Vite front-end deployed on Vercel.
2. **Server**: An Express API using OpenAI & Puppeteer to generate PDF worksheets, deployed on Fly.io.

---

## Features

* Create multiple activity types: Fill in the Blank, Word Search, Word Scramble, etc.
* Preview worksheets in-browser before downloading.
* Download high-quality PDF worksheets for printing.

---

## Folder Structure

```
spelling-app/
├── client/         # React front-end
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.png
│   └── src/
│       └── pages/
│           ├── Preview.jsx
│           ├── ActivityPicker.jsx
│           └── WordEntry.jsx
└── server/         # Express back-end
    ├── templates/  # EJS templates for each activity
    ├── index.js    # API implementation
    ├── Dockerfile  # Production Docker setup
    └── fly.toml    # Fly.io config
```

---

## Getting Started

### Prerequisites

* Node.js v18+
* npm
* Docker (for local server PDF generation)

### Local Development

1. **Clone the repo**:

   ```bash
   git clone https://github.com/YourUsername/SpellingPlay.git
   cd SpellingPlay
   ```

2. **Set up environment variables**:

   * `client/.env`:

     ```bash
     VITE_API_URL=http://localhost:8080
     ```
   * `server/.env`:

     ```bash
     OPENAI_API_KEY=sk-xxxYOURKEYxxx
     PORT=8080
     ```

3. **Install dependencies**:

   ```bash
   # In project root
   cd client && npm install
   cd ../server && npm install
   ```

4. **Run the server**:

   ```bash
   cd server
   npm run dev
   ```

5. **Run the client**:

   ```bash
   cd client
   npm run dev
   ```

6. **Open** `http://localhost:5173` in your browser.

---

## Building & Deployment

### Server (Fly.io)

1. **Configure secrets**:

   ```bash
   fly secrets set OPENAI_API_KEY=sk-xxxYOURKEYxxx
   ```
2. **Build & deploy**:

   ```bash
   cd server
   flyctl deploy
   ```

### Client (Vercel)

1. **Set environment variables** in your Vercel dashboard:

   * `VITE_API_URL = https://<your-fly-app>.fly.dev`
2. **Deploy** your client by pushing to the connected Git branch.

---

## Usage

1. Navigate to the app.
2. Enter your word list and select an activity.
3. Preview the worksheet PDF.
4. Download and print.

---

## License

MIT © Your Name
