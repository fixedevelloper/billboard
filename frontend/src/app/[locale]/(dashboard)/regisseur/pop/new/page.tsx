"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ImageUploadField } from "@/components/media/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { captureGeolocation, submitPOP } from "@/features/proof-of-performance/usePOP";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function SubmitPOPPage() {
    const t = useTranslations("regisseurBillboards");
    const tCommon = useTranslations("common");

    const [popForm, setPopForm] = useState({
        orderId: "",
        billboardId: "",
        photoUrl: "",
        latitude: "",
        longitude: "",
    });
    const [popStatus, setPopStatus] = useState<string | null>(null);
    const [popError, setPopError] = useState<boolean>(false);
    const [geolocating, setGeolocating] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function handleUseLocation() {
        setGeolocating(true);
        setPopStatus(null);
        try {
            const { latitude, longitude } = await captureGeolocation();
            setPopForm((f) => ({ ...f, latitude: String(latitude), longitude: String(longitude) }));
        } catch {
            setPopError(true);
            setPopStatus(t("geolocationError"));
        } finally {
            setGeolocating(false);
        }
    }

    async function handleSubmitPOP(event: FormEvent) {
        event.preventDefault();
        setPopStatus(null);
        setPopError(false);

        if (!popForm.photoUrl) {
            setPopError(true);
            setPopStatus(t("popPhotoRequired"));
            return;
        }

        setIsSubmitting(true);
        try {
            await submitPOP({
                orderId: popForm.orderId,
                billboardId: popForm.billboardId,
                photoUrl: popForm.photoUrl,
                latitude: Number(popForm.latitude),
                longitude: Number(popForm.longitude),
            });
            setPopError(false);
            setPopStatus(t("popSaved"));
            setPopForm({ orderId: "", billboardId: "", photoUrl: "", latitude: "", longitude: "" });
        } catch (err) {
            setPopError(true);
            setPopStatus(extractErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DashboardShell role="REGISSEUR">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-12">
                {/* Navigation retour */}
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2 text-zinc-500">
                        <Link href="/regisseur/billboards">
                            ← Retour à la liste des panneaux
                        </Link>
                    </Button>
                </div>

                {/* Formulaire centralisé */}
                <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                    <CardHeader className="border-b border-zinc-100 pb-5 dark:border-zinc-800/60">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">{t("popTitle")}</CardTitle>
                            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                POP (Proof of Performance)
              </span>
                        </div>
                        <CardDescription className="text-sm">
                            Soumettez les visuels de contrôle et validez la position exacte du panneau installé.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmitPOP} className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input
                                    label={t("popOrderId")}
                                    placeholder="ex: ORD-2026-8891"
                                    required
                                    value={popForm.orderId}
                                    onChange={(e) => setPopForm((f) => ({ ...f, orderId: e.target.value }))}
                                />

                                <Input
                                    label={t("popBillboardId")}
                                    placeholder="ex: BILL-49A28C"
                                    required
                                    value={popForm.billboardId}
                                    onChange={(e) => setPopForm((f) => ({ ...f, billboardId: e.target.value }))}
                                />
                            </div>

                            {/* Téléversement de l'image de preuve */}
                            <div className="flex flex-col gap-1.5">
                                <ImageUploadField
                                    label={t("popPhotoUrl")}
                                    value={popForm.photoUrl}
                                    onChange={(url) => setPopForm((f) => ({ ...f, photoUrl: url }))}
                                />
                            </div>

                            {/* Bloc Coordonnées GPS */}
                            <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Localisation GPS
                  </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 bg-white text-xs text-blue-600 shadow-xs hover:bg-blue-50 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-zinc-700"
                                        loading={geolocating}
                                        onClick={handleUseLocation}
                                    >
                                        🎯 {t("useCurrentLocation")}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label={t("latitude")}
                                        placeholder="ex: 4.05105"
                                        required
                                        value={popForm.latitude}
                                        onChange={(e) => setPopForm((f) => ({ ...f, latitude: e.target.value }))}
                                    />
                                    <Input
                                        label={t("longitude")}
                                        placeholder="ex: 9.76787"
                                        required
                                        value={popForm.longitude}
                                        onChange={(e) => setPopForm((f) => ({ ...f, longitude: e.target.value }))}
                                    />
                                </div>
                            </div>

                            {/* Message de notification d'état */}
                            {popStatus && (
                                <div
                                    className={cn(
                                        "rounded-lg p-3.5 text-xs font-medium border flex items-center gap-2",
                                        popError
                                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                                            : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                                    )}
                                >
                                    <span>{popError ? "⚠️" : "✅"}</span>
                                    <span>{popStatus}</span>
                                </div>
                            )}

                            {/* Bouton de soumission principal */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                                    {t("savePop")}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}