import { NextResponse } from "next/server";

import { buildEmiPlans } from "@/lib/emi";
import { CREDIT_LIMIT, PRODUCTS } from "@/server/data/products";
import type { Product, ProductListResponse } from "@/lib/types";

/** Attaches the cheapest monthly instalment so cards can show "EMI from ₹…". */
function withEmiFrom(product: Product): Product {
  const cheapestVariant = product.variants.reduce((lowest, variant) =>
    variant.price < lowest.price ? variant : lowest,
  );
  const plans = buildEmiPlans(
    cheapestVariant.price,
    product.availableTenures,
    CREDIT_LIMIT.availableLimit,
  );
  const emiFrom = Math.min(...plans.map((plan) => plan.monthlyInstalment));

  return { ...product, emiFrom };
}

/** Mock latency so the UI's loading states are exercised in development. */
const MOCK_LATENCY_MS = 450;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /api/products?q=&category=
 * Mock catalogue endpoint. Search and category filtering happen here so the
 * client never has to hold the full catalogue in memory.
 */
export async function GET(request: Request) {
  await delay(MOCK_LATENCY_MS);

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category");

  // Lets the UI's error state be demonstrated without breaking the app.
  if (searchParams.get("simulate") === "error") {
    return NextResponse.json(
      { message: "Could not load the marketplace.", code: "UPSTREAM_ERROR" },
      { status: 500 },
    );
  }

  let products = PRODUCTS;

  if (category && category !== "all") {
    products = products.filter((product) => product.category === category);
  }

  if (query) {
    products = products.filter((product) =>
      [product.name, product.brand, product.tagline]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  const body: ProductListResponse = {
    products: products.map(withEmiFrom),
    total: products.length,
  };

  return NextResponse.json(body);
}
