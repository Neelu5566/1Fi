"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, PackageX, Star } from "lucide-react";

import { useEmiPlans, useProduct } from "@/hooks/useMarketplace";
import { formatDiscount, formatInr } from "@/lib/format";
import { ErrorState, Skeleton, StateCard } from "@/components/ui/States";
import { EmiPlanSelector } from "./EmiPlanSelector";
import { PlanSummarySheet } from "./PlanSummarySheet";
import { VariantSelector } from "./VariantSelector";

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-[4/3] w-full rounded-[22px]" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-[70px] w-full rounded-2xl" />
      <Skeleton className="h-[66px] w-full rounded-2xl" />
      <Skeleton className="h-[66px] w-full rounded-2xl" />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/shop?tab=marketplace"
      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 transition-colors hover:text-gray-900"
    >
      <ArrowLeft aria-hidden className="h-4 w-4" />
      Marketplace
    </Link>
  );
}

export function ProductDetailView({ slug }: { slug: string }) {
  const { data, isLoading, error, refetch } = useProduct(slug);
  const product = data?.product;

  // Only the user's explicit choices are stored. Everything else — the default
  // variant, the default plan — is derived during render, so the two never fall
  // out of sync with the data that has actually arrived.
  const [chosenVariantId, setChosenVariantId] = useState<string | null>(null);
  const [chosenPlan, setChosenPlan] = useState<{
    variantId: string;
    planId: string;
  } | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const defaultVariantId = product
    ? (product.variants.find((variant) => variant.inStock) ?? product.variants[0])
        .id
    : null;

  const variantId =
    chosenVariantId &&
    product?.variants.some((variant) => variant.id === chosenVariantId)
      ? chosenVariantId
      : defaultVariantId;

  const {
    data: emiData,
    isLoading: isLoadingPlans,
    error: plansError,
    refetch: refetchPlans,
  } = useEmiPlans(slug, variantId ?? undefined);

  const plans = useMemo(() => emiData?.plans ?? [], [emiData]);

  const planId = useMemo(() => {
    const selectable = plans.filter((plan) => plan.withinLimit);
    if (selectable.length === 0) return null;

    // A plan the user picked only survives while they stay on that variant.
    if (
      chosenPlan &&
      chosenPlan.variantId === variantId &&
      selectable.some((plan) => plan.id === chosenPlan.planId)
    ) {
      return chosenPlan.planId;
    }

    return (selectable.find((plan) => plan.isRecommended) ?? selectable[0]).id;
  }, [plans, chosenPlan, variantId]);

  const handlePlanSelect = (nextPlanId: string) => {
    if (!variantId) return;
    setChosenPlan({ variantId, planId: nextPlanId });
  };

  if (isLoading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        {error.includes("not found") ? (
          <StateCard
            icon={PackageX}
            title="Product unavailable"
            description="This product is no longer listed on the 1Fi Marketplace."
          />
        ) : (
          <ErrorState message={error} onRetry={refetch} />
        )}
      </div>
    );
  }

  if (!product || !variantId) return <DetailSkeleton />;

  const variant =
    product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const selectedPlan = plans.find((plan) => plan.id === planId) ?? null;
  const discount = formatDiscount(variant.mrp, variant.price);
  const canProceed = Boolean(selectedPlan) && variant.inStock;

  return (
    <div className="flex flex-col gap-5 pb-24">
      <BackLink />

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-zinc-200 bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 500px) 100vw, 500px"
          className="object-cover"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-white">
            {product.badge}
          </span>
        )}
      </div>

      <header className="flex flex-col gap-1.5">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
          {product.brand}
        </p>
        <h1 className="text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-gray-900">
          {product.name}
        </h1>
        <p className="text-[13px] text-gray-500">{product.tagline}</p>

        <div className="mt-1 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11.5px] font-bold text-emerald-700">
            <Star aria-hidden className="h-3 w-3 fill-emerald-700" />
            {product.rating}
          </span>
          <span className="text-[11.5px] text-gray-500">
            {product.ratingCount.toLocaleString("en-IN")} ratings
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-[24px] font-bold tracking-[-0.02em] text-gray-900">
            {formatInr(variant.price)}
          </span>
          {variant.mrp > variant.price && (
            <>
              <span className="text-[14px] text-gray-400 line-through">
                {formatInr(variant.mrp)}
              </span>
              <span className="text-[13px] font-bold text-emerald-600">
                {discount}% off
              </span>
            </>
          )}
        </div>
        <p className="text-[11.5px] text-gray-500">Inclusive of all taxes</p>
      </header>

      <VariantSelector
        variants={product.variants}
        selectedId={variant.id}
        onSelect={setChosenVariantId}
      />

      <EmiPlanSelector
        plans={plans}
        selectedPlanId={planId}
        onSelect={handlePlanSelect}
        isLoading={isLoadingPlans}
        error={plansError}
        onRetry={refetchPlans}
      />

      <section className="flex flex-col gap-2.5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
          Highlights
        </h2>
        <ul className="flex flex-col gap-2">
          {product.highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-[13px] leading-[1.45] text-gray-700"
            >
              <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {highlight}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-gray-900">
          Product details
        </h2>
        <p className="text-[13px] leading-[1.5] text-gray-600">
          {product.description}
        </p>
        <dl className="mt-1 overflow-hidden rounded-2xl border border-gray-200">
          {product.specs.map((spec, index) => (
            <div
              key={spec.label}
              className={`flex items-start justify-between gap-4 px-3.5 py-2.5 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/70"
              }`}
            >
              <dt className="text-[12.5px] text-gray-500">{spec.label}</dt>
              <dd className="max-w-[58%] text-right text-[12.5px] font-medium text-gray-900">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Sticky CTA sits above the bottom nav, as on the app's other flows. */}
      <div className="fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-40 px-4">
        <div className="mx-auto flex max-w-[468px] items-center gap-3 rounded-[22px] border border-zinc-200 bg-white/95 px-4 py-3 shadow-[0_8px_32px_rgba(20,14,50,0.12)] backdrop-blur">
          <div className="min-w-0 flex-1">
            {selectedPlan ? (
              <>
                <p className="truncate text-[15px] font-bold tracking-[-0.015em] text-gray-900">
                  {formatInr(selectedPlan.monthlyInstalment)}/mo
                </p>
                <p className="truncate text-[11.5px] text-gray-500">
                  {selectedPlan.tenureMonths} months
                  {selectedPlan.isNoCost ? " · No cost EMI" : ""}
                </p>
              </>
            ) : (
              <p className="text-[12.5px] text-gray-500">
                {variant.inStock
                  ? "Select an EMI plan to continue"
                  : "This variant is out of stock"}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={!canProceed}
            onClick={() => setSheetOpen(true)}
            className="shrink-0 rounded-full bg-brand px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Proceed
          </button>
        </div>
      </div>

      {isSheetOpen && selectedPlan && (
        <PlanSummarySheet
          product={product}
          variant={variant}
          plan={selectedPlan}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
