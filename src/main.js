import '@fontsource/eb-garamond/700.css';
import './styles/guide.css';

import { route, notFound, startRouter } from './lib/router.js';
import { mountIndexView } from './views/index-view.js';
import { mountPubView } from './views/pub-view.js';
import { mountNearbyView } from './views/nearby-view.js';
import { mountNotFoundView } from './views/not-found-view.js';

const app = document.getElementById('app');

const footer = document.createElement('footer');
footer.innerHTML = `<p>Le Guide DBK est une œuvre de fiction satirique. Les notes sont l'opinion de l'Inspecteur DBK.<br>
Pour signaler une erreur factuelle ou demander un retrait : <a href="mailto:contact@lindexdbk.fr">contact@lindexdbk.fr</a></p>`;
document.body.appendChild(footer);

function mount(fn, params) {
  app.innerHTML = '';
  fn(app, params);
}

route('/', () => mount(mountIndexView));
route('/pub/:id', params => mount(mountPubView, params));
route('/nearby', () => mount(mountNearbyView));
notFound(() => mount(mountNotFoundView));

startRouter();
