"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/lib/types";

/** Variant picker. Out-of-stock options stay visible but are not selectable. */
export function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: {
  variants: ProductVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
        Choose a variant
      </h2>
      <div
        role="radiogroup"
        aria-label="Product variant"
        className="flex flex-col gap-2"
      >
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={!variant.inStock}
              onClick={() => onSelect(variant.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all",
                isSelected
                  ? "border-brand bg-brand-tint shadow-[0_0_0_1px_rgba(113,44,220,0.15)]"
                  : "border-gray-200 bg-white",
                !variant.inStock && "cursor-not-allowed opacity-55",
              )}
            >
              {variant.colorHex && (
                <span
                  aria-hidden
                  className="h-6 w-6 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: variant.colorHex }}
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-semibold text-gray-900">
                  {variant.label}
                </span>
                {!variant.inStock && (
                  <span className="block text-[11.5px] text-gray-500">
                    Out of stock
                  </span>
                )}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                  isSelected ? "border-brand" : "border-gray-300",
                )}
              >
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-brand" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
