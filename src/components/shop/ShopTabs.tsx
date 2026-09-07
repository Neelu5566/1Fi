"use client";

import { SHOP_TABS, type ShopTabId } from "@/lib/shop-tabs";
import { cn } from "@/lib/utils";

/** The existing pill tab bar on the Shop page, extended with a third tab. */
export function ShopTabs({
  active,
  onChange,
}: {
  active: ShopTabId;
  onChange: (id: ShopTabId) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Shop sections"
      className="flex gap-2 rounded-full border border-brand-border bg-brand-tint p-1.5 shadow-[0_1px_3px_rgba(113,44,220,0.06)]"
    >
      {SHOP_TABS.map((tab) => {
        const isActive = tab.id === active;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`shop-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`shop-panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex-1 rounded-full py-[11px] text-center text-[13px] font-semibold tracking-[-0.005em] transition-all",
              isActive
                ? "bg-white text-brand shadow-[var(--shop-shadow-raised)]"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab.label}
            {isActive && (
              <span
                aria-hidden
                className="absolute bottom-1.5 left-1/2 h-[2.5px] w-[22px] -translate-x-1/2 rounded-full bg-brand"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
