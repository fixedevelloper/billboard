"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { Billboard } from "@/features/billboards/types";
import type { Order } from "@/features/booking/types";
import type { AdminUser, KycStatus } from "./types";

export function useAdminUsers() {
  const { data, error, isLoading, mutate } = useSWR("/api/users", async () => {
    const { data } = await api.get<AdminUser[]>("/api/users");
    return data;
  });

  return { users: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

export async function updateKycStatus(userId: string, status: KycStatus) {
  const { data } = await api.patch<AdminUser>(`/api/users/${userId}/kyc`, { status });
  return data;
}

export function useAdminBillboards() {
  const { data, error, isLoading } = useSWR("/api/billboards", async () => {
    const { data } = await api.get<Billboard[]>("/api/billboards");
    return data;
  });

  return { billboards: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null };
}

export function useAdminOrders() {
  const { data, error, isLoading } = useSWR("/api/bookings", async () => {
    const { data } = await api.get<Order[]>("/api/bookings");
    return data;
  });

  return { orders: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null };
}
