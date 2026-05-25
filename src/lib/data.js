let _cache = null;

export async function loadData() {
  if (_cache) return _cache;
  const [pubsRes, ratingsRes] = await Promise.all([
    fetch('/data/pubs.json'),
    fetch('/data/ratings.json'),
  ]);
  if (!pubsRes.ok || !ratingsRes.ok) throw new Error('Failed to load data');
  const pubs = await pubsRes.json();
  const ratings = await ratingsRes.json();
  const ratingsMap = Object.fromEntries(ratings.map(r => [r.pub_id, r]));
  _cache = pubs.map(pub => ({
    ...pub,
    rating: ratingsMap[pub.pub_id] ?? null,
    score: computeScore(ratingsMap[pub.pub_id]),
  }));
  return _cache;
}

export function computeScore(rating) {
  if (!rating) return null;
  const s = rating.sub_scores;
  const vals = [s.diabolo, s.glacon, s.kiwi, s.banane, s.verre];
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

export async function getPub(pubId) {
  const pubs = await loadData();
  return pubs.find(p => p.pub_id === pubId) ?? null;
}

export async function getRankedPubs() {
  const pubs = await loadData();
  return [...pubs]
    .filter(p => p.status === 'open' && p.score !== null)
    .sort((a, b) => b.score - a.score);
}
