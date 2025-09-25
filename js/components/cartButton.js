// js/components/cartButton.js
import { money } from '../helpers.js';
import { state } from '../state.js';

export function cartButton() {
  return `
    <button class="btn btn-navy cart-btn" id="cartBtn" title="Ver carrito" data-bs-toggle="modal" data-bs-target="#cartModal">
      <svg viewBox="0 0 24 24" fill="none"><path d="M3 3h2l.4 2M7 13h10l3-7H6.4M7 13l-2-8H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="20" r="1.5" fill="currentColor"/><circle cx="17" cy="20" r="1.5" fill="currentColor"/></svg>
      Carrito
      <span id="cartBadge" class="cart-badge">0</span>
    </button>
  `;
}

export function bindCartBadge(root) {
  const badge = root.querySelector('#cartBadge');
  const update = (n) => { if (badge) badge.textContent = n; };
  // inicial
  update(state.cart.reduce((a,x)=>a+x.qty,0));
  // escucha cambios
  window.addEventListener('cart:changed', (e) => update(e.detail.count));
}
