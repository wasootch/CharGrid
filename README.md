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

## Deployment

The app is a Node.js/Express server and can be deployed to any platform that supports Node.js (e.g. Railway, Render, Fly.io).

On deploy, `npm run build` seeds the SQLite database from `words5.txt` and `words_used.txt`, both of which are committed to the repo. No external database service is required.

To serve the app under a custom domain, point a CNAME DNS record at the hosting platform's provided hostname. Setting the DNS proxy to enabled (if your DNS provider supports it) will handle SSL automatically.

The `PORT` environment variable is respected if set by the hosting platform; it defaults to `3000`.
