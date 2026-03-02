import { getProducts } from "@/actions/product.actions";
import ProductTable from "@/components/admin/product-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    category?: string;
    style?: string;
    type?: string;
  }>;
}) {
  const params = await searchParams;

  const result = await getProducts({
    search: params?.search,
    page: Number(params?.page || 1),
    category: params?.category,
    style: params?.style,
    type: params?.type,
  });

  return (
    <ProductTable
      data={{
        products: result.data,
        total: result.total,
        pages: result.pages,
        page: result.page,
      }}
    />
  );
}
