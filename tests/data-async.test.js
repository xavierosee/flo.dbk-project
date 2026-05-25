/**
 * data-async.test.js — tests for loadData(), getPub(), getRankedPubs()
 *
 * loadData() uses fetch() which is not available in the Node test environment.
 * We stub global.fetch before importing the module so the module can resolve.
 * Each test resets the module cache by manipulating the internal _cache via
 * the "cache bust" pattern: we call loadData twice and confirm caching.
 *
 * The module uses a module-level `_cache` variable.  To test fresh state we
 * use vi.resetModules() + dynamic re-import in each test.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const PUBS = [
  {
    pub_id: 'alpha',
    name: 'Alpha Bar',
    city: 'Rouen',
    address: '1 rue Alpha',
    lat: 49.44,
    lng: 1.09,
    hours_text: 'Tlj',
    status: 'open',
  },
  {
    pub_id: 'beta',
    name: 'Beta Bar',
    city: 'Caen',
    address: '2 rue Beta',
    lat: 49.18,
    lng: -0.36,
    hours_text: 'Tlj',
    status: 'closed',
  },
  {
    pub_id: 'gamma',
    name: 'Gamma Bar',
    city: 'Le Havre',
    address: '3 rue Gamma',
    lat: 49.49,
    lng: 0.11,
    hours_text: 'Tlj',
    status: 'open',
  },
];

const RATINGS = [
  {
    pub_id: 'alpha',
    sub_scores: { diabolo: 4, glacon: 3, kiwi: 4, banane: 5, verre: 3 },
    blurb_md: 'Great diabolo.',
    author: 'Inspector',
    date: '2026-05-01',
  },
  // beta has no rating → score should be null
  {
    pub_id: 'gamma',
    sub_scores: { diabolo: 5, glacon: 5, kiwi: 5, banane: 5, verre: 5 },
    blurb_md: 'Perfect.',
    author: 'Inspector',
    date: '2026-05-10',
  },
];

function makeFetch(pubs, ratings) {
  return vi.fn().mockImplementation((url) => {
    const data = url.includes('pubs') ? pubs : ratings;
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    });
  });
}

describe('loadData()', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('fetches pubs and ratings and merges them', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { loadData } = await import('../src/lib/data.js?v=1');
    const result = await loadData();

    expect(result).toHaveLength(3);
    const alpha = result.find(p => p.pub_id === 'alpha');
    expect(alpha.rating).not.toBeNull();
    expect(alpha.score).toBe(3.8); // (4+3+4+5+3)/5 = 19/5 = 3.8
  });

  it('assigns null rating and null score for unrated pubs', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { loadData } = await import('../src/lib/data.js?v=2');
    const result = await loadData();

    const beta = result.find(p => p.pub_id === 'beta');
    expect(beta.rating).toBeNull();
    expect(beta.score).toBeNull();
  });

  it('computes score = 5 for all-5 ratings', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { loadData } = await import('../src/lib/data.js?v=3');
    const result = await loadData();

    const gamma = result.find(p => p.pub_id === 'gamma');
    expect(gamma.score).toBe(5);
  });

  it('returns cached result on second call (fetch called only twice)', async () => {
    const mockFetch = makeFetch(PUBS, RATINGS);
    global.fetch = mockFetch;
    const { loadData } = await import('../src/lib/data.js?v=4');

    await loadData();
    await loadData(); // second call — should hit cache

    // fetch is called once for pubs.json + once for ratings.json = 2 total
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('getPub()', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns the pub when found', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { getPub } = await import('../src/lib/data.js?v=5');
    const pub = await getPub('alpha');
    expect(pub).not.toBeNull();
    expect(pub.pub_id).toBe('alpha');
  });

  it('returns null for an unknown pub_id', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { getPub } = await import('../src/lib/data.js?v=6');
    const pub = await getPub('does-not-exist');
    expect(pub).toBeNull();
  });
});

describe('getRankedPubs()', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('excludes closed pubs', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { getRankedPubs } = await import('../src/lib/data.js?v=7');
    const ranked = await getRankedPubs();
    const ids = ranked.map(p => p.pub_id);
    expect(ids).not.toContain('beta'); // beta is closed
  });

  it('excludes pubs with null score', async () => {
    // Use a dataset where an open pub has no rating
    const pubsWithUnrated = [
      ...PUBS,
      {
        pub_id: 'delta',
        name: 'Delta',
        city: 'Cherbourg',
        address: '4 rue Delta',
        lat: 49.64,
        lng: -1.62,
        hours_text: 'Tlj',
        status: 'open',
      },
    ];
    global.fetch = makeFetch(pubsWithUnrated, RATINGS); // delta has no rating
    const { getRankedPubs } = await import('../src/lib/data.js?v=8');
    const ranked = await getRankedPubs();
    const ids = ranked.map(p => p.pub_id);
    expect(ids).not.toContain('delta');
  });

  it('sorts pubs by score descending', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { getRankedPubs } = await import('../src/lib/data.js?v=9');
    const ranked = await getRankedPubs();

    for (let i = 0; i < ranked.length - 1; i++) {
      expect(ranked[i].score).toBeGreaterThanOrEqual(ranked[i + 1].score);
    }
  });

  it('returns gamma (score 5) before alpha (score 3.8)', async () => {
    global.fetch = makeFetch(PUBS, RATINGS);
    const { getRankedPubs } = await import('../src/lib/data.js?v=10');
    const ranked = await getRankedPubs();
    const gammaIdx = ranked.findIndex(p => p.pub_id === 'gamma');
    const alphaIdx = ranked.findIndex(p => p.pub_id === 'alpha');
    expect(gammaIdx).toBeLessThan(alphaIdx);
  });
});
