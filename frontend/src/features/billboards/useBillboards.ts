"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type {
  Billboard,
  BillboardCreateInput,
  BillboardUpdateInput,
  BillboardSearchParams
} from "./types";

// 1. Récupération de tous les panneaux (avec filtres optionnels)
export function useBillboards(params: BillboardSearchParams = {}) {
  const key = ["/api/billboards", params.city, params.country, params.type, params.status];
  const { data, error, isLoading, mutate } = useSWR(key, async () => {
    const { data } = await api.get<Billboard[]>("/api/billboards", { params });
    return data;
  });

  return {
    billboards: data ?? [],
    loading: isLoading,
    error: error ? extractErrorMessage(error) : null,
    refetch: mutate,
  };
}

// 2. Récupération des panneaux appartenant au régisseur connecté
export function useMyBillboards() {
  const { data, error, isLoading, mutate } = useSWR("/api/billboards/mine", async () => {
    const { data } = await api.get<Billboard[]>("/api/billboards/mine");
    return data;
  });

  return {
    billboards: data ?? [],
    loading: isLoading,
    error: error ? extractErrorMessage(error) : null,
    refetch: mutate,
  };
}

// 3. Récupération d'un seul panneau par son ID (pour la page d'édition ou détails)
export function useBillboard(id: string | null | undefined) {
  const key = id ? `/api/billboards/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(key, async () => {
    if (!id) return null;
    const { data } = await api.get<Billboard>(`/api/billboards/${id}`);
    return data;
  });

  return {
    billboard: data ?? null,
    loading: isLoading,
    error: error ? extractErrorMessage(error) : null,
    refetch: mutate,
  };
}

// 4. Création d'un panneau
export async function createBillboard(input: BillboardCreateInput) {
  const { data } = await api.post<Billboard>("/api/billboards", input);
  return data;
}

// 5. Mise à jour d'un panneau
export async function updateBillboard(id: string, input: BillboardUpdateInput) {
  const { data } = await api.put<Billboard>(`/api/billboards/${id}`, input);
  return data;
}

// 6. Suppression d'un panneau
export async function deleteBillboard(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/api/billboards/${id}`);
  return data;
}