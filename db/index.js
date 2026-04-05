import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'words.db');

let db;

export function getDb() {
  if (db) return db;

  if (!existsSync(DB_PATH)) {
    throw new Error(`Database not found at ${DB_PATH}. Run "npm run seed" to initialize it.`);
  }

  db = new Database(DB_PATH, { readonly: true });
  return db;
}
