# CharGrid

A Wordle helper that filters possible words based on what you know.

## Features

- Enter **green** letters (correct position), **yellow** letters (wrong position), and **gray** letters (not in word) to filter matching words
- Past Wordle answers are shown dimmed with a strikethrough — they're less likely to appear again
- Keyboard navigation: arrow keys move between letter boxes, Enter submits

## Setup

**First time only** — seed the word database:

```bash
npm install
npm run seed
```

## Running

```bash
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

## Word Lists

| File | Description |
|------|-------------|
| `words5.txt` | Full list of valid 5-letter words (~14,800) |
| `words_used.txt` | Past NYT Wordle answers (2,309 words) |

To rebuild the database from scratch, delete `db/words.db` and run `npm run seed` again.
