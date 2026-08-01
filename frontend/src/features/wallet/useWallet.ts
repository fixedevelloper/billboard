"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { Wallet } from "./types";

export function useWallet() {
  const { data, error, isLoading, mutate } = useSWR("/api/payments/wallet/me", async () => {
    const { data } = await api.get<Wallet>("/api/payments/wallet/me");
    return data;
  });

  return { wallet: data ?? null, loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}
