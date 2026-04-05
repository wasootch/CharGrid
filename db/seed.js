import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'words.db');
const WORDS_FILE = join(__dirname, '..', 'words5.txt');
const USED_FILE = join(__dirname, '..', 'words_used.txt');

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS words (word TEXT PRIMARY KEY);
  CREATE TABLE IF NOT EXISTS past_answers (word TEXT PRIMARY KEY);
`);

function seedTable(table, file) {
  const words = readFileSync(file, 'utf8')
    .split('\n')
    .map(w => w.trim().toLowerCase())
    .filter(w => w.length === 5);

  const insert = db.prepare(`INSERT OR IGNORE INTO ${table} (word) VALUES (?)`);
  const count = db.transaction(() => {
    let n = 0;
    for (const w of words) { insert.run(w); n++; }
    return n;
  })();

  console.log(`Seeded ${count} words into '${table}' from ${file}`);
}

seedTable('words', WORDS_FILE);
seedTable('past_answers', USED_FILE);

db.close();
