import { NextResponse } from "next/server";

import { buildEmiPlans } from "@/lib/emi";
import { CREDIT_LIMIT, PRODUCTS } from "@/server/data/products";

const MOCK_LATENCY_MS = 300;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /api/emi-plans?slug=&variantId=
 * EMI schedules are always computed on the server: the client sends the chosen
 * variant, never a price, so instalments cannot be tampered with or drift.
 */
export async function GET(request: Request) {
  await delay(MOCK_LATENCY_MS);

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const variantId = searchParams.get("variantId");

  const product = PRODUCTS.find((item) => item.slug === slug);
  if (!product) {
    return NextResponse.json(
      { message: "Product not found.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const variant =
    product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  const plans = buildEmiPlans(
    variant.price,
    product.availableTenures,
    CREDIT_LIMIT.availableLimit,
  );

  return NextResponse.json({
    plans,
    principal: variant.price,
    limit: CREDIT_LIMIT,
  });
}
