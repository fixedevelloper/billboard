"use client";

import { useTranslations } from "next-intl";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Wallet } from "./types";

export function WalletBalance({ wallet, loading }: { wallet: Wallet | null; loading: boolean }) {
  const t = useTranslations("wallet");

  return (
    <Card>
      <CardTitle>{t("title")}</CardTitle>
      <CardDescription>{t("description")}</CardDescription>
      <p className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        {loading ? "…" : `${wallet?.balance ?? 0} ${wallet?.currency ?? ""}`}
      </p>
    </Card>
  );
}
