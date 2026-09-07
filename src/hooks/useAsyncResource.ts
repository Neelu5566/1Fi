"use client";

import { useCallback, useEffect, useState } from "react";

export interface AsyncResource<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  /** Re-runs the fetcher; wired to every "Try again" button in the UI. */
  refetch: () => void;
}

interface Settled<T> {
  /** The fetcher + attempt this result belongs to. */
  fetcher: unknown;
  attempt: number;
  data: T | null;
  error: string | null;
}

/**
 * One fetching primitive for the whole marketplace: loading, error and retry in
 * a single place, with in-flight requests aborted when the inputs change or the
 * component unmounts. Keeps every screen's state handling identical.
 *
 * `fetcher` must be memoised by the caller (the hooks in useMarketplace wrap it
 * in useCallback) — its identity is what defines a request.
 */
export function useAsyncResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
): AsyncResource<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSettled({ fetcher, attempt, data, error: null });
      })
      .catch((caught: unknown) => {
        if (controller.signal.aborted) return;
        setSettled({
          fetcher,
          attempt,
          data: null,
          error:
            caught instanceof Error
              ? caught.message
              : "Something went wrong. Please try again.",
        });
      });

    return () => controller.abort();
  }, [fetcher, attempt]);

  const refetch = useCallback(() => setAttempt((value) => value + 1), []);

  // Comparing the settled result against the current request gives us
  // `isLoading` as derived state — no setState during render, and none
  // synchronously inside the effect.
  const isCurrent = settled?.fetcher === fetcher && settled.attempt === attempt;

  return {
    data: isCurrent ? settled.data : null,
    isLoading: !isCurrent,
    error: isCurrent ? settled.error : null,
    refetch,
  };
}
