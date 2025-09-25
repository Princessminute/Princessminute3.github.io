import { mountSidebar } from './components/sidebar.js';
import { routerInit } from './router.js';
import { state } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
  // Sidebar (siempre)
  mountSidebar(document.querySelector('#sidebar'));

  // Año footer
  document.querySelector('#year').textContent = new Date().getFullYear();

  // Carga estado de sesión/carrito desde localStorage
  state.load();

  // Inicia router
  routerInit();
});
