"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthProvider";
import type { Notification } from "./types";

export function useNotifications() {
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(user ? "/api/notifications/mine" : null, async () => {
    const { data } = await api.get<Notification[]>("/api/notifications/mine");
    return data;
  });

  return { notifications: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null };
}
