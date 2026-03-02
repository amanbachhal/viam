export function filterProducts(
  products: any[],
  category: string,
  style: string,
  type: string,
  search: string,
) {
  return products.filter((p) => {
    if (category !== "All" && p.category !== category) return false;
    if (style !== "All" && p.style !== style) return false;
    if (type !== "All" && p.type !== type) return false;

    if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    return true;
  });
}
