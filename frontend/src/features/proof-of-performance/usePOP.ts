"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { ProofOfPerformance } from "./types";

export function usePOPByOrder(orderId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    orderId ? `/api/pop/order/${orderId}` : null,
    async () => {
      const { data } = await api.get<ProofOfPerformance[]>(`/api/pop/order/${orderId}`);
      return data;
    },
  );

  return { proofs: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

/**
 * Reads the device's current GPS position, used to geotag a P.O.P capture.
 * Rejects with a plain Error whose message is not localized (browser/OS-dependent
 * or absent) — callers should show their own translated error message instead
 * of relying on `error.message`.
 */
export function captureGeolocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation unsupported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) => reject(new Error(error.message)),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  });
}

export async function submitPOP(input: {
  orderId: string;
  billboardId: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
}) {
  const { data } = await api.post<ProofOfPerformance>("/api/pop", input);
  return data;
}
