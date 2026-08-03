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

interface BillboardCardProps {
  billboard: Billboard;
  selected?: boolean;
  onSelect?: (billboard: Billboard) => void;
  onViewMap?: (billboard: Billboard) => void;
  action?: React.ReactNode;
}

export function BillboardCard({
                                billboard,
                                selected,
                                onSelect,
                                onViewMap,
                                action,
                              }: BillboardCardProps) {
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
          className={`group overflow-hidden border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 ${
              selected ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
          } ${
              onSelect
                  ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  : ""
          }`}
      >
        {/* Conteneur Média / Badges */}
        <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          {billboard.imageUrl ? (
              <img
                  src={billboard.imageUrl}
                  alt={billboard.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
          ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-xs text-zinc-400">
                <ImageOff className="h-5 w-5" />
                <span>{tCommon("noImage")}</span>
              </div>
          )}

          <div className="absolute left-3 top-3 flex gap-2">
            <Badge tone={statusTone}>{tStatus(billboard.status)}</Badge>
            <Badge tone="info">{billboard.type}</Badge>
          </div>
        </div>

        {/* Contenu de la Carte */}
        <div className="space-y-4 p-4">
          <div>
            <CardTitle className="text-base">{billboard.title}</CardTitle>
            <CardDescription className="mt-1">
              {billboard.city}, {billboard.country} · {billboard.format}
            </CardDescription>
          </div>

          {/* Prix et Action */}
          <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {format.number(billboard.monthlyPrice, {
              style: "currency",
              currency: billboard.currency,
              maximumFractionDigits: 0,
            })}
            <span className="font-normal text-zinc-500">
              {" "}
              / {tCommon("perMonth")}
            </span>
          </span>

            {action && (
                <div onClick={(e) => e.stopPropagation()}>
                  {action}
                </div>
            )}
          </div>

          {/* Bouton Voir sur la Carte */}
          {onViewMap && (
              <div className="flex items-center gap-2 pt-1">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewMap(billboard);
                    }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {tCommon("viewOnMap")}
                </Button>
              </div>
          )}
        </div>
      </Card>
  );
}