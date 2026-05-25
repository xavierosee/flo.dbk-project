import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { computeScore } from '../src/lib/data.js';

const root = new URL('..', import.meta.url).pathname;
const pubs = JSON.parse(readFileSync(join(root, 'public/data/pubs.json'), 'utf8'));
const ratings = JSON.parse(readFileSync(join(root, 'public/data/ratings.json'), 'utf8'));

// ── Schema validation ────────────────────────────────
describe('pubs.json schema', () => {
  const PUB_FIELDS = ['pub_id', 'name', 'city', 'address', 'lat', 'lng', 'hours_text', 'status'];

  it('all required fields are present', () => {
    for (const pub of pubs) {
      for (const field of PUB_FIELDS) {
        expect(pub, `${pub.pub_id} missing ${field}`).toHaveProperty(field);
      }
    }
  });

  it('pub_id is a non-empty slug', () => {
    for (const pub of pubs) {
      expect(pub.pub_id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('pub_id is unique', () => {
    const ids = pubs.map(p => p.pub_id);
    expect(ids.length).toBe(new Set(ids).size);
  });

  it('lat/lng are numbers in plausible range', () => {
    for (const pub of pubs) {
      expect(pub.lat).toBeGreaterThan(-90);
      expect(pub.lat).toBeLessThan(90);
      expect(pub.lng).toBeGreaterThan(-180);
      expect(pub.lng).toBeLessThan(180);
    }
  });

  it('status is "open" or "closed"', () => {
    for (const pub of pubs) {
      expect(['open', 'closed']).toContain(pub.status);
    }
  });
});

// ── ratings.json schema ──────────────────────────────
describe('ratings.json schema', () => {
  const AXES = ['diabolo', 'glacon', 'kiwi', 'banane', 'verre'];

  it('all sub_scores are integers 1–5', () => {
    for (const r of ratings) {
      for (const axis of AXES) {
        const val = r.sub_scores[axis];
        expect(Number.isInteger(val), `${r.pub_id}.${axis} must be integer`).toBe(true);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(5);
      }
    }
  });

  it('rating pub_ids reference known pubs', () => {
    const pubIds = new Set(pubs.map(p => p.pub_id));
    for (const r of ratings) {
      expect(pubIds.has(r.pub_id), `rating for unknown pub: ${r.pub_id}`).toBe(true);
    }
  });

  it('date is ISO 8601', () => {
    for (const r of ratings) {
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('author is present', () => {
    for (const r of ratings) {
      expect(r.author).toBeTruthy();
    }
  });
});

// ── computeScore ─────────────────────────────────────
describe('computeScore', () => {
  it('returns mean of five axes to one decimal', () => {
    const rating = { sub_scores: { diabolo: 4, glacon: 3, kiwi: 4, banane: 5, verre: 3 } };
    expect(computeScore(rating)).toBe(3.8);
  });

  it('returns 5 for all-5 scores', () => {
    const rating = { sub_scores: { diabolo: 5, glacon: 5, kiwi: 5, banane: 5, verre: 5 } };
    expect(computeScore(rating)).toBe(5);
  });

  it('returns 1 for all-1 scores', () => {
    const rating = { sub_scores: { diabolo: 1, glacon: 1, kiwi: 1, banane: 1, verre: 1 } };
    expect(computeScore(rating)).toBe(1);
  });

  it('returns null for null rating', () => {
    expect(computeScore(null)).toBeNull();
  });

  it('rounds to one decimal', () => {
    const rating = { sub_scores: { diabolo: 1, glacon: 2, kiwi: 3, banane: 4, verre: 5 } };
    expect(computeScore(rating)).toBe(3);
  });
});
