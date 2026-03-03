import DiscountForm from "@/components/admin/discount-form";
import { getFilterOptions } from "@/actions/master.actions";
import { getProductsForDropdown } from "@/actions/product.actions";
import { getVariantsForDropdown } from "@/actions/variant.actions";

export default async function Page() {
  const [masters, products, variants] = await Promise.all([
    getFilterOptions(),
    getProductsForDropdown(),
    getVariantsForDropdown(),
  ]);

  return (
    <div className="p-6 bg-white rounded-xl border">
      <DiscountForm
        categories={masters.data.categories}
        styles={masters.data.styles}
        types={masters.data.types}
        products={products.data}
        variants={variants.data}
      />
    </div>
  );
}
