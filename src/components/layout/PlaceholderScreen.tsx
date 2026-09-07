import { Construction } from "lucide-react";

import { StateCard } from "@/components/ui/States";

/**
 * The rest of the 1Fi app lives outside this assignment; these routes exist so
 * the bottom navigation stays fully functional.
 */
export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <h1 className="text-[22px] font-bold tracking-[-0.02em] text-gray-900">
        {title}
      </h1>
      <StateCard
        icon={Construction}
        title="Part of the existing app"
        description="This screen is outside the scope of the Marketplace assignment."
      />
    </div>
  );
}
