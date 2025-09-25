export const $ = (sel, parent=document) => parent.querySelector(sel);
export const $$ = (sel, parent=document) => [...parent.querySelectorAll(sel)];

export function money(n) { return 'S/ ' + (Number(n||0)).toFixed(2); }

export function formToObj(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

// Validaciones básicas (requisito PDF)
export function validate(fields, rules) {
  const errors = {};
  for (const key in rules) {
    const value = (fields[key] ?? '').trim();
    const r = rules[key];
    if (r.required && !value) errors[key] = 'Requerido';
    if (r.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[key] = 'Email inválido';
    if (r.min && value.length < r.min) errors[key] = `Mínimo ${r.min} caracteres`;
    if (r.pattern && value && !r.pattern.test(value)) errors[key] = r.message || 'Formato inválido';
  }
  return errors;
}

export function showErrors(form, errors) {
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  for (const k in errors) {
    const input = form.querySelector(`[name="${k}"]`);
    if (input) {
      input.classList.add('is-invalid');
      let fb = input.nextElementSibling;
      if (!fb || !fb.classList.contains('invalid-feedback')) {
        fb = document.createElement('div');
        fb.className = 'invalid-feedback';
        input.after(fb);
      }
      fb.textContent = errors[k];
    }
  }
}
