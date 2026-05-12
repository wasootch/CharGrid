# CharGrid

A Wordle helper that filters possible words based on what you know. Live at [wordle.scottadams.ca](https://wordle.scottadams.ca).

## Features

- Enter **green** letters (correct position), **yellow** letters (wrong position), and **gray** letters (not in word) to filter matching words
- Past Wordle answers are shown dimmed with a strikethrough — they're less likely to appear again
- Keyboard navigation: arrow keys move between letter boxes, Enter submits

## Local Setup

**First time only** — seed the word database:

```bash
npm install
npm run seed
```

Then:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Word Lists

| File | Description |
|------|-------------|
| `words5.txt` | Full list of valid 5-letter words (~14,800) |
| `words_used.txt` | Past NYT Wordle answers (2,309 words) |

To rebuild the database from scratch, delete `db/words.db` and run `npm run seed` again.

## Deployment

The app is deployed to [Google Cloud Run](https://cloud.google.com/run) via [Cloud Build](https://cloud.google.com/build), with the domain served through Cloudflare.

### How it works

- On each push to `main`, Cloud Build builds the Docker image, seeds the SQLite database from the word list files, and deploys to Cloud Run
- The image is stored in Artifact Registry
- The custom domain is mapped via `gcloud run domain-mappings` with DNS managed through Cloudflare

### Manual deploy

```bash
gcloud builds submit --config cloudbuild.yaml
```

### Domain mapping

```bash
gcloud run domain-mappings create --service chargrid --domain wordle.scottadams.ca
```
