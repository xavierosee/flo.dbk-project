const routes = [];

export function route(pattern, handler) {
  routes.push({ pattern, handler });
}

export function startRouter() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

function dispatch() {
  const hash = location.hash.replace(/^#/, '') || '/';
  for (const { pattern, handler } of routes) {
    const match = matchRoute(pattern, hash);
    if (match !== null) {
      handler(match);
      return;
    }
  }
}

function matchRoute(pattern, path) {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patternParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function navigate(path) {
  location.hash = path;
}
