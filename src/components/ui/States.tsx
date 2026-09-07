import type { LucideIcon } from "lucide-react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";

/** Shimmering placeholder block, used by every loading skeleton. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden rounded-xl bg-gray-100",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent",
        className,
      )}
    />
  );
}

/**
 * The app's empty-state card. Same shape is used for "no results" and, with a
 * retry action, for failures — so the two never look like different products.
 */
export function StateCard({
  icon: Icon,
  title,
  description,
  action,
  tone = "brand",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: "brand" | "danger";
}) {
  return (
    <div className="flex flex-col items-center rounded-[20px] border border-zinc-200 bg-white px-6 py-9 text-center shadow-[var(--shop-shadow-card)]">
      <div
        className={cn(
          "mb-3.5 flex h-14 w-14 items-center justify-center rounded-full",
          tone === "brand"
            ? "bg-brand-tint-strong text-brand"
            : "bg-red-50 text-red-500",
        )}
      >
        <Icon aria-hidden className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold tracking-[-0.015em] text-gray-900">
        {title}
      </h3>
      <p className="mt-1.5 max-w-[30ch] text-[13.5px] leading-[1.45] text-gray-500">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Failure state with a retry that re-runs the underlying request. */
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <StateCard
      icon={AlertTriangle}
      tone="danger"
      title="Something went wrong"
      description={message}
      action={
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark active:scale-[0.98]"
        >
          <RefreshCw aria-hidden className="h-4 w-4" />
          Try again
        </button>
      }
    />
  );
}
