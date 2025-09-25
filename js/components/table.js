export function renderTable({ columns, rows }) {
  const thead = `<thead><tr>${columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>
    ${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}
  </tbody>`;
  return `<table class="table table-striped align-middle">${thead}${tbody}</table>`;
}
