import express from 'express';
import { getDb } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/words', (req, res) => {
  const correct   = Array.isArray(req.query.correct)   ? req.query.correct   : Array(5).fill('');
  const misplaced = Array.isArray(req.query.misplaced) ? req.query.misplaced : Array(5).fill('');
  const excluded  = (req.query.excluded || '').toUpperCase().split('').filter(Boolean);

  const mustInclude = misplaced.map(l => l.toUpperCase()).filter(Boolean);

  const db = getDb();
  const rows = db.prepare(`
    SELECT w.word, pa.word IS NOT NULL AS past_answer
    FROM words w
    LEFT JOIN past_answers pa ON pa.word = w.word
  `).all();

  const results = rows
    .filter(({ word }) => {
      const w = word.toUpperCase();
      for (let i = 0; i < 5; i++) {
        if (correct[i] && w[i] !== correct[i].toUpperCase()) return false;
      }
      for (let i = 0; i < 5; i++) {
        const m = misplaced[i] ? misplaced[i].toUpperCase() : '';
        if (m) {
          if (!w.includes(m)) return false;
          if (w[i] === m) return false;
        }
      }
      for (const letter of excluded) {
        if (mustInclude.includes(letter)) continue;
        if (w.toUpperCase().includes(letter)) return false;
      }
      return true;
    })
    .map(({ word, past_answer }) => ({ word: word.toUpperCase(), pastAnswer: !!past_answer }));

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
