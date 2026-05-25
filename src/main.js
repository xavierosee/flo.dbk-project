import '@fontsource/eb-garamond/700.css';
import './styles/guide.css';

import { route, startRouter } from './lib/router.js';
import { mountIndexView } from './views/index-view.js';
import { mountPubView } from './views/pub-view.js';
import { mountNearbyView } from './views/nearby-view.js';
import { mountNotFoundView } from './views/not-found-view.js';

const app = document.getElementById('app');

function mount(fn, params) {
  app.innerHTML = '';
  fn(app, params);
}

route('/', () => mount(mountIndexView));
route('/pub/:id', params => mount(mountPubView, params));
route('/nearby', () => mount(mountNearbyView));

startRouter();
