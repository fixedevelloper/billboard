"use client";

import { useTranslations } from "next-intl";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useMyBillboards } from "@/features/billboards/useBillboards";
import { BillboardRegisterCard } from "@/features/billboards/BillboardRegisterCard";

export default function RegisseurBillboardsPage() {
  const t = useTranslations("regisseurBillboards");
  const { billboards, loading } = useMyBillboards();

  return (
      <DashboardShell role="REGISSEUR">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-12">
          {/* En-tête de la page */}
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("title")}
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Consultez et gérez l'ensemble de vos panneaux publicitaires.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Action secondaire : Naviguer vers le formulaire POP */}
              <Button asChild variant="outline">
                <Link href="/regisseur/pop/new">
                  📸 Soumettre une POP
                </Link>
              </Button>

              {/* Action principale : Ajouter un panneau */}
              <Button asChild>
                <Link href="/regisseur/billboards/new">
                  <span className="mr-1.5 text-lg font-light">+</span> {t("addBillboard")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Compteur de panneaux */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Mes espaces d'affichage
            </h2>
            {!loading && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            {billboards.length} {billboards.length > 1 ? "panneaux au total" : "panneau"}
                        </span>
            )}
          </div>

          {/* Chargement (Skeleton) */}
          {loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="h-64 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/60"
                    />
                ))}
              </div>
          )}

          {/* État vide */}
          {!loading && billboards.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl dark:bg-zinc-800">
                  🪧
                </div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("noBillboards")}
                </h3>
                <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
                  Vous n'avez pas encore enregistré de panneau dans votre inventaire.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/regisseur/billboards/new">{t("addBillboard")}</Link>
                </Button>
              </div>
          )}

          {/* Grille des panneaux */}
          {!loading && billboards.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {billboards.map((billboard) => (
                    <BillboardRegisterCard
                        key={billboard.id}
                        billboard={billboard}
                        // Action au clic sur "Voir sur la carte"
                        edit={(b) => {
                          if (b.latitude && b.longitude) {
                            window.open(`https://maps.google.com/?q=${b.latitude},${b.longitude}`, "_blank");
                          }
                        }}
                        // Bouton d'action personnalisé (Éditer)
                        action={
                          <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
                            <Link href={`/regisseur/billboards/${billboard.id}/edit`}>
                              ✏️ Éditer
                            </Link>
                          </Button>
                        }
                    />
                ))}
              </div>
          )}
        </div>
      </DashboardShell>
  );
}