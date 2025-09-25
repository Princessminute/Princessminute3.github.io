import { login } from '../services/auth.js';
import { formToObj, showErrors, validate } from '../helpers.js';

export function loginView(root) {
  root.innerHTML = `
    <section class="form-card mx-auto" style="max-width:520px;">
      <div class="form-title">Iniciar sesión</div>
      <form id="loginForm" novalidate>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" name="email" required>
          <div class="invalid-feedback"></div>
        </div>
        <div class="mb-3">
          <label class="form-label">Contraseña</label>
          <input type="password" class="form-control" name="password" required minlength="6">
          <div class="invalid-feedback"></div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-navy" type="submit">Entrar</button>
          <a class="btn btn-outline-secondary" href="#/register">Registrarme (cliente)</a>
        </div>
      </form>
    </section>
  `;

  const form = root.querySelector('#loginForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = formToObj(form);
    const errors = validate(data, {
      email: { required: true, email: true },
      password: { required: true, min: 6 }
    });
    showErrors(form, errors);
    if (Object.keys(errors).length) return;

    const user = login(data.email, data.password);
    if (!user) return alert('Credenciales inválidas');

    location.hash = user.role === 'admin' ? '/admin' : '/cliente';
  });
}
