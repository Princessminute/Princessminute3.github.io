import { money } from '../helpers.js';
import { state } from '../state.js';

export function productCard(p) {
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="thumb"><img src="${p.imagen_principal}" alt="${p.nombre}"></div>
    <div class="body">
      <div class="name">${p.nombre}</div>
      <div class="brand">${p.marca ?? ''}</div>
      <div class="price">${money(p.precio)}</div>
    </div>
    <div class="actions">
      <button class="btn btn-sm btn-navy add-cart">Agregar</button>
    </div>
  </article>`;
}

export function bindProductCardEvents(container) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-cart');
    if (!btn) return;
    const card = e.target.closest('.product-card');
    const id = Number(card.dataset.id);
    const p = state.products.find(x => x.id === id);
    if (p) {
      state.addToCart(p);
      alert('Producto agregado al carrito');
    }
  });
}
