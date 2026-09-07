/** Domain types shared by the mock API layer and the UI. */

export type ProductCategory =
  | "smartphone"
  | "laptop"
  | "tablet"
  | "audio"
  | "wearable"
  | "television";

/** A selectable configuration of a product (storage / colour / size). */
export interface ProductVariant {
  id: string;
  /** e.g. "256 GB · Natural Titanium" */
  label: string;
  storage?: string;
  color?: string;
  colorHex?: string;
  /** Price in paise-free rupees, inclusive of taxes. */
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  image: string;
  rating: number;
  ratingCount: number;
  highlights: string[];
  specs: ProductSpec[];
  variants: ProductVariant[];
  /** Tenures (in months) the lender has approved for this product. */
  availableTenures: number[];
  badge?: string;
  /**
   * Lowest monthly instalment across the approved tenures. Computed by the API
   * so listing cards never re-implement the EMI maths.
   */
  emiFrom?: number;
}

/** A single EMI offer, always derived server-side from price + tenure. */
export interface EmiPlan {
  id: string;
  tenureMonths: number;
  /** Annual reducing-balance interest rate. 0 for no-cost EMI. */
  interestRate: number;
  monthlyInstalment: number;
  totalPayable: number;
  totalInterest: number;
  isNoCost: boolean;
  isRecommended: boolean;
  /** False when the plan needs more pledged limit than the user has. */
  withinLimit: boolean;
}

/** The user's mutual-fund backed credit limit. */
export interface CreditLimit {
  totalLimit: number;
  availableLimit: number;
  pledgedValue: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
}

export interface ProductDetailResponse {
  product: Product;
  limit: CreditLimit;
}

export interface ApiError {
  message: string;
  code: string;
}
