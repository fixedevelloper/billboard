"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthProvider";
import type { KycStatus, Role } from "@/lib/types";

export interface CurrentUserProfile {
  id: string;
  email: string;
  companyName: string;
  phone?: string;
  role: Role;
  kycStatus: KycStatus;
}

export function useCurrentUser() {
  const { user } = useAuth();
  const { data, error, isLoading } = useSWR(user ? "/api/users/me" : null, async () => {
    const { data } = await api.get<CurrentUserProfile>("/api/users/me");
    return data;
  });

  return { profile: data ?? null, loading: isLoading, error: error ? extractErrorMessage(error) : null };
}
