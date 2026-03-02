import ProductForm from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <ProductForm />
    </div>
  );
}
