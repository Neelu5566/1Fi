const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,34,900 — Indian digit grouping, no decimals. */
export function formatInr(value: number): string {
  return inr.format(Math.round(value));
}

/** 1,34,900 without the symbol, for places that render ₹ separately. */
export function formatAmount(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}

export function formatDiscount(mrp: number, price: number): number {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatTenure(months: number): string {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  return years === 1 ? "1 year" : `${years} years`;
}
