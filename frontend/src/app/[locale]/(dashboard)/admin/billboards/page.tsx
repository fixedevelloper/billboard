"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminBillboards } from "@/features/admin/useAdmin";
import type { BillboardStatus, Billboard } from "@/features/billboards/types";
import {
  MapPin,
  Search,
  FilterX,
  Tv,
  Layers,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
  X,
  User,
  Sparkles,
  MapPinOff,
  DollarSign,
} from "lucide-react";

// Configuration visuelle des statuts
const STATUS_CONFIG: Record<
    BillboardStatus,
    { icon: React.ElementType; style: string }
> = {
  AVAILABLE: {
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  RESERVED: {
    icon: Clock,
    style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
  MAINTENANCE: {
    icon: Wrench,
    style: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
  INACTIVE: {
    icon: XCircle,
    style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  },
};

export default function AdminBillboardsPage() {
  const t = useTranslations("adminBillboards");
  const tStatus = useTranslations("billboardStatus");
  const tCommon = useTranslations("common");
  const { billboards, loading } = useAdminBillboards();

  // Filtres locaux
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillboardStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "OOH" | "DOOH">("ALL");

  // Métriques globales
  const stats = useMemo(() => {
    return {
      total: billboards.length,
      available: billboards.filter((b) => b.status === "AVAILABLE").length,
      reserved: billboards.filter((b) => b.status === "RESERVED").length,
      maintenance: billboards.filter((b) => b.status === "MAINTENANCE" || b.status === "INACTIVE").length,
    };
  }, [billboards]);

  // Filtrage combiné des panneaux
  const filteredBillboards = useMemo(() => {
    return billboards.filter((b) => {
      const matchesSearch =
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.ownerId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      const matchesType = typeFilter === "ALL" || b.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [billboards, searchQuery, statusFilter, typeFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "ALL" || typeFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  };

  return (
      <DashboardShell role="ADMIN">
        <div className="space-y-6 max-w-7xl mx-auto">

          {/* EN-TÊTE DE PAGE */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Gestion de l'Inventaire Réseau</span>
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
                    <Layers className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Total:</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 px-3 py-1.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Dispo:</span>
                    <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{stats.available}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-1.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Réservés:</span>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">{stats.reserved}</span>
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
                  placeholder="Rechercher par titre, ville ou ID propriétaire..."
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
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts</SelectItem>
                  <SelectItem value="AVAILABLE">Disponible</SelectItem>
                  <SelectItem value="RESERVED">Réservé</SelectItem>
                  <SelectItem value="MAINTENANCE">En maintenance</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Type */}
            <div className="w-full md:w-44">
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les types</SelectItem>
                  <SelectItem value="OOH">OOH (Classique)</SelectItem>
                  <SelectItem value="DOOH">DOOH (Numérique)</SelectItem>
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
          {!loading && filteredBillboards.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
                  <MapPinOff className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {billboards.length === 0 ? t("noBillboards") : "Aucun panneau ne correspond à vos critères"}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                  Modifiez vos filtres de recherche ou réinitialisez les sélections.
                </p>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4 text-xs gap-2">
                      <FilterX className="h-3.5 w-3.5" />
                      Réinitialiser la recherche
                    </Button>
                )}
              </div>
          )}

          {/* TABLEAU / LISTE DES PANNEAUX */}
          {!loading && filteredBillboards.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">

                {/* Version Tableau Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">{t("titleColumn")}</th>
                      <th className="px-6 py-4">{t("type")}</th>
                      <th className="px-6 py-4">{t("location")}</th>
                      <th className="px-6 py-4">{t("status")}</th>
                      <th className="px-6 py-4">{t("price")}</th>
                      <th className="px-6 py-4">{t("owner")}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                    {filteredBillboards.map((billboard) => (
                        <BillboardRow key={billboard.id} billboard={billboard} tStatus={tStatus} />
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Version Cartes Mobile/Tablette */}
                <div className="block lg:hidden divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                  {filteredBillboards.map((billboard) => (
                      <BillboardMobileCard key={billboard.id} billboard={billboard} tStatus={tStatus} />
                  ))}
                </div>

              </div>
          )}

        </div>
      </DashboardShell>
  );
}

{/* LIGNE TABLEAU (DESKTOP) */}
function BillboardRow({
                        billboard,
                        tStatus,
                      }: {
  billboard: Billboard;
  tStatus: (key: string) => string;
}) {
  const StatusIcon = STATUS_CONFIG[billboard.status]?.icon || CheckCircle2;
  const isDooh = billboard.type === "DOOH";

  return (
      <tr className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">

        {/* Titre & Icône type */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                isDooh
                    ? "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-400"
            }`}>
              {isDooh ? <Tv className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{billboard.title}</p>
              <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">ID: {billboard.id.slice(0, 8)}…</p>
            </div>
          </div>
        </td>

        {/* Type Badge */}
        <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            isDooh
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        }`}>
          {isDooh ? <Tv className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
          <span>{billboard.type}</span>
        </span>
        </td>

        {/* Emplacement */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 text-sm">
            <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span>{billboard.city}, <strong className="font-medium text-zinc-900 dark:text-zinc-100">{billboard.country}</strong></span>
          </div>
        </td>

        {/* Statut */}
        <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[billboard.status]?.style}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          <span>{tStatus(billboard.status)}</span>
        </span>
        </td>

        {/* Prix Mensuel */}
        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
          {new Intl.NumberFormat().format(billboard.monthlyPrice)}{" "}
          <span className="text-xs font-normal text-zinc-500">{billboard.currency}</span>
        </td>

        {/* Propriétaire */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span>{billboard.ownerId.slice(0, 8)}…</span>
          </div>
        </td>
      </tr>
  );
}

{/* CARTE MOBILE */}
function BillboardMobileCard({
                               billboard,
                               tStatus,
                             }: {
  billboard: Billboard;
  tStatus: (key: string) => string;
}) {
  const StatusIcon = STATUS_CONFIG[billboard.status]?.icon || CheckCircle2;
  const isDooh = billboard.type === "DOOH";

  return (
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                isDooh
                    ? "bg-blue-50 border-blue-100 text-blue-600 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-400"
                    : "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:border-emerald-900 dark:text-emerald-400"
            }`}>
              {isDooh ? <Tv className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{billboard.title}</h3>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{billboard.city}, {billboard.country}</span>
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_CONFIG[billboard.status]?.style}`}>
          <StatusIcon className="h-3 w-3" />
          <span>{tStatus(billboard.status)}</span>
        </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
          <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
            {new Intl.NumberFormat().format(billboard.monthlyPrice)} {billboard.currency}
          </span>
            <span className="text-zinc-400">/ mois</span>
          </div>

          <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
            {billboard.type}
          </span>
            <span className="font-mono text-[10px] text-zinc-400">
            Proprio: {billboard.ownerId.slice(0, 6)}…
          </span>
          </div>
        </div>
      </div>
  );
}