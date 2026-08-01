"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import MapView from "@/components/map/MapViewLoader";
import { BillboardCard } from "@/features/billboards/BillboardCard";
import { useBillboards } from "@/features/billboards/useBillboards";
import type { Billboard } from "@/features/billboards/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  MapPin,
  FilterX,
  AlertCircle,
  Tv,
  Layers,
  MapPinOff,
  Loader2,
  Map as MapIcon,
  ListFilter,
  Sparkles,
  X
} from "lucide-react";

export default function PublicBillboardsPage() {
  const t = useTranslations("billboardsSearch");
  const tCommon = useTranslations("common");

  const [city, setCity] = useState("");
  const [type, setType] = useState<"ALL" | "OOH" | "DOOH">("ALL");
  const [selected, setSelected] = useState<Billboard | null>(null);

  // Vue active sur mobile ('list' ou 'map')
  const [activeMobileTab, setActiveMobileTab] = useState<"list" | "map">("list");

  const { billboards, loading, error } = useBillboards({
    city: city || undefined,
    type: type === "ALL" ? undefined : type,
    status: "AVAILABLE",
  });

  const hasActiveFilters = city.trim().length > 0 || type !== "ALL";

  const handleResetFilters = () => {
    setCity("");
    setType("ALL");
    setSelected(null);
  };

  return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">

        {/* 1. EN-TÊTE & INTRODUCTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50 dark:bg-blue-950/40 px-3 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3 w-3" />
              <span>Inventaire OOH & DOOH en direct</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("title")}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
              {t("subtitle")}
            </p>
          </div>

          {/* Indication du nombre de résultats */}
          {!loading && (
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 self-start md:self-end">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{billboards.length}</span> emplacement(s) disponible(s)
              </div>
          )}
        </div>

        {/* 2. BARRE DE FILTRES ET RECHERCHE */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 p-3.5 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">

          {/* Champ de recherche par ville / zone */}
          <div className="flex-1 flex flex-col gap-1.5">
            <Label htmlFor="search-city" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Localisation / Ville
            </Label>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none z-10" />
              <Input
                  id="search-city"
                  type="text"
                  placeholder={t("cityPlaceholder")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-10 pr-9 h-10 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50"
              />
              {city && (
                  <button
                      type="button"
                      onClick={() => setCity("")}
                      className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors"
                      aria-label="Effacer la ville"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
              )}
            </div>
          </div>

          {/* Sélecteur de type de panneau */}
          <div className="w-full sm:w-48 flex flex-col gap-1.5">
            <Label htmlFor="select-type" className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              Type de support
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger id="select-type" className="h-10 border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-zinc-500" />
                    <span>{t("allTypes")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="OOH">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    <span>OOH (Classique)</span>
                  </div>
                </SelectItem>
                <SelectItem value="DOOH">
                  <div className="flex items-center gap-2">
                    <Tv className="h-4 w-4 text-blue-500" />
                    <span>DOOH (Numérique)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bouton Réinitialiser si des filtres sont actifs */}
          {hasActiveFilters && (
              <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="h-10 px-3 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 self-end"
              >
                <FilterX className="h-4 w-4 mr-1.5" />
                Effacer
              </Button>
          )}
        </div>

        {/* BANNIÈRE D'ERREUR */}
        {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200/80 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <p className="font-medium">{error}</p>
            </div>
        )}

        {/* 3. BASCULE TABS SUR MOBILE (Carte vs Liste) */}
        <div className="flex lg:hidden items-center justify-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
          <button
              type="button"
              onClick={() => setActiveMobileTab("list")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeMobileTab === "list"
                      ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400"
              }`}
          >
            <ListFilter className="h-4 w-4" />
            <span>Liste ({billboards.length})</span>
          </button>
          <button
              type="button"
              onClick={() => setActiveMobileTab("map")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                  activeMobileTab === "map"
                      ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400"
              }`}
          >
            <MapIcon className="h-4 w-4" />
            <span>Carte interactive</span>
          </button>
        </div>

        {/* 4. GRILLE PRINCIPALE (MAP + LISTE) */}
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 min-h-[580px]">

          {/* CARTE GEOGRAPHIQUE (7 colonnes Desktop) */}
          <div
              className={`lg:col-span-7 h-[450px] lg:h-[620px] sticky top-24 overflow-hidden rounded-2xl border border-zinc-200/80 shadow-md dark:border-zinc-800/80 transition-all ${
                  activeMobileTab === "map" ? "block" : "hidden lg:block"
              }`}
          >
            <MapView
                billboards={billboards}
                selectedId={selected?.id}
                onSelect={setSelected}
            />
          </div>

          {/* LISTE DES PANNEAUX (5 colonnes Desktop) */}
          <div
              className={`lg:col-span-5 flex flex-col gap-4 max-h-[620px] overflow-y-auto pr-1.5 scrollbar-thin ${
                  activeMobileTab === "list" ? "block" : "hidden lg:block"
              }`}
          >
            {/* État de chargement avec Skeleton Cards */}
            {loading && (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                      <div
                          key={i}
                          className="h-36 w-full animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100/80 dark:border-zinc-800 dark:bg-zinc-800/40"
                      />
                  ))}
                </div>
            )}

            {/* État de recherche sans résultat */}
            {!loading && billboards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
                    <MapPinOff className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {t("noResults")}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                    Aucun panneau disponible ne correspond à vos critères de recherche actuels.
                  </p>
                  {hasActiveFilters && (
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-4 gap-2 text-xs"
                      >
                        <FilterX className="h-3.5 w-3.5" />
                        Réinitialiser la recherche
                      </Button>
                  )}
                </div>
            )}

            {/* Liste réelle des cartes */}
            {!loading && billboards.map((billboard) => (
                <div
                    key={billboard.id}
                    className={`transition-all duration-200 ${
                        selected?.id === billboard.id
                            ? "ring-2 ring-blue-600 rounded-2xl shadow-md scale-[1.01]"
                            : ""
                    }`}
                >
                  <BillboardCard
                      billboard={billboard}
                      selected={selected?.id === billboard.id}
                      onSelect={setSelected}
                  />
                </div>
            ))}
          </div>

        </div>

      </div>
  );
}