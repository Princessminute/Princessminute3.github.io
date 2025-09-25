import { fetchProducts, fetchCategories } from '../services/api.js';
import { state } from '../state.js';
import { carousel } from '../components/carousel.js';
import { productFilter } from '../components/productFilter.js';
import { mountProductGrid } from '../components/productGrid.js';

export async function homeView(root) {
  // Data (se cachea en state)
  if (!state.products.length) state.products = await fetchProducts();
  if (!state.categories.length) state.categories = await fetchCategories();
  state.save();

  root.innerHTML = `
    <section class="hero mb-3">
      <div class="d-flex align-items-center gap-2">
        <img src="./assets/img/logo-haneul.png" width="48" height="48" alt="Haneul Skin">
        <div>
          <h2 class="m-0">Haneul Skin</h2>
          <p class="m-0 text-muted">Skincare coreano para tu piel</p>
        </div>
      </div>
      <div class="mt-3">
        ${carousel([
          './assets/img/hero/carrusel-1.png',
          './assets/img/hero/carrusel-2.jpg',
          './assets/img/hero/carrusel-3.png'
        ])}

      </div>
    </section>

    ${productFilter()}
    <div id="gridRoot"></div>
  `;

  const gridRoot = root.querySelector('#gridRoot');
  let filtered = state.products.slice();

  function render() { mountProductGrid(gridRoot, filtered); }
  render();

  // Filtro
  const form = root.querySelector('#filterForm');
  form.addEventListener('input', () => {
    const q = form.q.value.toLowerCase();
    filtered = state.products.filter(p =>
      p.nombre.toLowerCase().includes(q) || (p.marca||'').toLowerCase().includes(q)
    );
    render();
  });
}
