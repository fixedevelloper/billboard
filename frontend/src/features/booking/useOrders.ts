"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { CartLine, Order } from "./types";

export function useMyOrders() {
  const { data, error, isLoading, mutate } = useSWR("/api/bookings/mine", async () => {
    const { data } = await api.get<Order[]>("/api/bookings/mine");
    return data;
  });

  return { orders: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

export function useDelegatedOrders() {
  const { data, error, isLoading, mutate } = useSWR("/api/bookings/delegated-to-me", async () => {
    const { data } = await api.get<Order[]>("/api/bookings/delegated-to-me");
    return data;
  });

  return { orders: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

export async function createOrder(currency: string, lines: CartLine[]) {
  const { data } = await api.post<Order>("/api/bookings", {
    currency,
    items: lines.map((l) => ({ billboardId: l.billboardId, startDate: l.startDate, endDate: l.endDate })),
  });
  return data;
}

export async function checkoutOrder(orderId: string) {
  const { data } = await api.post<Order>(`/api/bookings/${orderId}/checkout`);
  return data;
}

export async function delegateOrder(orderId: string, mediaBuyerId: string) {
  const { data } = await api.post<Order>(`/api/bookings/${orderId}/delegate`, { mediaBuyerId });
  return data;
}

export async function cancelOrder(orderId: string) {
  await api.post(`/api/bookings/${orderId}/cancel`);
}

export async function payOrder(orderId: string, method: string) {
  const { data } = await api.post(`/api/payments/${orderId}/pay`, { method });
  return data;
}
