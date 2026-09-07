import { NextResponse } from "next/server";

import { CREDIT_LIMIT, PRODUCTS } from "@/server/data/products";
import type { ProductDetailResponse } from "@/lib/types";

const MOCK_LATENCY_MS = 350;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** GET /api/products/:slug — product detail plus the user's credit limit. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await delay(MOCK_LATENCY_MS);

  const { slug } = await params;
  const product = PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const body: ProductDetailResponse = { product, limit: CREDIT_LIMIT };
  return NextResponse.json(body);
}
