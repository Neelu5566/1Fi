import { NextResponse } from "next/server";

import { CREDIT_LIMIT } from "@/server/data/products";

/** GET /api/limit — the user's mutual-fund backed spending limit. */
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return NextResponse.json(CREDIT_LIMIT);
}
