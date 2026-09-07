import type {
  CreditLimit,
  EmiPlan,
  ProductDetailResponse,
  ProductListResponse,
} from "./types";

export class ApiRequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
  }
}

/**
 * Single place where HTTP concerns live: JSON parsing, error shaping and abort
 * support. Hooks and components only ever see typed data or an ApiRequestError.
 */
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, { signal, headers: { Accept: "application/json" } });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiRequestError(
      "You appear to be offline. Check your connection and try again.",
      "NETWORK_ERROR",
      0,
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiRequestError(
      body?.message ?? "Something went wrong. Please try again.",
      body?.code ?? "UNKNOWN",
      response.status,
    );
  }

  return (await response.json()) as T;
}

export interface EmiPlansResponse {
  plans: EmiPlan[];
  principal: number;
  limit: CreditLimit;
}

export const marketplaceApi = {
  listProducts(
    params: { query?: string; category?: string },
    signal?: AbortSignal,
  ): Promise<ProductListResponse> {
    const search = new URLSearchParams();
    if (params.query) search.set("q", params.query);
    if (params.category && params.category !== "all") {
      search.set("category", params.category);
    }
    const qs = search.toString();
    return request<ProductListResponse>(`/api/products${qs ? `?${qs}` : ""}`, signal);
  },

  getProduct(slug: string, signal?: AbortSignal): Promise<ProductDetailResponse> {
    return request<ProductDetailResponse>(`/api/products/${slug}`, signal);
  },

  getEmiPlans(
    slug: string,
    variantId: string,
    signal?: AbortSignal,
  ): Promise<EmiPlansResponse> {
    const search = new URLSearchParams({ slug, variantId });
    return request<EmiPlansResponse>(`/api/emi-plans?${search.toString()}`, signal);
  },
};
