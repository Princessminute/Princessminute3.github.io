export function productFilter() {
  return `
    <form id="filterForm" class="mb-3">
      <div class="input-group input-group-rounded input-icon-left shadow-soft">
        <span class="icon">
          <img src="./assets/icons/search.svg" alt="" />
        </span>
        <input class="form-control" type="search" name="q" placeholder="Buscar productos... (ej. serum)">
      </div>
    </form>
  `;
}
