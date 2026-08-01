"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { CartLine } from "./types";

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (billboardId: string) => void;
  clear: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addLine = useCallback((line: CartLine) => {
    setLines((current) => [...current.filter((l) => l.billboardId !== line.billboardId), line]);
  }, []);

  const removeLine = useCallback((billboardId: string) => {
    setLines((current) => current.filter((l) => l.billboardId !== billboardId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalAmount = useMemo(() => lines.reduce((sum, l) => sum + l.monthlyPrice, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, addLine, removeLine, clear, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
