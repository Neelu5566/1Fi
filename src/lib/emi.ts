import type { EmiPlan } from "./types";

/**
 * 1Fi offers no-cost EMI on shorter tenures and a reducing-balance rate on
 * longer ones. Keeping the schedule here (rather than in the data file) means
 * every plan is derived from price + tenure and can never drift out of sync.
 */
const RATE_BY_TENURE: Record<number, number> = {
  3: 0,
  6: 0,
  9: 0,
  12: 0,
  18: 10.5,
  24: 11.5,
  36: 12.5,
};

const RECOMMENDED_TENURE = 12;

function reducingBalanceInstalment(
  principal: number,
  annualRate: number,
  months: number,
): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

/** Builds every EMI offer for a given price, cheapest tenure first. */
export function buildEmiPlans(
  principal: number,
  tenures: number[],
  availableLimit: number,
): EmiPlan[] {
  return tenures
    .slice()
    .sort((a, b) => a - b)
    .map((tenureMonths) => {
      const interestRate = RATE_BY_TENURE[tenureMonths] ?? 12.5;
      const monthlyInstalment = Math.round(
        reducingBalanceInstalment(principal, interestRate, tenureMonths),
      );
      const totalPayable = monthlyInstalment * tenureMonths;

      return {
        id: `emi-${tenureMonths}m`,
        tenureMonths,
        interestRate,
        monthlyInstalment,
        totalPayable,
        totalInterest: Math.max(0, totalPayable - principal),
        isNoCost: interestRate === 0,
        isRecommended: tenureMonths === RECOMMENDED_TENURE,
        withinLimit: principal <= availableLimit,
      };
    });
}
