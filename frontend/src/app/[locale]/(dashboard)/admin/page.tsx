"use client";

import { useTranslations } from "next-intl";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { useAdminBillboards, useAdminOrders, useAdminUsers } from "@/features/admin/useAdmin";
import {
    Users,
    ShieldAlert,
    MapPin,
    ShoppingBag,
    ArrowRight,
    ShieldCheck,
    ChevronRight,
    Sparkles,
    AlertCircle,
    Activity,
} from "lucide-react";

export default function AdminOverviewPage() {
    const t = useTranslations("adminOverview");
    const { users, loading: usersLoading } = useAdminUsers();
    const { billboards, loading: billboardsLoading } = useAdminBillboards();
    const { orders, loading: ordersLoading } = useAdminOrders();

    const pendingKyc = users.filter((u) => u.kycStatus === "PENDING").length;

    const kpis = [
        {
            key: "totalUsers",
            value: users.length,
            loading: usersLoading,
            href: "/admin/users",
            icon: Users,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-50 dark:bg-blue-950/40",
            borderColor: "border-blue-100 dark:border-blue-900/40",
        },
        {
            key: "pendingKyc",
            value: pendingKyc,
            loading: usersLoading,
            href: "/admin/users",
            icon: ShieldAlert,
            color: pendingKyc > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400",
            bgColor: pendingKyc > 0 ? "bg-amber-50 dark:bg-amber-950/40" : "bg-emerald-50 dark:bg-emerald-950/40",
            borderColor: pendingKyc > 0 ? "border-amber-200/80 dark:border-amber-900/50" : "border-emerald-100 dark:border-emerald-900/40",
            highlight: pendingKyc > 0,
        },
        {
            key: "totalBillboards",
            value: billboards.length,
            loading: billboardsLoading,
            href: "/admin/billboards",
            icon: MapPin,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
            borderColor: "border-emerald-100 dark:border-emerald-900/40",
        },
        {
            key: "totalOrders",
            value: orders.length,
            loading: ordersLoading,
            href: "/admin/orders",
            icon: ShoppingBag,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-50 dark:bg-purple-950/40",
            borderColor: "border-purple-100 dark:border-purple-900/40",
        },
    ];

    const quickActions = [
        {
            labelKey: "manageUsers",
            href: "/admin/users",
            icon: Users,
            badge: pendingKyc > 0 ? `${pendingKyc} KYC à valider` : null,
        },
        {
            labelKey: "manageBillboards",
            href: "/admin/billboards",
            icon: MapPin,
        },
        {
            labelKey: "manageOrders",
            href: "/admin/orders",
            icon: ShoppingBag,
        },
    ];

    return (
        <DashboardShell role="ADMIN">
            <div className="space-y-8 max-w-7xl mx-auto">

                {/* EN-TÊTE DE PAGE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-50 dark:bg-amber-950/40 px-3 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Espace Supervision Globale</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t("title")}
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {t("subtitle")}
                        </p>
                    </div>
                </div>

                {/* BANNIÈRE D'ALERTE D'ACTION REQUISE (SI KYC EN ATTENTE) */}
                {!usersLoading && pendingKyc > 0 && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                    Vérifications KYC requises
                                </h2>
                                <p className="text-xs text-amber-700 dark:text-amber-400">
                                    Il y a actuellement <span className="font-bold">{pendingKyc}</span> compte(s) en attente d'approbation.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors shrink-0"
                        >
                            <span>Traiter les dossiers</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                )}

                {/* GRILLE DES CARTES KPI */}
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5" />
                        Indicateurs clés de la plateforme
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {kpis.map((kpi) => {
                            const Icon = kpi.icon;

                            return (
                                <Link key={kpi.key} href={kpi.href} className="group">
                                    <Card
                                        className={`relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border bg-white dark:bg-zinc-900 ${kpi.borderColor} ${
                                            kpi.highlight ? "ring-2 ring-amber-500/20" : ""
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {t(kpi.key)}
                      </span>
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.bgColor} ${kpi.color}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-baseline justify-between">
                                            {kpi.loading ? (
                                                <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                            ) : (
                                                <div className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                                                    {kpi.value}
                                                </div>
                                            )}

                                            <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* SECTION ACTIONS RAPIDES */}
                <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Modules de gestion
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {quickActions.map((action) => {
                            const ActionIcon = action.icon;

                            return (
                                <Link key={action.labelKey} href={action.href} className="group">
                                    <div className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:border-blue-500/40 hover:bg-blue-50/30 dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-blue-900/50 dark:hover:bg-blue-950/20">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ActionIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {t(action.labelKey)}
                                                </p>
                                                {action.badge && (
                                                    <span className="inline-block mt-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            {action.badge}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

            </div>
        </DashboardShell>
    );
}