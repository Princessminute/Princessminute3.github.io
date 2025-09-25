// js/services/pdf.js
import { money } from '../helpers.js';

export function openReceiptWindow(order) {
  // CSS incrustado (A4 limpio)
  const styles = `
@page { size: A4; margin: 16mm; }
*{ box-sizing: border-box; }
body{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#111; }
.header{ display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.brand{ display:flex; align-items:center; gap:10px; }
.brand img{ width:40px; height:40px; object-fit:contain; }
.box{ border:1px solid #ddd; border-radius:8px; padding:12px; }
.kv{ display:grid; grid-template-columns: max-content 1fr; gap:4px 12px; }
h1{ font-size:18px; margin:0 0 6px; }
h2{ font-size:14px; margin:10px 0 6px; }
.table{ width:100%; border-collapse:collapse; margin-top:6px; }
.table th,.table td{ border:1px solid #e5e5e5; padding:6px 8px; font-size:12px; }
.table thead th{ background:#f6f6f6; }
tfoot td{ font-weight:700; }
.footer{ margin-top:14px; font-size:12px; color:#444; }
.center{text-align:center}
.right{text-align:right}
.small{font-size:12px}
`;

  const rows = order.items.map(i =>
    `<tr><td>${escapeHtml(i.nombre)}</td><td class="center">${i.cantidad}</td><td class="right">${money(i.punit)}</td><td class="right">${money(i.subtotal)}</td></tr>`
  ).join('');

  // Ruta ABSOLUTA del logo (para que cargue dentro de blob:)
  const logoAbs = new URL('./assets/img/logo-haneul.png', location.href).href;

  const html = `
<!doctype html>
<html lang="es"><head>
<meta charset="utf-8"><title>Boleta ${order.serie}-${order.numero}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>${styles}</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <img src="${logoAbs}" alt="Haneul Skin">
      <div>
        <h1>Haneul Skin</h1>
        <div class="small">Skincare coreano</div>
      </div>
    </div>
    <div class="box small kv">
      <div><strong>BOLETA</strong></div><div></div>
      <div>Serie:</div><div>${order.serie}</div>
      <div>Número:</div><div>${order.numero}</div>
      <div>Fecha:</div><div>${order.fecha.toLocaleString()}</div>
    </div>
  </div>

  <div class="box small kv" style="margin-bottom:10px">
    <div><strong>RUC:</strong></div><div>12345678910</div>
    <div><strong>Dirección:</strong></div><div>Arequipa, Perú</div>
    <div><strong>Cliente:</strong></div><div>${escapeHtml(order.cliente)}</div>
  </div>

  <table class="table" aria-label="Detalle de boleta">
    <thead><tr><th>Producto</th><th class="center">Cant.</th><th class="right">P. Unit</th><th class="right">Subtotal</th></tr></thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr><td colspan="3" class="right">Subtotal</td><td class="right">${money(order.totales.subtotal)}</td></tr>
      <tr><td colspan="3" class="right">IGV (18%)</td><td class="right">${money(order.totales.igv)}</td></tr>
      <tr><td colspan="3" class="right">Total</td><td class="right">${money(order.totales.total)}</td></tr>
    </tfoot>
  </table>

  <div class="footer center">Gracias por su compra</div>
  <script>
    // Pequeña pausa para que carguen recursos y luego imprimir
    window.addEventListener('load', () => setTimeout(()=>window.print(), 250));
  </script>
</body></html>`;

  try {
    // ----- Método robusto: Blob -----
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank'); // no usamos noreferrer para evitar bloqueos
    if (!w) alert('Permite ventanas emergentes para ver la boleta');
    // liberar el blob cuando cierre la pestaña
    const revoke = () => URL.revokeObjectURL(url);
    window.addEventListener('focus', revoke, { once: true });
  } catch (e) {
    // ----- Fallback clásico: document.write -----
    const w = window.open('', '_blank');
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
    } else {
      alert('Permite ventanas emergentes para ver la boleta');
    }
  }
}

function escapeHtml(s='') {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
