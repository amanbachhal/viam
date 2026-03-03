import { getDiscountById } from "@/actions/discount.actions";
import { getFilterOptions } from "@/actions/master.actions";
import { getProductsForDropdown } from "@/actions/product.actions";
import { getVariantsForDropdown } from "@/actions/variant.actions";
import DiscountForm from "@/components/admin/discount-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [discountRes, mastersRes, productsRes, variantsRes] = await Promise.all(
    [
      getDiscountById(id),
      getFilterOptions(),
      getProductsForDropdown(),
      getVariantsForDropdown(),
    ],
  );

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <DiscountForm
        discount={discountRes.data}
        categories={mastersRes.data.categories}
        styles={mastersRes.data.styles}
        types={mastersRes.data.types}
        products={productsRes.data}
        variants={variantsRes.data}
      />
    </div>
  );
}
