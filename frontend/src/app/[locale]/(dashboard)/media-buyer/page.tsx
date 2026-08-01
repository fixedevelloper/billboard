"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProfileCard } from "@/components/layout/ProfileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { payOrder, useDelegatedOrders } from "@/features/booking/useOrders";
import { extractErrorMessage } from "@/lib/api";
import {
    ClipboardList,
    Clock,
    CreditCard,
    TrendingUp,
    Building2,
    FileText,
    ArrowRight,
    AlertCircle,
    Loader2,
    CheckCircle2,
} from "lucide-react";

export default function MediaBuyerPage() {
    const t = useTranslations("mediaBuyer");
    const tCommon = useTranslations("common");
    const tOrderStatus = useTranslations("orderStatus");
    const { orders, loading, refetch } = useDelegatedOrders();
    const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const delegatedOrders = orders.filter((o) => o.status === "DELEGATED").length;
    const paidOrders = orders.filter((o) => o.status === "PAID").length;

    const kpis = [
        {
            key: "totalDelegated" as const,
            value: orders.length,
            icon: ClipboardList,
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-900/30",
            textColor: "text-blue-600 dark:text-blue-400",
        },
        {
            key: "pendingPayment" as const,
            value: delegatedOrders,
            icon: Clock,
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50 dark:bg-amber-900/30",
            textColor: "text-amber-600 dark:text-amber-400",
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
            href: "/media-buyer/orders",
            icon: FileText,
            description: "viewOrdersDesc" as const,
        },
    ];

    async function handlePay(orderId: string) {
        setBusyOrderId(orderId);
        setError(null);
        try {
            await payOrder(orderId, "BANK_TRANSFER");
            await refetch();
        } catch (err) {
            setError(extractErrorMessage(err));
        } finally {
            setBusyOrderId(null);
        }
    }

    const getStatusTone = (status: string) => {
        switch (status) {
            case "DELEGATED":
                return "info";
            case "PENDING_PAYMENT":
                return "warning";
            case "PAID":
                return "success";
            case "CANCELLED":
                return "danger";
            default:
                return "secondary";
        }
    };

    return (
        <DashboardShell role="MEDIA_BUYER">
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {kpis.map((kpi) => {
                            const Icon = kpi.icon;
                            return (
                                <Card key={kpi.key} className="group relative overflow-hidden border-zinc-200 transition-all hover:shadow-lg dark:border-zinc-800">
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

                {/* Delegated Orders Section */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                                {t("delegatedSectionTitle")}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {t("delegatedSectionDescription")}
                            </p>
                        </div>
                        <Badge variant="outline" className="border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            {orders.length} {t("ordersCount", { count: orders.length })}
                        </Badge>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 text-sm font-medium">{error}</div>
                            <button
                                onClick={() => setError(null)}
                                className="rounded-lg p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                            >
                                <AlertCircle className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    {tCommon("loading")}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && orders.length === 0 && (
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <ClipboardList className="h-8 w-8 text-zinc-400" />
                                </div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    {t("noOrders")}
                                </p>
                                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                    {t("noOrdersDescription") || "Aucune commande déléguée pour le moment"}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Orders List */}
                    <div className="space-y-3">
                        {orders.map((order) => {
                            const isBusy = busyOrderId === order.id;
                            const isPaid = order.status === "PAID";

                            return (
                                <Card
                                    key={order.id}
                                    className="group relative overflow-hidden border-zinc-200 transition-all hover:shadow-md dark:border-zinc-800"
                                >
                                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                                        {/* Order Info */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        {t("orderSummary", {
                                                            count: order.items.length,
                                                            amount: order.totalAmount,
                                                            currency: order.currency,
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        {t("orderId", { id: order.id.slice(0, 8) })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge tone={getStatusTone(order.status)} className="text-xs">
                                                    {tOrderStatus(order.status)}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {order.status === "DELEGATED" && (
                                            <Button
                                                size="sm"
                                                loading={isBusy}
                                                onClick={() => handlePay(order.id)}
                                                className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 shadow-sm"
                                            >
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                {t("payOnBehalf")}
                                            </Button>
                                        )}

                                        {isPaid && (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span className="text-sm font-medium">{t("paid") || "Payée"}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}