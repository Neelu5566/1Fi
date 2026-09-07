"use client";

import { useCallback, useEffect, useState } from "react";

import { marketplaceApi } from "@/lib/api";
import { useAsyncResource } from "./useAsyncResource";

/** Debounce so typing in the search field doesn't fire a request per keystroke. */
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function useProducts(query: string, category: string) {
  const debouncedQuery = useDebouncedValue(query);

  const fetcher = useCallback(
    (signal: AbortSignal) =>
      marketplaceApi.listProducts({ query: debouncedQuery, category }, signal),
    [debouncedQuery, category],
  );

  return useAsyncResource(fetcher);
}

export function useProduct(slug: string) {
  const fetcher = useCallback(
    (signal: AbortSignal) => marketplaceApi.getProduct(slug, signal),
    [slug],
  );

  return useAsyncResource(fetcher);
}

export function useEmiPlans(slug: string, variantId: string | undefined) {
  const fetcher = useCallback(
    (signal: AbortSignal) => {
      if (!variantId) return Promise.resolve(null);
      return marketplaceApi.getEmiPlans(slug, variantId, signal);
    },
    [slug, variantId],
  );

  return useAsyncResource(fetcher);
}
