"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

import { formatInr, formatTenure } from "@/lib/format";
import type { EmiPlan, Product, ProductVariant } from "@/lib/types";

/** Final review sheet shown after the user taps the CTA. */
export function PlanSummarySheet({
  product,
  variant,
  plan,
  onClose,
}: {
  product: Product;
  variant: ProductVariant;
  plan: EmiPlan;
  onClose: () => void;
}) {
  // A sheet that traps the page behind it should not let the page scroll.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const rows = [
    { label: "Product", value: `${product.name} · ${variant.label}` },
    { label: "Item price", value: formatInr(variant.price) },
    { label: "Tenure", value: formatTenure(plan.tenureMonths) },
    {
      label: "Interest",
      value: plan.isNoCost ? "0% (No cost EMI)" : `${plan.interestRate}% p.a.`,
    },
    { label: "Down payment", value: formatInr(0) },
    { label: "Total payable", value: formatInr(plan.totalPayable) },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm your EMI plan"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 px-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-t-[28px] bg-white px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.015em] text-gray-900">
              Confirm your plan
            </h2>
            <p className="mt-0.5 text-[12.5px] text-gray-500">
              Review before you pledge your funds.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-tint px-4 py-3.5 text-center">
          <p className="text-[12px] font-medium text-gray-500">Monthly instalment</p>
          <p className="text-[26px] font-bold tracking-[-0.02em] text-gray-900">
            {formatInr(plan.monthlyInstalment)}
          </p>
          <p className="text-[12px] text-gray-500">
            for {formatTenure(plan.tenureMonths)}
          </p>
        </div>

        <dl className="mt-4 flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start justify-between gap-4">
              <dt className="text-[12.5px] text-gray-500">{row.label}</dt>
              <dd className="max-w-[60%] text-right text-[12.5px] font-semibold text-gray-900">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 flex items-start gap-1.5 text-[11.5px] leading-[1.45] text-gray-500">
          <CheckCircle2 aria-hidden className="mt-px h-3.5 w-3.5 shrink-0 text-emerald-600" />
          No processing fee, no foreclosure charge and no CIBIL check.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-full bg-brand py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark active:scale-[0.99]"
        >
          Pledge funds &amp; continue
        </button>
      </div>
    </div>
  );
}
