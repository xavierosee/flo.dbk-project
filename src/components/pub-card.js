import { renderScoreHero } from './score-display.js';
import { navigate } from '../lib/router.js';

export function renderPubCard(pub, { rank, distanceKm } = {}) {
  const article = document.createElement('article');
  article.className = 'pub-card';
  article.setAttribute('role', 'listitem');

  const hero = pub.score !== null ? renderScoreHero(pub.score) : '';

  article.innerHTML = `
    <div class="pub-card__meta">
      ${rank != null ? `<span class="pub-card__rank" aria-label="Rang ${rank}">#${rank}</span>` : ''}
      <span class="pub-card__city">${pub.city}</span>
      ${distanceKm != null ? `<span class="pub-card__distance">${distanceKm.toFixed(1)} km</span>` : ''}
    </div>
    <h2 class="pub-card__name">${pub.name}</h2>
  `;

  if (pub.score !== null) {
    article.appendChild(renderScoreHero(pub.score));
  }

  if (pub.rating?.blurb_md) {
    const blurb = document.createElement('p');
    blurb.className = 'pub-card__blurb';
    blurb.textContent = pub.rating.blurb_md;
    article.appendChild(blurb);
  }

  article.addEventListener('click', () => navigate(`/pub/${pub.pub_id}`));
  article.style.cursor = 'pointer';

  return article;
}
