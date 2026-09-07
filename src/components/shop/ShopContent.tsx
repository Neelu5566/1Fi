"use client";

import { useCallback, useState } from "react";
import { SearchX } from "lucide-react";

import { MarketplacePanel } from "@/components/marketplace/MarketplacePanel";
import { StateCard } from "@/components/ui/States";
import { SearchField } from "./SearchField";
import { SHOP_TABS, type ShopTabId } from "@/lib/shop-tabs";
import { ShopTabs } from "./ShopTabs";

const SEARCH_PLACEHOLDER: Record<ShopTabId, string> = {
  "top-brands": "Search online stores...",
  "nearby-stores": "Search nearby stores...",
  marketplace: "Search products or brands...",
};

/**
 * Owns Shop page state. The active tab is mirrored into the URL so the section
 * survives a refresh and can be linked to, without pulling the route into
 * client-only rendering.
 */
export function ShopContent({ initialTab }: { initialTab: ShopTabId }) {
  const [activeTab, setActiveTab] = useState<ShopTabId>(initialTab);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleTabChange = useCallback((tab: ShopTabId) => {
    setActiveTab(tab);
    setQuery("");
    // Shallow URL update: no navigation, no refetch of the server component.
    window.history.replaceState(null, "", `/shop?tab=${tab}`);
  }, []);

  return (
    <div className="relative flex flex-col gap-3.5">
      <ShopTabs active={activeTab} onChange={handleTabChange} />

      <SearchField
        value={query}
        onChange={setQuery}
        placeholder={SEARCH_PLACEHOLDER[activeTab]}
        label={SEARCH_PLACEHOLDER[activeTab]}
      />

      <section
        role="tabpanel"
        id={`shop-panel-${activeTab}`}
        aria-labelledby={`shop-tab-${activeTab}`}
        className="flex flex-col gap-3.5"
      >
        <h2 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.018em] text-gray-900">
          {SHOP_TABS.find((tab) => tab.id === activeTab)?.label}
        </h2>

        {/* Top Brands and Nearby Stores are out of scope for this assignment. */}
        {activeTab === "top-brands" && (
          <StateCard
            icon={SearchX}
            title="No matching stores found"
            description="Try a different store or brand name."
          />
        )}

        {activeTab === "nearby-stores" && (
          <StateCard
            icon={SearchX}
            title="No nearby stores found"
            description="Try a different store or brand name."
          />
        )}

        {activeTab === "marketplace" && (
          <MarketplacePanel
            query={query}
            category={category}
            onCategoryChange={setCategory}
          />
        )}
      </section>
    </div>
  );
}
