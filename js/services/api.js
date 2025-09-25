export async function fetchProducts() {
  const res = await fetch('./data/products.json');
  return res.json();
}
export async function fetchCategories() {
  const res = await fetch('./data/categories.json');
  return res.json();
}
