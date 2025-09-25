import { homeView } from './views/homeView.js';
import { loginView } from './views/loginView.js';
import { registerView } from './views/registerView.js';
import { clientView } from './views/clientView.js';
import { adminView } from './views/adminView.js';
import { state } from './state.js';

const routes = {
  '/': homeView,
  '/login': loginView,
  '/register': registerView,
  '/cliente': clientView,
  '/admin': adminView,
};

function resolveRoute() {
  const hash = location.hash.replace('#', '') || '/';
  const view = routes[hash] || routes['/'];
  const el = document.querySelector('#view');
  el.innerHTML = '';
  view(el);
}

export function routerInit() {
  window.addEventListener('hashchange', resolveRoute);
  resolveRoute();

  // Protecciones simples:
  window.addEventListener('hashchange', () => {
    const path = location.hash.replace('#', '') || '/';
    if (path.startsWith('/admin') && !state.isAdmin()) {
      location.hash = '/login';
    }
    if (path.startsWith('/cliente') && !state.isClient()) {
      location.hash = '/login';
    }
  });
}
