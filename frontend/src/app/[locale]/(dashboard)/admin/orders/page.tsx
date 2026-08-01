"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminOrders } from "@/features/admin/useAdmin";
import type { OrderStatus, Order } from "@/features/booking/types";
import {
  ShoppingBag,
  Search,
  FilterX,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  CreditCard,
  FileText,
  Send,
  X,
  Package,
  Copy,
  Check,
  Receipt,
  TrendingUp,
  User,
} from "lucide-react";

// Configuration visuelle des statuts de commande
const STATUS_CONFIG: Record<
    OrderStatus,
    { icon: React.ElementType; style: string }
> = {
  DRAFT: {
    icon: FileText,
    style: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
  PENDING_PAYMENT: {
    icon: Clock,
    style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
  DELEGATED: {
    icon: Send,
    style: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900",
  },
  PAID: {
    icon: CreditCard,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  CONFIRMED: {
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  CANCELLED: {
    icon: XCircle,
    style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  },
  EXPIRED: {
    icon: AlertCircle,
    style: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900",
  },
};

export default function AdminOrdersPage() {
  const t = useTranslations("adminOrders");
  const tStatus = useTranslations("orderStatus");
  const tCommon = useTranslations("common");
  const { orders, loading } = useAdminOrders();

  // Filtres locaux
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Métriques financières et globales
  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.status === "PAID" || o.status === "CONFIRMED");
    const totalVolume = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const currency = orders[0]?.currency || "XAF";

    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING_PAYMENT" || o.status === "DELEGATED").length,
      confirmed: paidOrders.length,
      totalVolume,
      currency,
    };
  }, [orders]);

  // Filtrage combiné des commandes
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.annonceurId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
  };

  return (
      <DashboardShell role="ADMIN">
        <div className="space-y-6 max-w-7xl mx-auto">

          {/* EN-TÊTE DE PAGE */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2">
                <Receipt className="h-3.5 w-3.5" />
                <span>Suivi Commercial & Facturation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("title")}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {t("subtitle")}
              </p>
            </div>

            {/* Micro Cartes de Métriques */}
            {!loading && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-zinc-200/80 bg-white px-3 py-1.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <ShoppingBag className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Total:</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-1.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">En attente:</span>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">{stats.pending}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-3 py-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Volume :</span>
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                  {new Intl.NumberFormat().format(stats.totalVolume)} {stats.currency}
                </span>
                  </div>
                </div>
            )}
          </div>

          {/* BARRE DE RECHERCHE ET FILTRES */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 p-3.5 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">

            {/* Recherche textuelle */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <Input
                  type="text"
                  placeholder="Rechercher par ID de commande ou ID d'annonceur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50"
              />
              {searchQuery && (
                  <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
              )}
            </div>

            {/* Filtre Statut */}
            <div className="w-full md:w-56">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="DRAFT">Brouillon (Draft)</SelectItem>
                  <SelectItem value="PENDING_PAYMENT">En attente de paiement</SelectItem>
                  <SelectItem value="DELEGATED">Délégué</SelectItem>
                  <SelectItem value="PAID">Payé</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmé</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                  <SelectItem value="EXPIRED">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bouton Réinitialiser */}
            {hasActiveFilters && (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResetFilters}
                    className="h-10 px-3 text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 shrink-0"
                >
                  <FilterX className="h-4 w-4 mr-1.5" />
                  Effacer
                </Button>
            )}
          </div>

          {/* ÉTAT DE CHARGEMENT */}
          {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-16 w-full animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-800/40"
                    />
                ))}
              </div>
          )}

          {/* ÉTAT SANS RÉSULTAT */}
          {!loading && filteredOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {orders.length === 0 ? t("noOrders") : "Aucune commande ne correspond à votre recherche"}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                  Ajustez vos filtres de recherche ou réinitialisez la sélection.
                </p>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4 text-xs gap-2">
                      <FilterX className="h-3.5 w-3.5" />
                      Réinitialiser les filtres
                    </Button>
                )}
              </div>
          )}

          {/* TABLEAU / LISTE DES COMMANDES */}
          {!loading && filteredOrders.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">

                {/* Version Tableau Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">{t("id")}</th>
                      <th className="px-6 py-4">{t("annonceur")}</th>
                      <th className="px-6 py-4">{t("status")}</th>
                      <th className="px-6 py-4">{t("total")}</th>
                      <th className="px-6 py-4 text-center">{t("items")}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                    {filteredOrders.map((order) => (
                        <OrderRow key={order.id} order={order} tStatus={tStatus} />
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Version Cartes Mobile/Tablette */}
                <div className="block lg:hidden divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                  {filteredOrders.map((order) => (
                      <OrderMobileCard key={order.id} order={order} tStatus={tStatus} />
                  ))}
                </div>

              </div>
          )}

        </div>
      </DashboardShell>
  );
}

{/* LIGNE TABLEAU (DESKTOP) */}
function OrderRow({
                    order,
                    tStatus,
                  }: {
  order: Order;
  tStatus: (key: string) => string;
}) {
  const [copiedId, setCopiedId] = useState(false);
  const StatusIcon = STATUS_CONFIG[order.status]?.icon || FileText;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
      <tr className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">

        {/* ID Commande */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <Receipt className="h-4 w-4" />
            </div>
            <button
                type="button"
                onClick={() => copyToClipboard(order.id)}
                className="group flex items-center gap-1.5 font-mono text-xs font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
                title="Cliquer pour copier l'ID complet"
            >
              <span>#{order.id.slice(0, 8)}</span>
              {copiedId ? (
                  <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                  <Copy className="h-3 w-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
        </td>

        {/* Annonceur */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 dark:text-zinc-400">
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span>{order.annonceurId.slice(0, 8)}…</span>
          </div>
        </td>

        {/* Statut */}
        <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[order.status]?.style}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{tStatus(order.status)}</span>
        </span>
        </td>

        {/* Total Amount */}
        <td className="px-6 py-4">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">
          {new Intl.NumberFormat().format(order.totalAmount)}{" "}
          <span className="text-xs font-normal text-zinc-500">{order.currency}</span>
        </span>
        </td>

        {/* Quantité d'articles */}
        <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Package className="h-3.5 w-3.5 text-zinc-400" />
          <span>{order.items.length}</span>
        </span>
        </td>
      </tr>
  );
}

{/* CARTE MOBILE */}
function OrderMobileCard({
                           order,
                           tStatus,
                         }: {
  order: Order;
  tStatus: (key: string) => string;
}) {
  const StatusIcon = STATUS_CONFIG[order.status]?.icon || FileText;

  return (
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                #{order.id.slice(0, 8)}…
              </h3>
              <p className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                <User className="h-3 w-3" />
                <span>{order.annonceurId.slice(0, 8)}…</span>
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_CONFIG[order.status]?.style}`}>
          <StatusIcon className="h-3 w-3" />
          <span>{tStatus(order.status)}</span>
        </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">Total :</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
            {new Intl.NumberFormat().format(order.totalAmount)} {order.currency}
          </span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
            <Package className="h-3 w-3 text-zinc-400" />
            <span>{order.items.length} élément{order.items.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
  );
}