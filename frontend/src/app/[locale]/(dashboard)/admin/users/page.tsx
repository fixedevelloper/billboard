"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateKycStatus, useAdminUsers } from "@/features/admin/useAdmin";
import type { AdminUser, KycStatus } from "@/features/admin/types";
import type { Role } from "@/lib/types";
import { extractErrorMessage } from "@/lib/api";
import {
  Users,
  Search,
  FilterX,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Building2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  X,
  Save
} from "lucide-react";

const KYC_CONFIG: Record<KycStatus, { tone: "success" | "warning" | "danger"; icon: React.ElementType; style: string }> = {
  VERIFIED: {
    tone: "success",
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
  },
  PENDING: {
    tone: "warning",
    icon: Clock,
    style: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
  },
  REJECTED: {
    tone: "danger",
    icon: XCircle,
    style: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900",
  },
};

export default function AdminUsersPage() {
  const t = useTranslations("adminUsers");
  const tCommon = useTranslations("common");
  const { users, loading, refetch } = useAdminUsers();

  // Filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [kycFilter, setKycFilter] = useState<KycStatus | "ALL">("ALL");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");

  // Comptages pour l'en-tête
  const stats = useMemo(() => {
    return {
      total: users.length,
      pending: users.filter((u) => u.kycStatus === "PENDING").length,
      verified: users.filter((u) => u.kycStatus === "VERIFIED").length,
      rejected: users.filter((u) => u.kycStatus === "REJECTED").length,
    };
  }, [users]);

  // Filtrage combiné des utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.companyName && user.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesKyc = kycFilter === "ALL" || user.kycStatus === kycFilter;
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      return matchesSearch && matchesKyc && matchesRole;
    });
  }, [users, searchQuery, kycFilter, roleFilter]);

  const hasActiveFilters = searchQuery.trim() !== "" || kycFilter !== "ALL" || roleFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setKycFilter("ALL");
    setRoleFilter("ALL");
  };

  return (
      <DashboardShell role="ADMIN">
        <div className="space-y-6 max-w-7xl mx-auto">

          {/* EN-TÊTE DE PAGE */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50 dark:bg-blue-950/40 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
                <UserCheck className="h-3.5 w-3.5" />
                <span>Gestion des Accès & KYC</span>
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
                    <Users className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs text-zinc-500">Total:</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-1.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">En attente:</span>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">{stats.pending}</span>
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
                  placeholder="Rechercher par email ou entreprise..."
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

            {/* Filtre Statut KYC */}
            <div className="w-full md:w-48">
              <Select value={kycFilter} onValueChange={(v) => setKycFilter(v as typeof kycFilter)}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <SelectValue placeholder="Statut KYC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les statuts KYC</SelectItem>
                  <SelectItem value="PENDING">En attente (Pending)</SelectItem>
                  <SelectItem value="VERIFIED">Vérifié (Verified)</SelectItem>
                  <SelectItem value="REJECTED">Rejeté (Rejected)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre Rôle */}
            <div className="w-full md:w-44">
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
                <SelectTrigger className="h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les rôles</SelectItem>
                  <SelectItem value="ANNONCEUR">Annonceur</SelectItem>
                  <SelectItem value="REGISSEUR">Régisseur</SelectItem>
                  <SelectItem value="MEDIA_BUYER">Media Buyer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
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
          {!loading && filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {users.length === 0 ? t("noUsers") : "Aucun utilisateur ne correspond à vos filtres"}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                  Modifiez vos critères de recherche ou réinitialisez les filtres.
                </p>
                {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4 text-xs gap-2">
                      <FilterX className="h-3.5 w-3.5" />
                      Réinitialiser la recherche
                    </Button>
                )}
              </div>
          )}

          {/* TABLEAU / LISTE DES UTILISATEURS */}
          {!loading && filteredUsers.length > 0 && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">

                {/* Version Tableau Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-400">
                    <tr>
                      <th className="px-6 py-4">{t("email")}</th>
                      <th className="px-6 py-4">{t("company")}</th>
                      <th className="px-6 py-4">{t("role")}</th>
                      <th className="px-6 py-4">{t("kycStatus")}</th>
                      <th className="px-6 py-4 text-right">{t("action")}</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                    {filteredUsers.map((user) => (
                        <UserRow key={user.id} user={user} onUpdated={refetch} />
                    ))}
                    </tbody>
                  </table>
                </div>

                {/* Version Cartes Mobile/Tablette */}
                <div className="block lg:hidden divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
                  {filteredUsers.map((user) => (
                      <UserMobileCard key={user.id} user={user} onUpdated={refetch} />
                  ))}
                </div>

              </div>
          )}

        </div>
      </DashboardShell>
  );
}

{/* COMPO - LIGNE TABLEAU (DESKTOP) */}
function UserRow({ user, onUpdated }: { user: AdminUser; onUpdated: () => void }) {
  const t = useTranslations("adminUsers");
  const tRoles = useTranslations("roles");
  const [status, setStatus] = useState<KycStatus>(user.kycStatus);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = status !== user.kycStatus;
  const KycIcon = KYC_CONFIG[user.kycStatus].icon;

  async function handleUpdate() {
    setSubmitting(true);
    setError(null);
    try {
      await updateKycStatus(user.id, status);
      onUpdated();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const initial = user.companyName ? user.companyName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

  return (
      <tr className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">

        {/* Email & Avatar */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span>{user.email}</span>
              </p>
              {error && <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
            </div>
          </div>
        </td>

        {/* Entreprise */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
            <Building2 className="h-4 w-4 text-zinc-400 shrink-0" />
            <span>{user.companyName || "—"}</span>
          </div>
        </td>

        {/* Rôle */}
        <td className="px-6 py-4">
        <span className="inline-flex items-center rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {tRoles(user.role)}
        </span>
        </td>

        {/* Statut KYC */}
        <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${KYC_CONFIG[user.kycStatus].style}`}>
          <KycIcon className="h-3.5 w-3.5" />
          <span>{t(`status${capitalize(user.kycStatus)}`)}</span>
        </span>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v as KycStatus)}>
              <SelectTrigger className={`w-36 h-9 ${isDirty ? "border-amber-500 ring-1 ring-amber-500/30" : ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VERIFIED">{t("statusVerified")}</SelectItem>
                <SelectItem value="PENDING">{t("statusPending")}</SelectItem>
                <SelectItem value="REJECTED">{t("statusRejected")}</SelectItem>
              </SelectContent>
            </Select>

            <Button
                size="sm"
                disabled={!isDirty || submitting}
                onClick={handleUpdate}
                className={`h-9 gap-1.5 transition-all ${
                    isDirty ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : ""
                }`}
            >
              {submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                  <Save className="h-3.5 w-3.5" />
              )}
              <span>{t("update")}</span>
            </Button>
          </div>
        </td>
      </tr>
  );
}

{/* COMPO - CARTE MOBILE */}
function UserMobileCard({ user, onUpdated }: { user: AdminUser; onUpdated: () => void }) {
  const t = useTranslations("adminUsers");
  const tRoles = useTranslations("roles");
  const [status, setStatus] = useState<KycStatus>(user.kycStatus);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty = status !== user.kycStatus;
  const KycIcon = KYC_CONFIG[user.kycStatus].icon;

  async function handleUpdate() {
    setSubmitting(true);
    setError(null);
    try {
      await updateKycStatus(user.id, status);
      onUpdated();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm truncate">{user.email}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>{user.companyName || "N/A"}</span>
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${KYC_CONFIG[user.kycStatus].style}`}>
          <KycIcon className="h-3 w-3" />
          <span>{t(`status${capitalize(user.kycStatus)}`)}</span>
        </span>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 pt-1">
          <span>Rôle : <strong className="text-zinc-800 dark:text-zinc-200">{tRoles(user.role)}</strong></span>
        </div>

        {error && <p className="text-xs font-medium text-red-600">{error}</p>}

        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
          <Select value={status} onValueChange={(v) => setStatus(v as KycStatus)}>
            <SelectTrigger className="flex-1 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VERIFIED">{t("statusVerified")}</SelectItem>
              <SelectItem value="PENDING">{t("statusPending")}</SelectItem>
              <SelectItem value="REJECTED">{t("statusRejected")}</SelectItem>
            </SelectContent>
          </Select>

          <Button
              size="sm"
              disabled={!isDirty || submitting}
              onClick={handleUpdate}
              className="h-9 gap-1.5"
          >
            {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{t("update")}</span>
          </Button>
        </div>
      </div>
  );
}

function capitalize(status: KycStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}