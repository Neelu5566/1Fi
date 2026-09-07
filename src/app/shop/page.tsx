import Image from "next/image";

import { ShopContent } from "@/components/shop/ShopContent";
import { resolveShopTab } from "@/lib/shop-tabs";

export const metadata = {
  title: "Shop | 1Fi",
};

/** Shop page shell: the existing hero banner plus the tabbed content. */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  // Resolving the tab on the server keeps the page server-rendered — reading it
  // from useSearchParams instead would opt the whole route into client-only
  // rendering and ship a blank first paint.
  const { tab } = await searchParams;

  return (
    <div className="relative">
      <section className="-mx-4 -mt-4 overflow-hidden">
        <Image
          src="/banners/shop-hero.svg"
          alt="Shop today, pay later using mutual funds"
          width={800}
          height={400}
          priority
          className="w-full object-cover"
        />
      </section>

      <div className="relative z-2 -mt-7 flex flex-col gap-4 px-1">
        <ShopContent initialTab={resolveShopTab(tab)} />
      </div>
    </div>
  );
}
