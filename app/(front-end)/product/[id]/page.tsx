import { getProductDetails } from "@/actions/store.actions";
import ProductClient from "./product-client";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // 1. Type params as a Promise
}) {
  // 2. Await the params to unwrap the ID
  const { id } = await params;

  // 3. Use the unwrapped ID
  const res = await getProductDetails(id);

  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-stone-50">
        <h2 className="text-2xl font-serif text-stone-900">
          Product Not Found
        </h2>
        <Link
          href="/"
          className="text-stone-500 hover:text-stone-900 underline"
        >
          Back to Collection
        </Link>
      </div>
    );
  }

  return (
    <ProductClient product={res.data.product} related={res.data.related} />
  );
}
