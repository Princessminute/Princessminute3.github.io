import { registerClient } from '../services/auth.js';
import { formToObj, showErrors, validate } from '../helpers.js';

export function registerView(root) {
  root.innerHTML = `
    <section class="form-card mx-auto" style="max-width:680px;">
      <div class="form-title">Registro de cliente</div>
      <form id="regForm" novalidate>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Nombres</label>
            <input class="form-control" name="nombres" required>
            <div class="invalid-feedback"></div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Apellidos</label>
            <input class="form-control" name="apellidos" required>
            <div class="invalid-feedback"></div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" name="email" required>
            <div class="invalid-feedback"></div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Teléfono</label>
            <input class="form-control" name="telefono" pattern="^[0-9\\s+()-]{6,}$">
            <div class="invalid-feedback"></div>
          </div>
          <div class="col-12">
            <label class="form-label">Dirección</label>
            <input class="form-control" name="direccion">
            <div class="invalid-feedback"></div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Contraseña</label>
            <input type="password" class="form-control" name="password" required minlength="6">
            <div class="invalid-feedback"></div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Confirmar contraseña</label>
            <input type="password" class="form-control" name="password2" required minlength="6">
            <div class="invalid-feedback"></div>
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-navy" type="submit">Crear cuenta</button>
          <a class="btn btn-outline-secondary" href="#/login">Ya tengo cuenta</a>
        </div>
      </form>
    </section>
  `;

  const form = root.querySelector('#regForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = formToObj(form);

    const errors = validate(data, {
      nombres: { required: true, min: 2 },
      apellidos: { required: true, min: 2 },
      email: { required: true, email: true },
      telefono: { pattern: /^[0-9\s+()-]{6,}$/, message:'Teléfono inválido' },
      password: { required: true, min: 6 },
      password2: { required: true, min: 6 },
    });
    if (data.password !== data.password2) errors.password2 = 'No coincide';
    showErrors(form, errors);
    if (Object.keys(errors).length) return;

    try {
      registerClient(data);
      alert('Cuenta creada. Inicia sesión.');
      location.hash = '/login';
    } catch (err) {
      alert(err.message);
    }
  });
}
