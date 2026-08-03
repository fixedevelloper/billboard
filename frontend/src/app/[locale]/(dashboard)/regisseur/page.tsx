"use client";

import { useTranslations } from "next-intl";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProfileCard } from "@/components/layout/ProfileCard";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useMyBillboards } from "@/features/billboards/useBillboards";
import { useWallet } from "@/features/wallet/useWallet";
import { WalletBalance } from "@/features/wallet/WalletBalance";
import { ArrowRight, Plus } from "lucide-react";

export default function RegisseurPage() {
    const t = useTranslations("regisseur");
    const { billboards = [], loading } = useMyBillboards();
    const { wallet, loading: walletLoading } = useWallet();

    const available = billboards.filter((b) => b.status === "AVAILABLE").length;
    const reserved = billboards.filter((b) => b.status === "RESERVED").length;

    const kpis = [
        { key: "totalBillboards" as const, value: billboards.length, accent: "from-blue-500 to-blue-600" },
        { key: "available" as const, value: available, accent: "from-emerald-500 to-emerald-600" },
        { key: "reserved" as const, value: reserved, accent: "from-amber-500 to-amber-600" },
    ];

    return (
        <DashboardShell role="REGISSEUR">
            <div className="space-y-6">
                {/* Header */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                                {t("title")}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                {t("subtitle")}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/regisseur/billboards"
                                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
                            >
                                {t("viewInventory")}
                                <ArrowRight className="h-4 w-4" />
                            </Link>

                            <Link
                                href="/regisseur/billboards/new"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                {t("addBillboard")}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Profile + Wallet */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <ProfileCard />
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                        <WalletBalance wallet={wallet} loading={walletLoading} />
                    </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {kpis.map((kpi) => (
                        <Link key={kpi.key} href="/regisseur/billboards">
                            <Card className="group overflow-hidden border-zinc-200 bg-white p-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                                <div className={`h-1 bg-gradient-to-r ${kpi.accent}`} />
                                <div className="p-5">
                                    <CardDescription className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        {t(kpi.key)}
                                    </CardDescription>
                                    <CardTitle className="mt-2 text-3xl font-bold text-zinc-900 transition-colors dark:text-zinc-50">
                                        {loading ? "…" : kpi.value}
                                    </CardTitle>
                                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                        {kpi.key === "totalBillboards"
                                            ? "Vue globale de votre inventaire"
                                            : kpi.key === "available"
                                                ? "Panneaux prêts à être réservés"
                                                : "Panneaux déjà réservés"}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </DashboardShell>
    );
}