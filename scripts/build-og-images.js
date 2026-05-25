import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const pubs = JSON.parse(readFileSync(join(root, 'public/data/pubs.json'), 'utf8'));
const ratings = JSON.parse(readFileSync(join(root, 'public/data/ratings.json'), 'utf8'));

const ratingsMap = Object.fromEntries(ratings.map(r => [r.pub_id, r]));

function computeScore(rating) {
  const s = rating.sub_scores;
  const vals = [s.diabolo, s.glacon, s.kiwi, s.banane, s.verre];
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1).replace('.', ',');
}

function stars(n) {
  const full = Math.round(n);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

const outDir = join(root, 'dist/og');
mkdirSync(outDir, { recursive: true });

// Load EB Garamond font for satori
let fontData;
const fontPaths = [
  join(root, 'node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-700-normal.woff2'),
  join(root, 'node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-700-normal.woff'),
];
for (const p of fontPaths) {
  if (existsSync(p)) {
    fontData = readFileSync(p);
    break;
  }
}

if (!fontData) {
  console.warn('⚠ EB Garamond font not found — OG images will use system serif');
}

const fonts = fontData
  ? [{ name: 'EB Garamond', data: fontData, weight: 700, style: 'normal' }]
  : [];

for (const pub of pubs) {
  const rating = ratingsMap[pub.pub_id];
  if (!rating) {
    console.warn(`⚠ No rating for ${pub.pub_id} — skipping OG`);
    continue;
  }

  const score = computeScore(rating);
  const scoreNum = parseFloat(score.replace(',', '.'));

  const element = {
    type: 'div',
    props: {
      style: {
        width: '1200px',
        height: '630px',
        background: '#f5efe6',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 80px',
        fontFamily: fontData ? 'EB Garamond' : 'Georgia, serif',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            },
            children: [
              {
                type: 'p',
                props: {
                  style: { fontSize: '20px', color: '#7e2620', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 },
                  children: `Le Guide DBK · ${pub.city}`,
                },
              },
              {
                type: 'h1',
                props: {
                  style: { fontSize: '72px', fontWeight: 700, color: '#1a1815', margin: 0, lineHeight: 1.1 },
                  children: pub.name,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '8px' },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: '120px', fontWeight: 700, color: '#7e2620', lineHeight: 1 },
                        children: score,
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: '32px', color: '#7e2620', letterSpacing: '0.1em' },
                        children: stars(scoreNum),
                      },
                    },
                  ],
                },
              },
              {
                type: 'p',
                props: {
                  style: {
                    fontSize: '18px',
                    color: '#1a1815',
                    maxWidth: '460px',
                    lineHeight: 1.55,
                    fontStyle: 'italic',
                    margin: 0,
                  },
                  children: rating.blurb_md.substring(0, 160) + (rating.blurb_md.length > 160 ? '…' : ''),
                },
              },
            ],
          },
        },
      ],
    },
  };

  try {
    const svg = await satori(element, { width: 1200, height: 630, fonts });
    const resvg = new Resvg(svg);
    const png = resvg.render().asPng();
    writeFileSync(join(outDir, `${pub.pub_id}.png`), png);
    console.log(`✓ ${pub.pub_id}.png`);
  } catch (err) {
    console.error(`✗ ${pub.pub_id}: ${err.message}`);
  }
}

console.log(`\nOG images written to dist/og/`);
