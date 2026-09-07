import { ProductDetailView } from "@/components/marketplace/ProductDetailView";
import { PRODUCTS } from "@/server/data/products";

/** Pre-render the catalogue's detail routes. */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.slug === slug);

  return {
    title: product ? `${product.name} | 1Fi Marketplace` : "1Fi Marketplace",
    description: product?.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailView slug={slug} />;
}
