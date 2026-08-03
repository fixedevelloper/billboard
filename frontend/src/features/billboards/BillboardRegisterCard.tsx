"use client";

import { useTranslations, useFormatter } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ImageOff } from "lucide-react";
import type { Billboard } from "./types";

const STATUS_TONE = {
  AVAILABLE: "success",
  RESERVED: "warning",
  MAINTENANCE: "neutral",
  INACTIVE: "danger",
} as const;

interface BillboardRegisterCardProps {
  billboard: Billboard;
  selected?: boolean;
  onSelect?: (billboard: Billboard) => void;
  edit?: (billboard: Billboard) => void;
  action?: React.ReactNode;
}

export function BillboardRegisterCard({
                                        billboard,
                                        selected,
                                        onSelect,
                                        edit,
                                        action,
                                      }: BillboardRegisterCardProps) {
  const tStatus = useTranslations("billboardStatus");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  const statusTone = STATUS_TONE[billboard.status] ?? "neutral";

  const handleCardClick = () => {
    onSelect?.(billboard);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onSelect && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect(billboard);
    }
  };

  return (
      <Card
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
          className={`group relative flex flex-col justify-between overflow-hidden border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 ${
              selected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
          } ${
              onSelect
                  ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  : ""
          }`}
      >
        <div>
          {/* Conteneur Média / Visuel */}
          <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            {billboard.imageUrl ? (
                <img
                    src={billboard.imageUrl}
                    alt={billboard.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                  <ImageOff className="h-6 w-6 stroke-[1.5]" />
                  <span>{tCommon("noImage")}</span>
                </div>
            )}

            {/* Dégradé de protection pour le contraste des badges */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none" />

            {/* Badges de Statut & Type */}
            <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
              <Badge tone={statusTone} className="shadow-xs backdrop-blur-xs">
                {tStatus(billboard.status)}
              </Badge>
              {billboard.type && (
                  <Badge tone="info" className="shadow-xs backdrop-blur-xs">
                    {billboard.type}
                  </Badge>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="space-y-3 p-4">
            <div>
              <CardTitle className="line-clamp-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {billboard.title}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                {billboard.city}, {billboard.country} {billboard.format ? `· ${billboard.format}` : ""}
              </CardDescription>
            </div>

            {/* Tarif mensuel & Action complémentaire */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-baseline gap-1">
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {format.number(billboard.monthlyPrice ?? 0, {
                  style: "currency",
                  currency: billboard.currency || "XAF",
                  maximumFractionDigits: 0,
                })}
              </span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                / {tCommon("perMonth")}
              </span>
              </div>

              {action && (
                  <div
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                  >
                    {action}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Pied de Carte / Boutons d'actions */}
        {edit && (
            <div className="border-t border-zinc-100 p-3 dark:border-zinc-800/60">
              <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    edit(billboard);
                  }}
              >
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
                {tCommon("viewOnMap")}
              </Button>
            </div>
        )}
      </Card>
  );
}