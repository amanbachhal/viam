import { getProductsForDropdown } from "@/actions/product.actions";
import VariantForm from "@/components/admin/variant-form";

export const dynamic = "force-dynamic";

export default async function NewVariantPage() {
  const res = await getProductsForDropdown();
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <VariantForm products={res.data} />
    </div>
  );
}
