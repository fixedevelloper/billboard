"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { Billboard, BillboardCreateInput, BillboardSearchParams } from "./types";

export function useBillboards(params: BillboardSearchParams = {}) {
  const key = ["/api/billboards", params.city, params.country, params.type, params.status];
  const { data, error, isLoading, mutate } = useSWR(key, async () => {
    const { data } = await api.get<Billboard[]>("/api/billboards", { params });
    return data;
  });

  return { billboards: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

export function useMyBillboards() {
  const { data, error, isLoading, mutate } = useSWR("/api/billboards/mine", async () => {
    const { data } = await api.get<Billboard[]>("/api/billboards/mine");
    return data;
  });

  return { billboards: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

export async function createBillboard(input: BillboardCreateInput) {
  const { data } = await api.post<Billboard>("/api/billboards", input);
  return data;
}
