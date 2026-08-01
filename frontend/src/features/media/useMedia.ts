"use client";

import useSWR from "swr";
import { api, extractErrorMessage } from "@/lib/api";
import type { StoredImage } from "./types";

export function useMyImages() {
  const { data, error, isLoading, mutate } = useSWR("/api/media/mine", async () => {
    const { data } = await api.get<StoredImage[]>("/api/media/mine");
    return data;
  });

  return { images: data ?? [], loading: isLoading, error: error ? extractErrorMessage(error) : null, refetch: mutate };
}

export async function uploadImage(file: File): Promise<StoredImage> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<StoredImage>("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteImage(id: string): Promise<void> {
  await api.delete(`/api/media/${id}`);
}
