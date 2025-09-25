// js/state.js
const STATE_KEY = 'haneul_state';
const STATE_VERSION = 3; // súbelo cuando cambies el shape del estado

function uid() {
  // id simple basado en tiempo
  return Date.now() + '-' + Math.floor(Math.random() * 1e6);
}

export const state = {
  __v: STATE_VERSION,
  user: null,
  cart: [],
  products: [],
  categories: [],
  orders: [], // [{id, numero, fechaISO, cliente, items:[{...}], totales:{...}, estado}]

  load() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (obj.__v !== STATE_VERSION) { localStorage.removeItem(STATE_KEY); return; }
      this.user = obj.user ?? null;
      this.cart = Array.isArray(obj.cart) ? obj.cart : [];
      this.products = Array.isArray(obj.products) ? obj.products : [];
      this.categories = Array.isArray(obj.categories) ? obj.categories : [];
      this.orders = Array.isArray(obj.orders) ? obj.orders : [];
    } catch { localStorage.removeItem(STATE_KEY); }
    this.emitCartChanged();
  },
  save() {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      __v: STATE_VERSION,
      user: this.user,
      cart: this.cart,
      products: this.products,
      categories: this.categories,
      orders: this.orders
    }));
  },

  isAdmin()  { return this.user?.role === 'admin'; },
  isClient() { return this.user?.role === 'cliente'; },

  // --- carrito ---
  addToCart(p) {
    const id = Number(p.id);
    const i = this.cart.findIndex(x => Number(x.id) === id);
    if (i >= 0) this.cart[i].qty += 1;
    else this.cart.push({ id, name: p.nombre, price: Number(p.precio)||0, qty: 1, img: p.imagen_principal });
    this.save(); this.emitCartChanged();
  },
  removeFromCart(id) { this.cart = this.cart.filter(x => Number(x.id) !== Number(id)); this.save(); this.emitCartChanged(); },
  clearCart() { this.cart = []; this.save(); this.emitCartChanged(); },
  cartTotals() {
    const subtotal = this.cart.reduce((a, x) => a + Number(x.price) * Number(x.qty), 0);
    const igv = +(subtotal * 0.18).toFixed(2);
    const total = +(subtotal + igv).toFixed(2);
    return { subtotal: +subtotal.toFixed(2), igv, total };
  },
  emitCartChanged() { const count = this.cart.reduce((a, x) => a + x.qty, 0); window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } })); },

  // --- catálogo (CRUD) ---
  createCategory(cat) { cat.id = cat.id ?? uid(); this.categories.push(cat); this.save(); },
  updateCategory(id, patch) { const i = this.categories.findIndex(c=>String(c.id)===String(id)); if(i>=0){ this.categories[i] = {...this.categories[i], ...patch}; this.save(); } },
  deleteCategory(id) {
    // Si borras una categoría, desasigna productos de esa categoría
    this.products = this.products.map(p => (String(p.id_categoria)===String(id) ? {...p, id_categoria: null} : p));
    this.categories = this.categories.filter(c=>String(c.id)!==String(id));
    this.save();
  },

  createProduct(p) { p.id = p.id ?? Number(uid().slice(0,6)); this.products.push(p); this.save(); },
  updateProduct(id, patch) { const i = this.products.findIndex(p=>Number(p.id)===Number(id)); if(i>=0){ this.products[i] = {...this.products[i], ...patch}; this.save(); } },
  deleteProduct(id) { this.products = this.products.filter(p=>Number(p.id)!==Number(id)); this.save(); },

  // --- pedidos ---
  createOrder(order) {
    const id = uid();
    this.orders.push({ id, ...order, estado: order.estado || 'Pagado' });
    this.save();
    return id;
  },
  updateOrder(id, patch) {
    const i = this.orders.findIndex(o=>o.id===id);
    if (i>=0){ this.orders[i] = {...this.orders[i], ...patch}; this.save(); }
  }
};
