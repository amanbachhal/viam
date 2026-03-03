import { getProducts } from "@/actions/product.actions";
import { getFilterOptions } from "@/actions/master.actions";
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

  const [result, filterRes] = await Promise.all([
    getProducts({
      search: params?.search,
      page: Number(params?.page || 1),
      category: params?.category,
      style: params?.style,
      type: params?.type,
    }),
    getFilterOptions(),
  ]);

  return <ProductTable data={result.data} filterOptions={filterRes.data} />;
}
