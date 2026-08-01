"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine } from "./types";

interface CartState {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (billboardId: string) => void;
  updateLineDates: (billboardId: string, startDate: string, endDate: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (line) =>
        set((state) => ({
          lines: [...state.lines.filter((l) => l.billboardId !== line.billboardId), line],
        })),
      removeLine: (billboardId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.billboardId !== billboardId) })),
      updateLineDates: (billboardId, startDate, endDate) =>
        set((state) => ({
          lines: state.lines.map((l) => (l.billboardId === billboardId ? { ...l, startDate, endDate } : l)),
        })),
      clear: () => set({ lines: [] }),
    }),
    { name: "adspace_market_cart", storage: createJSONStorage(() => localStorage) },
  ),
);

export function useCartTotal() {
  return useCartStore((state) => state.lines.reduce((sum, line) => sum + line.monthlyPrice, 0));
}
