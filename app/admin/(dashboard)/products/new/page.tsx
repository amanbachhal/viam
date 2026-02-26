import ProductForm from "@/components/admin-products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-stone-400 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Add New Product</h1>
          <p className="text-stone-700 text-sm">
            Create product and manage its variants.
          </p>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
