"use client";

import { useCallback } from "react";
import { Wallet } from "lucide-react";

import { useAsyncResource } from "@/hooks/useAsyncResource";
import { formatInr } from "@/lib/format";
import type { CreditLimit } from "@/lib/types";
import { Skeleton } from "@/components/ui/States";

async function fetchLimit(signal: AbortSignal): Promise<CreditLimit> {
  const response = await fetch("/api/limit", { signal });
  if (!response.ok) throw new Error("Could not load your limit.");
  return response.json();
}

/**
 * Shows how much of the pledged portfolio is still spendable. Fails quietly:
 * a limit we cannot load should never block browsing.
 */
export function LimitSummary() {
  const fetcher = useCallback((signal: AbortSignal) => fetchLimit(signal), []);
  const { data, isLoading, error } = useAsyncResource(fetcher);

  if (isLoading) return <Skeleton className="h-[64px] w-full rounded-2xl" />;
  if (error || !data) return null;

  const usedPercent = Math.min(
    100,
    Math.round(((data.totalLimit - data.availableLimit) / data.totalLimit) * 100),
  );

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-tint px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint-strong text-brand">
            <Wallet aria-hidden className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[11.5px] font-medium text-gray-500">
              Available shopping limit
            </p>
            <p className="text-[16px] font-bold tracking-[-0.015em] text-gray-900">
              {formatInr(data.availableLimit)}
            </p>
          </div>
        </div>
        <p className="shrink-0 text-right text-[11px] leading-[1.35] text-gray-500">
          of {formatInr(data.totalLimit)}
          <br />
          against pledged funds
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={usedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Limit used"
        className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500"
          style={{ width: `${usedPercent}%` }}
        />
      </div>
    </div>
  );
}
