import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/actions/product.actions";
import { getFilterOptions } from "@/actions/master.actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [productResult, masterResult] = await Promise.all([
    getProductById(id),
    getFilterOptions(),
  ]);

  const masterOptions = masterResult?.data || {
    categories: [],
    styles: [],
    types: [],
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <ProductForm product={productResult.data} masterOptions={masterOptions} />
    </div>
  );
}
