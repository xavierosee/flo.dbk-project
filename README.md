# Le Guide DBK

A Michelin-style satirical guide to Diabolo Banane-Kiwi drinks in Normandy pubs. Inspecteur DBK rates each establishment on five axes: diabolo quality, ice (glaçon), kiwi flavor, banana flavor, and glass presentation.

## Requirements

- [Bun](https://bun.sh) (no Node.js required)

## How to run locally

```bash
# 1. Install dependencies
bun install

# 2. Start the dev server
bun run dev
# → opens at http://localhost:5173
```

Navigate with the hash-based router:
- `#/` — ranked leaderboard
- `#/pub/<id>` — pub detail with score breakdown
- `#/nearby` — pubs sorted by your geolocation

## Other commands

```bash
bun run test        # run the 54-test suite (Vitest)
bun run build       # production build (OG images + Vite)
bun run preview     # preview the production build
bun run lint        # ESLint
```

Or via Make (Linux/macOS only):

```bash
make install
make run
make test
make build
make preview
```

## Stack

| Tool | Role |
|------|------|
| Vite | Dev server + production build |
| Vitest | Test runner |
| EB Garamond | Display font |
| Satori + resvg-js | Build-time OG image generation |

Data lives in `public/data/pubs.json` and `public/data/ratings.json`.

## Project status

This is v0.1 — a read-only local guide with five seed pubs. See the PR for the roadmap toward an Untappd-style community app.
