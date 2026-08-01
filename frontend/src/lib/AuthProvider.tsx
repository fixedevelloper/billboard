"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, extractErrorMessage, getStoredToken, setStoredToken } from "./api";
import type { AuthResponse, AuthUser, Role } from "./types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
}

export interface RegisterInput {
  email: string;
  password: string;
  companyName: string;
  phone?: string;
  role: Role;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "adspace_market_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // One-time hydration from localStorage (unavailable during SSR, so this can't be a lazy useState initializer).
    const token = getStoredToken();
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(USER_STORAGE_KEY) : null;
    if (token && raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(raw) as AuthUser);
    }
    setLoading(false);
  }, []);

  const persist = useCallback((response: AuthResponse) => {
    const authUser: AuthUser = {
      userId: response.userId,
      email: response.email,
      companyName: response.companyName,
      role: response.role,
    };
    setStoredToken(response.token);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return authUser;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
        return persist(data);
      } catch (error) {
        throw new Error(extractErrorMessage(error));
      }
    },
    [persist],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const { data } = await api.post<AuthResponse>("/api/auth/register", input);
        return persist(data);
      } catch (error) {
        throw new Error(extractErrorMessage(error));
      }
    },
    [persist],
  );

  const logout = useCallback(() => {
    setStoredToken(null);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
