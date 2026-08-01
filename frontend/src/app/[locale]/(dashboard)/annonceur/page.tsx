"use client";

import { useTranslations } from "next-intl";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProfileCard } from "@/components/layout/ProfileCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useMyOrders } from "@/features/booking/useOrders";
import {
    ShoppingCart,
    Clock,
    DollarSign,
    TrendingUp,
    ArrowRight,
    Building2,
    FileText,
} from "lucide-react";

const CURRENCY = "XAF";

export default function AnnonceurPage() {
    const t = useTranslations("annonceur");
    const { orders, loading } = useMyOrders();

    const pendingPayment = orders.filter((o) => o.status === "PENDING_PAYMENT").length;
    const paidOrders = orders.filter((o) => o.status === "PAID").length;
    const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const kpis = [
        {
            key: "totalOrders" as const,
            value: orders.length,
            href: "/annonceur/orders",
            icon: ShoppingCart,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/30",
            textColor: "text-blue-600 dark:text-blue-400",
        },
        {
            key: "pendingPayment" as const,
            value: pendingPayment,
            href: "/annonceur/orders",
            icon: Clock,
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-900/30",
            textColor: "text-amber-600 dark:text-amber-400",
        },
        {
            key: "totalAmount" as const,
            value: `${totalAmount.toLocaleString()} ${CURRENCY}`,
            href: "/annonceur/orders",
            icon: DollarSign,
            color: "from-green-500 to-green-600",
            bgColor: "bg-green-50 dark:bg-green-900/30",
            textColor: "text-green-600 dark:text-green-400",
        },
    ];

    const quickActions = [
        {
            key: "browseBillboards" as const,
            href: "/billboards",
            icon: Building2,
            description: "browseBillboardsDesc" as const,
        },
        {
            key: "viewOrders" as const,
            href: "/annonceur/orders",
            icon: FileText,
            description: "viewOrdersDesc" as const,
        },
    ];

    return (
        <DashboardShell role="ANNONCEUR">
            <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("subtitle")}</p>
                </div>

                {/* Profile Card */}
                <div>
                    <ProfileCard />
                </div>

                {/* KPIs */}
                <div>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t("overview") || "Vue d'ensemble"}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {kpis.map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <Link key={kpi.key} href={kpi.href}>
                                    <Card className="group relative overflow-hidden border-zinc-200 transition-all hover:shadow-lg dark:border-zinc-800">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-2">
                                                    <CardDescription className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                                        {t(kpi.key)}
                                                    </CardDescription>
                                                    <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                                                        {loading ? (
                                                            <div className="h-9 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                                                        ) : (
                                                            kpi.value
                                                        )}
                                                    </CardTitle>
                                                </div>
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bgColor} transition-transform group-hover:scale-110`}
                                                >
                                                    <Icon className={`h-6 w-6 ${kpi.textColor}`} />
                                                </div>
                                            </div>
                                            {/* Gradient accent */}
                                            <div
                                                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.color} opacity-0 transition-opacity group-hover:opacity-100`}
                                            />
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t("quickActions") || "Actions rapides"}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.key} href={action.href}>
                                    <Card className="group border-zinc-200 transition-all hover:shadow-md hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                                        <CardContent className="flex items-center gap-4 p-5">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 transition-colors group-hover:bg-blue-100 dark:bg-zinc-800 dark:group-hover:bg-blue-900/30">
                                                <Icon className="h-6 w-6 text-zinc-600 transition-colors group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                                                    {t(action.key)}
                                                </p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {t(action.description) || "Accédez à cette section"}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:text-zinc-500 dark:group-hover:text-blue-400" />
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Summary */}
                {!loading && orders.length > 0 && (
                    <div>
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                            {t("statistics") || "Statistiques"}
                        </h2>
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            {t("paidOrders") || "Commandes payées"}
                                        </p>
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{paidOrders}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            {t("pendingOrders") || "En attente"}
                                        </p>
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{pendingPayment}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            {t("conversionRate") || "Taux de conversion"}
                                        </p>
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                            {orders.length > 0 ? Math.round((paidOrders / orders.length) * 100) : 0}%
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            {t("avgOrderValue") || "Panier moyen"}
                                        </p>
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                            {orders.length > 0
                                                ? `${Math.round(totalAmount / orders.length).toLocaleString()} ${CURRENCY}`
                                                : `0 ${CURRENCY}`}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}