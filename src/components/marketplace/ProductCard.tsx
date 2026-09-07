import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { formatDiscount, formatInr } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Listing tile. Presentational only — all pricing arrives from the API. */
export function ProductCard({ product }: { product: Product }) {
  const cheapest = product.variants.reduce((lowest, variant) =>
    variant.price < lowest.price ? variant : lowest,
  );
  const discount = formatDiscount(cheapest.mrp, cheapest.price);

  return (
    <Link
      href={`/shop/marketplace/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-zinc-200 bg-white shadow-[var(--shop-shadow-card)] transition-transform duration-200 active:scale-[0.985]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 500px) 50vw, 240px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-1 text-[10px] font-bold tracking-wide text-white">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white">
            {discount}% off
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400">
            {product.brand}
          </p>
          <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-semibold text-gray-600">
            <Star aria-hidden className="h-3 w-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[14px] font-semibold leading-[1.25] tracking-[-0.01em] text-gray-900">
          {product.name}
        </h3>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold tracking-[-0.015em] text-gray-900">
            {formatInr(cheapest.price)}
          </span>
          {cheapest.mrp > cheapest.price && (
            <span className="text-[11.5px] text-gray-400 line-through">
              {formatInr(cheapest.mrp)}
            </span>
          )}
        </div>

        {product.emiFrom !== undefined && (
          <p className="mt-auto pt-1.5 text-[11.5px] font-medium text-brand">
            EMI from {formatInr(product.emiFrom)}/mo
          </p>
        )}
      </div>
    </Link>
  );
}
