import { getDiscounts } from "@/actions/discount.actions";
import DiscountTable from "@/components/admin/discount-table";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    type?: string;
    status?: string;
  }>;
}) {
  const params = await searchParams;

  const discountsRes = await getDiscounts({
    search: params?.search,
    page: Number(params?.page || 1),
    type: params?.type,
    status: params?.status,
  });

  return <DiscountTable data={discountsRes.data} />;
}
