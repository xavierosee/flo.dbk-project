function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function onRequest({ request, env, params }) {
  const id = params.id;
  const origin = new URL(request.url).origin;

  const [pubsRes, ratingsRes] = await Promise.all([
    env.ASSETS.fetch(new Request(`${origin}/data/pubs.json`)),
    env.ASSETS.fetch(new Request(`${origin}/data/ratings.json`)),
  ]);

  const pubs = await pubsRes.json();
  const ratings = await ratingsRes.json();

  const pub = pubs.find(p => p.pub_id === id);

  if (!pub) {
    return env.ASSETS.fetch(new Request(`${origin}/index.html`));
  }

  const rating = ratings.find(r => r.pub_id === id);
  const score = rating
    ? Math.round((Object.values(rating.sub_scores).reduce((a, b) => a + b, 0) / 5) * 10) / 10
    : null;

  const title = escapeHtml(`${pub.name} — Le Guide DBK`);
  const description = escapeHtml(
    score !== null
      ? `Note Inspecteur DBK : ${score}/5 · ${pub.city}`
      : `${pub.name}, ${pub.city} · Le Guide DBK`
  );
  const image = `${origin}/og/${id}.png`;
  const spaUrl = `${origin}/#/pub/${id}`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Le Guide DBK">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta http-equiv="refresh" content="0;url=${spaUrl}">
</head>
<body>
  <script>location.replace(${JSON.stringify(spaUrl)});</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'content-type': 'text/html;charset=UTF-8' },
  });
}
