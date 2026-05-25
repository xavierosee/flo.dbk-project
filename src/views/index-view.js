import { getRankedPubs } from '../lib/data.js';
import { renderPubCard } from '../components/pub-card.js';

export async function mountIndexView(container) {
  container.innerHTML = `
    <header class="site-header">
      <p class="site-eyebrow">Le Guide DBK</p>
      <h1 class="site-title">L'Index du Diabolo<br>Banane-Kiwi</h1>
      <p class="site-tagline">Classement des établissements normands par rigueur diabolique</p>
    </header>
    <nav class="view-tabs" aria-label="Navigation">
      <a href="#/" class="tab tab--active" aria-current="page">Classement</a>
      <a href="#/nearby" class="tab">Près de moi</a>
    </nav>
    <main id="main-content">
      <div class="loading" aria-live="polite">Chargement du classement…</div>
    </main>
  `;

  const main = container.querySelector('#main-content');

  try {
    const pubs = await getRankedPubs();
    main.innerHTML = '';
    const list = document.createElement('ol');
    list.className = 'pub-list';
    list.setAttribute('role', 'list');
    pubs.forEach((pub, i) => {
      list.appendChild(renderPubCard(pub, { rank: i + 1 }));
    });
    main.appendChild(list);
  } catch {
    main.innerHTML = '<p class="error">Impossible de charger le classement.</p>';
  }
}
