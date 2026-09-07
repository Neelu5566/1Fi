"use client";

import { Info } from "lucide-react";

import { formatInr, formatTenure } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EmiPlan } from "@/lib/types";
import { ErrorState, Skeleton } from "@/components/ui/States";

function PlansSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-[66px] w-full rounded-2xl" />
      ))}
    </div>
  );
}

/**
 * EMI plan list. Plans arrive fully computed from the API; this component only
 * renders them and reports the user's choice upward.
 */
export function EmiPlanSelector({
  plans,
  selectedPlanId,
  onSelect,
  isLoading,
  error,
  onRetry,
}: {
  plans: EmiPlan[];
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
          Select an EMI plan
        </h2>
        <span className="text-[11.5px] text-gray-500">No down payment</span>
      </div>

      {isLoading && <PlansSkeleton />}

      {!isLoading && error && <ErrorState message={error} onRetry={onRetry} />}

      {!isLoading && !error && (
        <div role="radiogroup" aria-label="EMI plan" className="flex flex-col gap-2">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            const isDisabled = !plan.withinLimit;

            return (
              <button
                key={plan.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isDisabled}
                onClick={() => onSelect(plan.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all",
                  isSelected
                    ? "border-brand bg-brand-tint shadow-[0_0_0_1px_rgba(113,44,220,0.15)]"
                    : "border-gray-200 bg-white",
                  isDisabled && "cursor-not-allowed opacity-55",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2",
                    isSelected ? "border-brand" : "border-gray-300",
                  )}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-brand" />}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[14px] font-bold tracking-[-0.01em] text-gray-900">
                      {formatInr(plan.monthlyInstalment)}/mo
                    </span>
                    <span className="text-[12.5px] text-gray-500">
                      for {formatTenure(plan.tenureMonths)}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[11.5px] text-gray-500">
                    {plan.isNoCost
                      ? "0% interest · No cost EMI"
                      : `${plan.interestRate}% p.a. · ${formatInr(plan.totalInterest)} interest`}
                  </span>
                  {isDisabled && (
                    <span className="mt-1 block text-[11px] font-medium text-amber-600">
                      Exceeds your available limit
                    </span>
                  )}
                </span>

                <span className="flex shrink-0 flex-col items-end gap-1">
                  {plan.isNoCost && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      NO COST
                    </span>
                  )}
                  {plan.isRecommended && (
                    <span className="rounded-full bg-brand-tint-strong px-2 py-0.5 text-[10px] font-bold text-brand">
                      POPULAR
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {!isLoading && !error && plans.length > 0 && (
        <p className="flex items-start gap-1.5 text-[11.5px] leading-[1.45] text-gray-500">
          <Info aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
          Your mutual funds stay invested and keep compounding. Foreclose any time
          with no penalty.
        </p>
      )}
    </section>
  );
}
