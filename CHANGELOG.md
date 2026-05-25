# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0.0] - 2026-05-25

### Added

- Hash-based SPA router (`src/lib/router.js`) with route params, 404 catch-all, and `navigate()` helper
- Data layer (`src/lib/data.js`) — fetches and merges `pubs.json` + `ratings.json`, caches result, computes mean sub-score
- Geolocation utilities (`src/lib/geo.js`) — haversine distance, Normandy bounding-box check, distance sort, 10 s timeout
- Five seed pubs across Rouen, Le Havre, Caen, Dieppe with full Inspecteur DBK reviews and sub-scores (diabolo, glaçon, kiwi, banane, verre)
- Leaderboard view (`#/`) — ranked pub list with clickable cards
- Pub detail view (`#/pub/:id`) — score hero, five-axis breakdown, Inspecteur blurb, closed banner
- Nearby view (`#/nearby`) — geolocation with five states: granted+in-Normandy, granted+outside, denied, timeout, no-HTTPS
- 404 view (`#/404`) with Inspecteur DBK voice copy
- EB Garamond 700 display font, bone/ink/accent design tokens, mobile-first CSS with ≥44 px tap targets
- OG image pipeline: Satori (JSX→SVG) + resvg-js (SVG→PNG), build-time, one image per pub
- 54 tests across 5 files: schema validation, score math, haversine, router, async data loading

### Changed

- Replaced npm/npx with bun throughout (Makefile, Husky hooks, package.json scripts) — no Node installed on this machine
