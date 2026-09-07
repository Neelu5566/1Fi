/**
 * Shared by the Shop server component and the client tab bar, so it must not
 * live in a "use client" module — across that boundary the export would arrive
 * as a client reference rather than the array itself.
 */
export const SHOP_TABS = [
  { id: "top-brands", label: "Top Brands" },
  { id: "nearby-stores", label: "Nearby Stores" },
  { id: "marketplace", label: "1Fi Marketplace" },
] as const;

export type ShopTabId = (typeof SHOP_TABS)[number]["id"];

export function resolveShopTab(value: string | string[] | undefined): ShopTabId {
  return SHOP_TABS.some((tab) => tab.id === value)
    ? (value as ShopTabId)
    : "top-brands";
}
