export function carousel(images) {
  const slides = images.map(src => `
    <div class="slide"><img src="${src}" alt="Promo Haneul Skin"></div>
  `).join('');
  return `<div class="carousel" aria-label="Promociones">${slides}</div>`;
}
