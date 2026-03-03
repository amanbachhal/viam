import ProductForm from "@/components/admin/product-form";
import { getFilterOptions } from "@/actions/master.actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const res = await getFilterOptions();

  const masterOptions = res?.data || { categories: [], styles: [], types: [] };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <ProductForm masterOptions={masterOptions} />
    </div>
  );
}
