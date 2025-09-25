import { productCard, bindProductCardEvents } from './productCard.js';

export function productGrid(products) {
  const cards = products.map(productCard).join('');
  return `<section class="product-grid" id="productGrid">${cards}</section>`;
}

export function mountProductGrid(root, products) {
  root.innerHTML = productGrid(products);
  bindProductCardEvents(root);
}
