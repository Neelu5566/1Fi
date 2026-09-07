"use client";

import { PackageSearch } from "lucide-react";

import { useProducts } from "@/hooks/useMarketplace";
import { ErrorState, Skeleton, StateCard } from "@/components/ui/States";
import { CategoryChips } from "./CategoryChips";
import { LimitSummary } from "./LimitSummary";
import { ProductCard } from "./ProductCard";

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[20px] border border-zinc-200 bg-white"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="flex flex-col gap-2 p-3">
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** The 1Fi Marketplace tab: limit summary, filters and the product listing. */
export function MarketplacePanel({
  query,
  category,
  onCategoryChange,
}: {
  query: string;
  category: string;
  onCategoryChange: (category: string) => void;
}) {
  const { data, isLoading, error, refetch } = useProducts(query, category);

  return (
    <div className="flex flex-col gap-4">
      <LimitSummary />

      <CategoryChips active={category} onChange={onCategoryChange} />

      {isLoading && <ProductGridSkeleton />}

      {!isLoading && error && <ErrorState message={error} onRetry={refetch} />}

      {!isLoading && !error && data && data.products.length === 0 && (
        <StateCard
          icon={PackageSearch}
          title="No products found"
          description={
            query
              ? `We could not find anything matching "${query}". Try another brand or product.`
              : "There is nothing in this category yet. Check back soon."
          }
        />
      )}

      {!isLoading && !error && data && data.products.length > 0 && (
        <>
          <p className="text-[12px] text-gray-500">
            {data.total} {data.total === 1 ? "product" : "products"} available on
            no-cost EMI
          </p>
          <div className="grid grid-cols-2 gap-3">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
