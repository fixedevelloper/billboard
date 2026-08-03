"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { City } from "./types";

/** Debounced search against GET /api/cities, used by the city picker in the billboard form. */
export function useCitySearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data, error, isLoading } = useSWR(["/api/cities", debouncedQuery], async () => {
    const { data } = await api.get<City[]>("/api/cities", {
      params: debouncedQuery ? { query: debouncedQuery } : {},
    });
    return data;
  });

  return { cities: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null };
}
