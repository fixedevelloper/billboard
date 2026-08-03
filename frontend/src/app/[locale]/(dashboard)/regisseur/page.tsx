"use client";

import { useTranslations } from "next-intl";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProfileCard } from "@/components/layout/ProfileCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useMyBillboards } from "@/features/billboards/useBillboards";
import { useWallet } from "@/features/wallet/useWallet";
import { WalletBalance } from "@/features/wallet/WalletBalance";

export default function RegisseurPage() {
  const t = useTranslations("regisseur");
  const { billboards, loading } = useMyBillboards();
  const { wallet, loading: walletLoading } = useWallet();

  const available = billboards.filter((b) => b.status === "AVAILABLE").length;
  const reserved = billboards.filter((b) => b.status === "RESERVED").length;

  const kpis = [
    { key: "totalBillboards" as const, value: billboards.length },
    { key: "available" as const, value: available },
    { key: "reserved" as const, value: reserved },
  ];

  return (
    <DashboardShell role="REGISSEUR">
      <h1 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
      <p className="mb-6 text-sm text-zinc-500">{t("subtitle")}</p>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ProfileCard />
        <WalletBalance wallet={wallet} loading={walletLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpis.map((kpi) => (
          <Link key={kpi.key} href="/regisseur/billboards">
            <Card className="transition-colors hover:border-blue-400">
              <CardDescription>{t(kpi.key)}</CardDescription>
              <CardTitle className="text-3xl">{loading ? "…" : kpi.value}</CardTitle>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/regisseur/billboards" className="text-sm font-medium text-blue-600 hover:underline">
          {t("viewInventory")}
        </Link>
        <Link href="/regisseur/billboards/new" className="text-sm font-medium text-blue-600 hover:underline">
          {t("addBillboard")}
        </Link>
      </div>
    </DashboardShell>
  );
}
