"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  House,
  ReceiptIndianRupee,
  Store,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/emi-dues", label: "EMI Dues", icon: ReceiptIndianRupee },
  { href: "/pledged-funds", label: "Limit", icon: ChartNoAxesCombined },
  { href: "/profile", label: "Profile", icon: User },
];

/** The app's existing floating bottom navigation. */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[500px] items-stretch rounded-[28px] border border-white/40 bg-white px-1.5 py-1.5 shadow-[var(--shop-shadow-nav)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-[3px] rounded-[18px] px-1 py-2 text-center transition-all duration-200",
                isActive
                  ? "text-brand"
                  : "text-gray-400 hover:text-gray-600",
              )}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute -top-[3px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-brand"
                />
              )}
              <Icon
                aria-hidden
                strokeWidth={isActive ? 2 : 1.75}
                className={cn(
                  "relative h-[22px] w-[22px] transition-transform duration-200 group-active:scale-90",
                  isActive && "drop-shadow-[0_0_6px_rgba(113,44,220,0.3)]",
                )}
              />
              <span
                className={cn(
                  "relative max-w-full truncate text-[10px] tracking-wide",
                  isActive ? "font-bold" : "font-medium",
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
