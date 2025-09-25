import { state } from '../state.js';

export function mountSidebar(root) {
  root.innerHTML = `
    <div class="brand">
      <img src="./assets/img/logo-haneul.png" alt="Haneul Skin"/>
      <div class="title">Haneul Skin</div>
    </div>
    <div class="nav-links mt-3">
      <a href="#/" data-link>Inicio</a>
      <a href="#/cliente" data-link>Cliente</a>
      <a href="#/admin" data-link>Administrador</a>
      <a href="#/login" data-link id="loginLink">Login / Registro</a>
    </div>
    <div class="mt-4">
      ${state.user ? `<span class="badge-soft">Hola, ${state.user.nombre}</span>` : ''}
    </div>
  `;
}
