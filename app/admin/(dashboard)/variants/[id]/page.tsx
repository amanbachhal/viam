import { getVariantById } from "@/actions/variant.actions";
import VariantForm from "@/components/admin/variant-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const variantRes = await getVariantById(id);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <VariantForm variant={variantRes.data} />
    </div>
  );
}
