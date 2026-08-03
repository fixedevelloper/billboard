"use client";

import { useTranslations, useFormatter } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ImageOff } from "lucide-react";
import MapView from "@/components/map/MapViewLoader";
import type { Billboard } from "./types";

const STATUS_TONE = {
    AVAILABLE: "success",
    RESERVED: "warning",
    MAINTENANCE: "neutral",
    INACTIVE: "danger",
} as const;

type Props = {
    billboard: Billboard | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart?: (billboard: Billboard) => void;
};

export function BillboardDetailsModal({
                                          billboard,
                                          open,
                                          onOpenChange,
                                          onAddToCart,
                                      }: Props) {
    const tStatus = useTranslations("billboardStatus");
    const tCommon = useTranslations("common");
    const tDetails = useTranslations("billboardDetails");
    const format = useFormatter();

    if (!billboard) return null;

    const statusTone = STATUS_TONE[billboard.status] ?? "neutral";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-hidden p-0">
                <DialogHeader className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                    <DialogTitle className="text-xl">{billboard.title}</DialogTitle>
                </DialogHeader>

                <div className="grid max-h-[calc(90vh-65px)] grid-cols-1 overflow-hidden lg:grid-cols-2">
                    {/* Panneau de gauche : Informations */}
                    <div className="flex flex-col overflow-y-auto p-6">
                        {billboard.imageUrl ? (
                            <div className="mb-5 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                                <img
                                    src={billboard.imageUrl}
                                    alt={billboard.title}
                                    loading="lazy"
                                    className="h-56 w-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="mb-5 flex h-48 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
                                <ImageOff className="h-6 w-6" />
                                <span className="text-xs">{tCommon("noImage")}</span>
                            </div>
                        )}

                        <div className="mb-4 flex flex-wrap gap-2">
                            <Badge tone={statusTone}>{tStatus(billboard.status)}</Badge>
                            <Badge tone="info">{billboard.type}</Badge>
                            <Badge variant="outline">{billboard.format}</Badge>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    {tDetails("description")}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                                    {billboard.description || tDetails("noDescription")}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500">{tDetails("city")}</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {billboard.city}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500">{tDetails("country")}</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {billboard.country}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500">{tDetails("monthlyPrice")}</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {format.number(billboard.monthlyPrice, {
                                            style: "currency",
                                            currency: billboard.currency,
                                            maximumFractionDigits: 0,
                                        })}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-500">{tDetails("format")}</p>
                                    <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                        {billboard.format}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                                <p className="text-xs text-zinc-500">{tDetails("location")}</p>
                                <p className="mt-1 flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                    {billboard.city}, {billboard.country}
                  </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 pt-2">
                            <Button
                                className="flex-1"
                                onClick={() => onAddToCart?.(billboard)}
                            >
                                {tCommon("addToCart")}
                            </Button>
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                {tCommon("close")}
                            </Button>
                        </div>
                    </div>

                    {/* Panneau de droite : Carte */}
                    <div className="min-h-[320px] border-t border-zinc-200 lg:min-h-full lg:border-l lg:border-t-0 dark:border-zinc-800">
                        <MapView
                            billboards={[billboard]}
                            selectedId={billboard.id}
                            onSelect={() => {}}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}