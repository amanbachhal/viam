export function transformProduct(product: any) {
  return {
    id: product._id.toString(),
    name: product.name,
    code: product.code,
    description: product.description,
    category: product.category,
    style: product.style,
    type: product.type,

    variants: product.variants.map((v: any) => ({
      id: v._id.toString(),
      product_id: v.product_id,
      name: v.name,
      code: v.code,
      price: v.price,
      inStock: v.in_stock,
      images: v.images,
    })),
  };
}
