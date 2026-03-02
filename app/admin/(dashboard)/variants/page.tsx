import { getVariants } from "@/actions/variant.actions";
import { getProductsForDropdown } from "@/actions/product.actions";
import VariantTable from "@/components/admin/variant-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    product?: string;
    category?: string;
    style?: string;
    type?: string;
    in_stock?: string;
  }>;
}) {
  const params = await searchParams;

  const [variantsRes, productsRes] = await Promise.all([
    getVariants({
      search: params?.search,
      page: Number(params?.page || 1),
      product: params?.product,
      category: params?.category,
      style: params?.style,
      type: params?.type,
      in_stock: params?.in_stock,
    }),
    getProductsForDropdown(),
  ]);

  return (
    <VariantTable
      data={{
        variants: variantsRes.data,
        total: variantsRes.total,
        pages: variantsRes.pages,
        page: variantsRes.page,
      }}
      products={productsRes.data}
    />
  );
}
