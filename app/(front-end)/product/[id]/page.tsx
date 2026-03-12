import { getProductDetails } from "@/actions/store.actions";
import { Metadata } from "next";
import Link from "next/link";
import ProductClient from "./product-client";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.viamjewels.com";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  const { product, related } = res.data;

  const firstVariant = product.variants?.[0];
  const image = firstVariant?.images?.[0];
  const price =
    firstVariant?.discountedPrice || firstVariant?.price || undefined;

  const inStock = product.variants?.some((v: any) => v.in_stock);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: image,
    description: product.description,
    sku: product.code,
    brand: {
      "@type": "Brand",
      name: "Viam Jewels",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${id}`,
      priceCurrency: "INR",
      price: price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      <ProductClient product={product} related={related} />
    </article>
  );
}

/* ================= METADATA ================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const res = await getProductDetails(id);

  if (!res.success || !res.data) {
    return { title: "Product Not Found" };
  }

  const product = res.data.product;

  const firstVariant = product.variants?.[0];
  const image = firstVariant?.images?.[0] || "/placeholder.webp";

  return {
    title: product.name,
    description:
      product.description ||
      `Buy ${product.name} at Viam Jewels. Premium artificial jewelry.`,

    alternates: {
      canonical: `/product/${id}`,
    },

    openGraph: {
      title: product.name,
      description: product.description,
      url: `${baseUrl}/product/${id}`,
      type: "website",
      images: [
        {
          url: image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [image],
    },
  };
}
