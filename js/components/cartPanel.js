import { money } from '../helpers.js';
import { state } from '../state.js';

export function cartPanel() {
  const items = state.cart.map(i => `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div><strong>${i.qty}×</strong> ${i.name}</div>
      <div>${money(i.qty * i.price)}</div>
    </div>
  `).join('') || '<div class="text-muted">Tu carrito está vacío.</div>';

  const { subtotal, igv, total } = state.cartTotals();

  return `
    <div class="form-card">
      <div class="form-title">Carrito</div>
      <div>${items}</div>
      <hr/>
      <div class="d-flex justify-content-between"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="d-flex justify-content-between"><span>IGV (18%)</span><span>${money(igv)}</span></div>
      <div class="d-flex justify-content-between fs-5 fw-bold"><span>Total</span><span>${money(total)}</span></div>
      <div class="mt-3 d-flex gap-2">
        <button class="btn btn-secondary" id="btnClearCart">Vaciar</button>
        <button class="btn btn-navy" id="btnPagar">Pagar</button>
      </div>
    </div>
  `;
}

export function bindCartActions(root, onPay) {
  root.addEventListener('click', (e) => {
    if (e.target.id === 'btnClearCart') {
      state.clearCart();
      onPay?.('refresh');
    }
    if (e.target.id === 'btnPagar') {
      if (state.cart.length === 0) return alert('Agrega productos al carrito');
      onPay?.('pay');
    }
  });
}
