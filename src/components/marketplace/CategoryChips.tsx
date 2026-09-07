"use client";

import { cn } from "@/lib/utils";

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "smartphone", label: "Smartphones" },
  { id: "laptop", label: "Laptops" },
  { id: "tablet", label: "Tablets" },
  { id: "audio", label: "Audio" },
  { id: "wearable", label: "Wearables" },
  { id: "television", label: "TVs" },
] as const;

/** Horizontally scrollable category filter rail. */
export function CategoryChips({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4"
    >
      {CATEGORIES.map((category) => {
        const isActive = category.id === active;

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(category.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors",
              isActive
                ? "border-brand bg-brand text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
            )}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
