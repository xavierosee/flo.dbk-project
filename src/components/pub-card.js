import { renderScoreHero } from './score-display.js';

export function renderPubCard(pub, { rank, distanceKm } = {}) {
  const article = document.createElement('article');
  article.className = 'pub-card';
  article.setAttribute('role', 'listitem');

  article.innerHTML = `
    <div class="pub-card__meta">
      ${rank != null ? `<span class="pub-card__rank" aria-label="Rang ${rank}">#${rank}</span>` : ''}
      <span class="pub-card__city">${pub.city}</span>
      ${distanceKm != null ? `<span class="pub-card__distance">${distanceKm.toFixed(1)} km</span>` : ''}
    </div>
    <h2 class="pub-card__name">
      <a class="pub-card__link" href="#/pub/${pub.pub_id}">${pub.name}</a>
    </h2>
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

  return article;
}
