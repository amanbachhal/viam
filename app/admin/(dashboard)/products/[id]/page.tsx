import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/actions/product.actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getProductById(id);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <ProductForm product={result.data} />
    </div>
  );
}
