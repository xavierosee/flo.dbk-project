import { getPub } from '../lib/data.js';
import { renderScoreHero, renderScoreAxes } from '../components/score-display.js';
import { navigate } from '../lib/router.js';

export async function mountPubView(container, { id }) {
  container.innerHTML = `
    <nav class="breadcrumb">
      <a href="#/" class="back-link">← Classement</a>
    </nav>
    <main id="main-content" aria-live="polite">
      <div class="loading">Chargement…</div>
    </main>
  `;

  const main = container.querySelector('#main-content');

  try {
    const pub = await getPub(id);

    if (!pub) {
      navigate('/404');
      return;
    }

    main.innerHTML = `
      <article class="pub-detail">
        ${pub.status === 'closed' ? `<div class="closed-banner" role="alert">Établissement fermé</div>` : ''}
        <header class="pub-detail__header">
          <p class="pub-detail__city">${pub.city}</p>
          <h1 class="pub-detail__name">${pub.name}</h1>
          <p class="pub-detail__address">${pub.address}</p>
          <p class="pub-detail__hours">${pub.hours_text}</p>
        </header>
      </article>
    `;

    const article = main.querySelector('.pub-detail');

    if (pub.score !== null) {
      const scoreSection = document.createElement('section');
      scoreSection.className = 'pub-detail__scores';
      scoreSection.setAttribute('aria-label', 'Notes');
      scoreSection.appendChild(renderScoreHero(pub.score));
      scoreSection.appendChild(renderScoreAxes(pub.rating.sub_scores));
      article.appendChild(scoreSection);
    }

    if (pub.rating?.blurb_md) {
      const review = document.createElement('section');
      review.className = 'pub-detail__review';
      review.innerHTML = `
        <p class="review-body">${pub.rating.blurb_md}</p>
        <footer class="review-byline">
          <span class="review-author">${pub.rating.author}</span>
          <time class="review-date" datetime="${pub.rating.date}">${formatDate(pub.rating.date)}</time>
        </footer>
      `;
      article.appendChild(review);
    }

  } catch {
    main.innerHTML = '<p class="error">Impossible de charger ce bar.</p>';
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}
