// js/views/adminView.js
import { listUsers } from '../services/auth.js';
import { fetchProducts, fetchCategories } from '../services/api.js';
import { renderTable } from '../components/table.js';
import { state } from '../state.js';
import { money } from '../helpers.js';

export async function adminView(root) {
  // asegura datos iniciales solo la primera vez
  if (!state.products.length) state.products = await fetchProducts();
  if (!state.categories.length) state.categories = await fetchCategories();
  state.save();

  const users = listUsers();

  root.innerHTML = `
    <section class="d-flex flex-column gap-3">
      <header class="d-flex align-items-center justify-content-between">
        <h2>Panel Administrador</h2>
        <span class="badge-soft">Productos: ${state.products.length} · Categorías: ${state.categories.length} · Usuarios: ${users.length}</span>
      </header>

      <!-- USUARIOS -->
      <div class="table-card">
        <h5 class="mb-3">Usuarios</h5>
        ${renderTable({
          columns: ['Rol','Nombres','Apellidos','Email','Teléfono'],
          rows: users.map(u => [u.role, u.nombres, u.apellidos, u.email, u.telefono||''])
        })}
      </div>

      <!-- CATEGORÍAS -->
      <div class="table-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="m-0">Categorías</h5>
          <button class="btn btn-navy btn-sm" id="btnNewCat">Nueva categoría</button>
        </div>
        <div id="catTable"></div>
      </div>

      <!-- PRODUCTOS -->
      <div class="table-card">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="m-0">Productos</h5>
          <button class="btn btn-navy btn-sm" id="btnNewProd">Nuevo producto</button>
        </div>
        <div id="prodTable"></div>
      </div>

      <!-- PEDIDOS -->
      <div class="table-card">
        <h5 class="mb-3">Pedidos</h5>
        <div id="orderTable"></div>
      </div>
    </section>

    <!-- MODAL CATEGORÍA -->
    <div class="modal fade" id="catModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form class="modal-content" id="catForm">
          <div class="modal-header">
            <h5 class="modal-title" id="catTitle">Categoría</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="id">
            <div class="mb-2">
              <label class="form-label">Nombre</label>
              <input class="form-control" name="nombre" required>
            </div>
            <div class="mb-2">
              <label class="form-label">Slug</label>
              <input class="form-control" name="slug" required>
            </div>
            <div class="mb-2">
              <label class="form-label">Descripción</label>
              <textarea class="form-control" name="descripcion" rows="2"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
            <button class="btn btn-navy" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL PRODUCTO -->
    <div class="modal fade" id="prodModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <form class="modal-content" id="prodForm">
          <div class="modal-header">
            <h5 class="modal-title" id="prodTitle">Producto</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" name="id">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input class="form-control" name="nombre" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Marca</label>
                <input class="form-control" name="marca">
              </div>
              <div class="col-md-3">
                <label class="form-label">Precio (S/)</label>
                <input class="form-control" name="precio" type="number" step="0.01" min="0" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Stock</label>
                <input class="form-control" name="stock" type="number" step="1" min="0" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">Categoría</label>
                <select class="form-select" name="id_categoria">
                  <option value="">(Sin categoría)</option>
                  ${state.categories.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('')}
                </select>
              </div>
              <div class="col-md-8">
                <label class="form-label">Imagen (ruta)</label>
                <input class="form-control" name="imagen_principal" placeholder="./assets/img/products/archivo.jpg">
                <div class="form-text">Usa rutas relativas dentro del proyecto.</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
            <button class="btn btn-navy" type="submit">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Renders de tablas
  const catTable = root.querySelector('#catTable');
  const prodTable = root.querySelector('#prodTable');
  const orderTable = root.querySelector('#orderTable');

  function renderCats() {
    catTable.innerHTML = renderTable({
      columns: ['Nombre','Slug','Descripción','Acciones'],
      rows: state.categories.map(c => [
        c.nombre, c.slug, c.descripcion||'',
        `
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" data-edit-cat="${c.id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-del-cat="${c.id}">Eliminar</button>
        </div>
        `
      ])
    });
  }
  function renderProds() {
    prodTable.innerHTML = renderTable({
      columns: ['ID','Nombre','Marca','Precio','Stock','Categoría','Acciones'],
      rows: state.products.map(p => [
        p.id, p.nombre, p.marca||'', 'S/ '+Number(p.precio).toFixed(2), p.stock,
        state.categories.find(c=>String(c.id)===String(p.id_categoria))?.nombre || '(Sin)',
        `
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" data-edit-prod="${p.id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-del-prod="${p.id}">Eliminar</button>
        </div>
        `
      ])
    });
  }
  function renderOrders() {
    orderTable.innerHTML = renderTable({
      columns: ['N°','Fecha','Cliente','Items','Total','Estado'],
      rows: state.orders
        .slice() // copia
        .sort((a,b) => (b.fechaISO||'').localeCompare(a.fechaISO||'')) // recientes primero
        .map(o => [
          `${o.serie}-${o.numero}`,
          new Date(o.fechaISO).toLocaleString(),
          o.cliente || '-',
          o.items?.length || 0,
          'S/ ' + Number(o.totales?.total||0).toFixed(2),
          `
          <select class="form-select form-select-sm" data-order="${o.id}">
            ${['Pagado','Procesando','Enviado','Entregado','Cancelado'].map(s => `
              <option ${o.estado===s?'selected':''}>${s}</option>
            `).join('')}
          </select>
          `
        ])
    });
  }

  renderCats(); renderProds(); renderOrders();

  // Botones "Nuevo"
  root.querySelector('#btnNewCat').addEventListener('click', () => openCatModal());
  root.querySelector('#btnNewProd').addEventListener('click', () => openProdModal());

  // Delegación acciones tabla categorías
  catTable.addEventListener('click', (e) => {
    const idEdit = e.target.closest('[data-edit-cat]')?.dataset.editCat;
    const idDel  = e.target.closest('[data-del-cat]')?.dataset.delCat;
    if (idEdit) return openCatModal(idEdit);
    if (idDel) {
      if (confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) {
        state.deleteCategory(idDel);
        renderCats(); renderProds(); // actualizar ambas
      }
    }
  });

  // Delegación acciones tabla productos
  prodTable.addEventListener('click', (e) => {
    const idEdit = e.target.closest('[data-edit-prod]')?.dataset.editProd;
    const idDel  = e.target.closest('[data-del-prod]')?.dataset.delProd;
    if (idEdit) return openProdModal(idEdit);
    if (idDel) {
      if (confirm('¿Eliminar este producto?')) {
        state.deleteProduct(Number(idDel));
        renderProds();
      }
    }
  });

  // Cambio de estado de pedidos
  orderTable.addEventListener('change', (e) => {
    const id = e.target.closest('select')?.dataset.order;
    if (!id) return;
    state.updateOrder(id, { estado: e.target.value });
    renderOrders();
  });

  // --- MODAL CATEGORIA ---
  const catModal = new bootstrap.Modal(root.querySelector('#catModal'));
  const catForm  = root.querySelector('#catForm');
  function openCatModal(id) {
    catForm.reset();
    catForm.id.value = id || '';
    const title = root.querySelector('#catTitle');
    if (id) {
      title.textContent = 'Editar categoría';
      const c = state.categories.find(x => String(x.id) === String(id));
      if (c) {
        catForm.nombre.value = c.nombre || '';
        catForm.slug.value = c.slug || '';
        catForm.descripcion.value = c.descripcion || '';
      }
    } else {
      title.textContent = 'Nueva categoría';
    }
    catModal.show();
  }
  catForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(catForm).entries());
    const payload = {
      nombre: data.nombre.trim(),
      slug: data.slug.trim(),
      descripcion: (data.descripcion||'').trim()
    };
    if (data.id) state.updateCategory(data.id, payload);
    else state.createCategory(payload);

    catModal.hide();
    renderCats();
    // refresca selector de categorías en form de producto (si estaba abierto, se recrea al abrirlo)
  });

  // --- MODAL PRODUCTO ---
  const prodModal = new bootstrap.Modal(root.querySelector('#prodModal'));
  const prodForm  = root.querySelector('#prodForm');

  function openProdModal(id) {
    prodForm.reset();
    prodForm.id.value = id || '';
    root.querySelector('#prodTitle').textContent = id ? 'Editar producto' : 'Nuevo producto';

    // repinta opciones de categorías por si cambiaron
    const sel = prodForm.querySelector('select[name="id_categoria"]');
    sel.innerHTML = `<option value="">(Sin categoría)</option>` + state.categories.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');

    if (id) {
      const p = state.products.find(x => Number(x.id) === Number(id));
      if (p) {
        prodForm.nombre.value = p.nombre || '';
        prodForm.marca.value = p.marca || '';
        prodForm.precio.value = Number(p.precio).toFixed(2);
        prodForm.stock.value = Number(p.stock) || 0;
        prodForm.id_categoria.value = p.id_categoria ?? '';
        prodForm.imagen_principal.value = p.imagen_principal || '';
      }
    }
    prodModal.show();
  }

  prodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(prodForm).entries());
    const payload = {
      nombre: data.nombre.trim(),
      marca: (data.marca||'').trim(),
      precio: Number(data.precio)||0,
      stock: Number(data.stock)||0,
      id_categoria: data.id_categoria || null,
      imagen_principal: (data.imagen_principal||'').trim()
    };
    if (data.id) state.updateProduct(Number(data.id), payload);
    else state.createProduct(payload);

    prodModal.hide();
    renderProds();
  });
}
