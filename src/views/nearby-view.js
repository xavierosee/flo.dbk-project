import { getRankedPubs } from '../lib/data.js';
import { renderPubCard } from '../components/pub-card.js';
import { getCurrentPosition, isInNormandy, sortByDistance } from '../lib/geo.js';

export async function mountNearbyView(container) {
  container.innerHTML = `
    <header class="site-header site-header--compact">
      <p class="site-eyebrow">Le Guide DBK</p>
    </header>
    <nav class="view-tabs" aria-label="Navigation">
      <a href="#/" class="tab">Classement</a>
      <a href="#/nearby" class="tab tab--active" aria-current="page">Près de moi</a>
    </nav>
    <main id="main-content" aria-live="polite">
      <div class="loading">Localisation en cours…</div>
    </main>
  `;

  const main = container.querySelector('#main-content');

  let pubs;
  try {
    pubs = await getRankedPubs();
  } catch {
    main.innerHTML = '<p class="error">Impossible de charger les bars.</p>';
    return;
  }

  let position = null;
  let geoState = 'unknown';

  try {
    position = await getCurrentPosition();
    geoState = 'granted';
  } catch (err) {
    geoState = err?.code === 1 ? 'denied' : 'timeout';
  }

  main.innerHTML = '';

  if (geoState === 'denied' || geoState === 'timeout') {
    const notice = document.createElement('p');
    notice.className = 'geo-notice';
    notice.textContent = 'Active la géoloc pour voir les bars près de toi.';
    main.appendChild(notice);
  }

  const sorted = position
    ? sortByDistance(pubs, position.lat, position.lng)
    : pubs;

  if (position && !isInNormandy(position.lat, position.lng)) {
    const banner = document.createElement('div');
    banner.className = 'out-of-normandy-banner';
    banner.setAttribute('role', 'status');
    banner.textContent = 'Vous êtes loin de la Normandie — voici les bars quand même.';
    main.appendChild(banner);
  }

  const list = document.createElement('ol');
  list.className = 'pub-list';
  list.setAttribute('role', 'list');

  sorted.forEach(pub => {
    const distKm = position
      ? Math.round(((6371 * Math.acos(
          Math.cos((position.lat * Math.PI) / 180) *
          Math.cos((pub.lat * Math.PI) / 180) *
          Math.cos(((pub.lng - position.lng) * Math.PI) / 180) +
          Math.sin((position.lat * Math.PI) / 180) *
          Math.sin((pub.lat * Math.PI) / 180)
        )) * 10)) / 10
      : null;
    list.appendChild(renderPubCard(pub, { distanceKm: distKm }));
  });

  main.appendChild(list);
}
