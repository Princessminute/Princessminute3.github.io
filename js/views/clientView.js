import { fetchProducts } from '../services/api.js';
import { state } from '../state.js';
import { productFilter } from '../components/productFilter.js';
import { mountProductGrid } from '../components/productGrid.js';
import { cartButton, bindCartBadge } from '../components/cartButton.js';
import { openReceiptWindow } from '../services/pdf.js';
import { money } from '../helpers.js';

export async function clientView(root) {
  if (!state.products.length) state.products = await fetchProducts();
  state.save();

  root.innerHTML = `
    <section class="d-flex flex-column gap-3">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="m-0">Bienvenida/o</h2>
        <div id="cartBtnRoot">${cartButton()}</div>
      </div>

      ${productFilter()}

      <div id="gridRoot"></div>

      <!-- Modal Bootstrap del carrito -->
      <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="cartModalLabel" class="modal-title">Tu carrito</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <div id="cartList"></div>
              <hr class="my-3"/>
              <div class="d-flex justify-content-end flex-column align-items-end gap-1">
                <div><strong>Subtotal:</strong> <span id="cSubtotal"></span></div>
                <div>IGV (18%): <span id="cIgv"></span></div>
                <div class="fs-5"><strong>Total:</strong> <span id="cTotal"></span></div>
              </div>
            </div>
            <div class="modal-footer">
              <button id="btnClearCart" class="btn btn-outline-secondary">Vaciar</button>
              <button id="btnPagar" class="btn btn-navy">Pagar</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Botón con badge que se actualiza
  bindCartBadge(root.querySelector('#cartBtnRoot'));

  // Render productos y filtro
  const gridRoot = root.querySelector('#gridRoot');
  let filtered = state.products.slice();
  const renderProducts = () => mountProductGrid(gridRoot, filtered);
  renderProducts();

  const form = root.querySelector('#filterForm');
  form.addEventListener('input', () => {
    const q = form.q.value.toLowerCase();
    filtered = state.products.filter(p =>
      p.nombre.toLowerCase().includes(q) || (p.marca||'').toLowerCase().includes(q)
    );
    renderProducts();
  });

  // --- Modal carrito ---
  const cartModal = root.querySelector('#cartModal');
  const cartList  = root.querySelector('#cartList');
  const cSubtotal = root.querySelector('#cSubtotal');
  const cIgv      = root.querySelector('#cIgv');
  const cTotal    = root.querySelector('#cTotal');
  const btnClear  = root.querySelector('#btnClearCart');
  const btnPay    = root.querySelector('#btnPagar');

  function renderCartModal() {
    if (!cartList) return;
    if (state.cart.length === 0) {
      cartList.innerHTML = `<div class="text-muted">Tu carrito está vacío.</div>`;
    } else {
      cartList.innerHTML = state.cart.map(i => `
        <div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
          <div class="d-flex align-items-center gap-2">
            <img src="${i.img}" alt="${i.name}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
            <div>
              <div class="fw-semibold">${i.name}</div>
              <div class="text-muted" style="font-size:.9rem">${money(i.price)} × ${i.qty}</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" data-dec="${i.id}">-</button>
            <button class="btn btn-sm btn-outline-secondary" data-inc="${i.id}">+</button>
            <button class="btn btn-sm btn-outline-danger" data-del="${i.id}">Eliminar</button>
          </div>
        </div>
      `).join('');
    }
    const { subtotal, igv, total } = state.cartTotals();
    cSubtotal.textContent = money(subtotal);
    cIgv.textContent = money(igv);
    cTotal.textContent = money(total);
  }

  // 1) Render inicial
  renderCartModal();

  // 2) Re-render cada vez que el carrito cambie (cuando agregas desde las tarjetas)
  const onCartChanged = () => renderCartModal();
  window.addEventListener('cart:changed', onCartChanged);

  // 3) Re-render justo al abrir el modal (por si lo abriste antes de agregar algo)
  cartModal.addEventListener('show.bs.modal', renderCartModal);

  // Controles dentro del modal
  cartList.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.inc || e.target.dataset.dec || e.target.dataset.del);
    if (!id) return;
    const idx = state.cart.findIndex(x => Number(x.id) === id);
    if (idx < 0) return;

    if (e.target.dataset.inc) state.cart[idx].qty += 1;
    if (e.target.dataset.dec) state.cart[idx].qty = Math.max(1, state.cart[idx].qty - 1);
    if (e.target.dataset.del) state.cart.splice(idx, 1);

    state.save();
    state.emitCartChanged(); // también actualizar badge
    renderCartModal();
  });

  btnClear.addEventListener('click', () => {
    state.clearCart();
    renderCartModal();
  });

btnPay.addEventListener('click', () => {
  if (state.cart.length === 0) return alert('Agrega productos al carrito');
  const order = crearOrdenDesdeCarrito();

  // guarda pedido en estado
  state.createOrder({
    numero: order.numero,
    serie: order.serie,
    fechaISO: order.fecha.toISOString(),
    cliente: order.cliente,
    items: order.items,
    totales: order.totales,
    estado: 'Pagado'
  });

  openReceiptWindow(order);   // boleta en ventana aparte
  state.clearCart();
  renderCartModal();
});


  function crearOrdenDesdeCarrito() {
    const { subtotal, igv, total } = state.cartTotals();
    return {
      serie: 'B001',
      numero: Math.floor(100000 + Math.random()*900000),
      fecha: new Date(),
      cliente: state.user?.nombre || 'Cliente',
      items: state.cart.map(i => ({
        nombre: i.name,
        cantidad: i.qty,
        punit: i.price,
        subtotal: +(i.price*i.qty).toFixed(2)
      })),
      totales: { subtotal, igv, total }
    };
  }

}
