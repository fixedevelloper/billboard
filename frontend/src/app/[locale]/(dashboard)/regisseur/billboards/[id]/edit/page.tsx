"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { captureGeolocation } from "@/features/proof-of-performance/usePOP";
import { useBillboard, updateBillboard } from "@/features/billboards/useBillboards";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { ImagePicker } from "@/components/media/ImagePicker";
import { GalleryPicker } from "@/components/media/GalleryPicker";

export default function EditBillboardPage() {
    const t = useTranslations("regisseurBillboards");
    const tCommon = useTranslations("common");
    const params = useParams();
    const router = useRouter();
    const billboardId = params?.id as string;

    // Récupération des données du panneau
    const { billboard, loading: loadingFetch, error: fetchError } = useBillboard(billboardId);

    // Étape actuelle (1 ou 2)
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);

    const [form, setForm] = useState({
        title: "",
        type: "STATIC",
        format: "",
        city: "",
        country: "",
        address: "",
        latitude: "",
        longitude: "",
        monthlyPrice: "",
        currency: "XAF",
        status: "AVAILABLE",
        imageUrl: "",
        galleryUrls: [] as string[],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [geolocating, setGeolocating] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    // Helper pour mettre à jour un champ du formulaire
    const updateField = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // Pré-remplissage du formulaire une fois les données chargées
    useEffect(() => {
        if (billboard) {
            setForm({
                title: billboard.title ?? "",
                type: billboard.type ?? "STATIC",
                format: billboard.format ?? "",
                city: billboard.city ?? "",
                country: billboard.country ?? "",
                address: billboard.address ?? "",
                latitude: billboard.latitude != null ? String(billboard.latitude) : "",
                longitude: billboard.longitude != null ? String(billboard.longitude) : "",
                monthlyPrice: billboard.monthlyPrice != null ? String(billboard.monthlyPrice) : "",
                currency: billboard.currency ?? "XAF",
                status: billboard.status ?? "AVAILABLE",
                imageUrl: billboard.imageUrl ?? "",
                galleryUrls: billboard.galleryUrls ?? billboard.images ?? [],
            });
        }
    }, [billboard]);

    // Capture de la géolocalisation GPS
    async function handleUseLocation() {
        setGeolocating(true);
        setStatusMessage(null);
        try {
            const { latitude, longitude } = await captureGeolocation();
            setForm((f) => ({ ...f, latitude: String(latitude), longitude: String(longitude) }));
        } catch {
            setIsError(true);
            setStatusMessage(t("geolocationError") || "Impossible de récupérer votre position GPS.");
        } finally {
            setGeolocating(false);
        }
    }

    // Helper de validation pour l'étape 1
    const isStep1Valid = () => {
        return Boolean(form.title && form.format && form.monthlyPrice && form.city && form.country);
    };

    // Passer à l'étape 2
    function handleNextStep(e: FormEvent) {
        e.preventDefault();
        if (!isStep1Valid()) {
            setIsError(true);
            setStatusMessage("Veuillez remplir tous les champs obligatoires (*) avant de continuer.");
            return;
        }
        setStatusMessage(null);
        setIsError(false);
        setCurrentStep(2);
    }

    // Soumission finale du formulaire
    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);
        setIsError(false);

        try {
            await updateBillboard(billboardId, {
                ...form,
                monthlyPrice: Number(form.monthlyPrice),
                latitude: form.latitude ? Number(form.latitude) : undefined,
                longitude: form.longitude ? Number(form.longitude) : undefined,
                galleryUrls: form.galleryUrls,
            });

            setStatusMessage("Le panneau a été mis à jour avec succès !");
            setIsError(false);

            // Redirection après succès
            setTimeout(() => {
                router.push("/regisseur/billboards");
            }, 1200);
        } catch (err) {
            setIsError(true);
            setStatusMessage(extractErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loadingFetch) {
        return (
            <DashboardShell role="REGISSEUR">
                <div className="mx-auto max-w-3xl py-12 text-center text-sm text-zinc-500">
                    {tCommon("loading")}
                </div>
            </DashboardShell>
        );
    }

    if (fetchError) {
        return (
            <DashboardShell role="REGISSEUR">
                <div className="mx-auto max-w-3xl py-12 text-center">
                    <p className="text-sm text-red-600">{fetchError}</p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/regisseur/billboards">← Retour aux panneaux</Link>
                    </Button>
                </div>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell role="REGISSEUR">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-16">
                {/* Navigation retour */}
                <div>
                    <Button asChild variant="ghost" size="sm" className="-ml-2 text-zinc-500">
                        <Link href="/regisseur/billboards">← Annuler et revenir à la liste</Link>
                    </Button>
                </div>

                {/* En-tête */}
                <div className="border-b border-zinc-200 pb-4 dark:border-zinc-800">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Modifier le panneau
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Éditez les détails et le visuel de votre support en 2 étapes simples.
                    </p>
                </div>

                {/* Stepper / Bar de progression des 2 étapes */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className={cn(
                            "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                            currentStep === 1
                                ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20"
                                : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                        )}
                    >
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Étape 1 sur 2
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Informations & Localisation
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            if (isStep1Valid()) {
                                setStatusMessage(null);
                                setIsError(false);
                                setCurrentStep(2);
                            } else {
                                setIsError(true);
                                setStatusMessage("Veuillez remplir tous les champs obligatoires (*) avant de continuer.");
                            }
                        }}
                        className={cn(
                            "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                            currentStep === 2
                                ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20"
                                : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                        )}
                    >
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Étape 2 sur 2
                        </span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            Choix de l'image & Visuel
                        </span>
                    </button>
                </div>

                {/* Status Message / Notification */}
                {statusMessage && (
                    <div
                        className={cn(
                            "rounded-lg p-3.5 text-xs font-medium border flex items-center gap-2",
                            isError
                                ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                        )}
                    >
                        <span>{isError ? "⚠️" : "✅"}</span>
                        <span>{statusMessage}</span>
                    </div>
                )}

                {/* Formulaire Étape 1 */}
                {currentStep === 1 && (
                    <form onSubmit={handleNextStep} className="flex flex-col gap-6">
                        {/* Section : Informations Générales */}
                        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold">1. Caractéristiques du panneau</CardTitle>
                                <CardDescription className="text-xs">
                                    Titre, type de panneau et format physique.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <Input
                                    label="Titre du panneau *"
                                    placeholder="ex: Panneau Carrefour Bonanjo"
                                    required
                                    value={form.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                            Type de panneau
                                        </label>
                                        <select
                                            value={form.type}
                                            onChange={(e) => updateField("type", e.target.value)}
                                            className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                                        >
                                            <option value="STATIC">Statique</option>
                                            <option value="DIGITAL">Numérique (LED / DOOH)</option>
                                            <option value="SCROLLING">Déroulant</option>
                                            <option value="TRIVISION">Trivision</option>
                                        </select>
                                    </div>

                                    <Input
                                        label="Format / Dimensions *"
                                        placeholder="ex: 12m² (4x3)"
                                        required
                                        value={form.format}
                                        onChange={(e) => updateField("format", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section : Tarification & Statut */}
                        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold">2. Tarif & Disponibilité</CardTitle>
                                <CardDescription className="text-xs">
                                    Définissez le coût mensuel et son statut d'exploitation.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Input
                                    label="Prix mensuel *"
                                    type="number"
                                    placeholder="ex: 250000"
                                    required
                                    value={form.monthlyPrice}
                                    onChange={(e) => updateField("monthlyPrice", e.target.value)}
                                />

                                <Input
                                    label="Devise *"
                                    placeholder="ex: XAF, EUR"
                                    required
                                    value={form.currency}
                                    onChange={(e) => updateField("currency", e.target.value)}
                                />

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                        Statut
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => updateField("status", e.target.value)}
                                        className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 shadow-xs focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                                    >
                                        <option value="AVAILABLE">Disponible</option>
                                        <option value="RESERVED">Réservé / Occupé</option>
                                        <option value="MAINTENANCE">En maintenance</option>
                                        <option value="INACTIVE">Inactif</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section : Localisation GPS */}
                        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold">3. Emplacement géographique</CardTitle>
                                        <CardDescription className="text-xs">
                                            Adresse et coordonnées de positionnement.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs text-blue-600 dark:text-blue-400"
                                        loading={geolocating}
                                        onClick={handleUseLocation}
                                    >
                                        🎯 Me géolocaliser
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Ville *"
                                        placeholder="ex: Douala"
                                        required
                                        value={form.city}
                                        onChange={(e) => updateField("city", e.target.value)}
                                    />
                                    <Input
                                        label="Pays *"
                                        placeholder="ex: Cameroun"
                                        required
                                        value={form.country}
                                        onChange={(e) => updateField("country", e.target.value)}
                                    />
                                </div>

                                <Input
                                    label="Adresse / Repère précis"
                                    placeholder="ex: Face entrée principale du stade"
                                    value={form.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Latitude"
                                        placeholder="ex: 4.05105"
                                        value={form.latitude}
                                        onChange={(e) => updateField("latitude", e.target.value)}
                                    />
                                    <Input
                                        label="Longitude"
                                        placeholder="ex: 9.76787"
                                        value={form.longitude}
                                        onChange={(e) => updateField("longitude", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Étape 1 -> Étape 2 */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button type="submit" size="lg">
                                Étape suivante : Choix des images →
                            </Button>
                        </div>
                    </form>
                )}

                {/* Formulaire Étape 2 */}
                {currentStep === 2 && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold">Photo & Médias du panneau</CardTitle>
                                <CardDescription className="text-xs">
                                    Téléversez ou modifiez la photo de présentation principale de votre espace publicitaire.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                {/* Photo principale */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                        Image principale du panneau
                                    </Label>
                                    <ImagePicker
                                        value={form.imageUrl}
                                        onChange={(url) => updateField("imageUrl", url)}
                                    />
                                </div>

                                <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                                {/* Galerie photos */}
                                <div className="flex flex-col gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t("galleryTitle")}</p>
                                        <p className="text-xs text-zinc-500">{t("galleryDescription")}</p>
                                    </div>
                                    <GalleryPicker
                                        value={form.galleryUrls}
                                        onChange={(urls) => updateField("galleryUrls", urls)}
                                    />
                                </div>

                                <div className="rounded-md bg-zinc-50 p-4 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
                                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                        💡 <strong>Conseil visuel :</strong> Privilégiez des photos bien éclairées, prises de face ou depuis l'axe de circulation des véhicules pour maximiser l'intérêt des annonceurs.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions Étape 2 */}
                        <div className="flex items-center justify-between pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                onClick={() => setCurrentStep(1)}
                            >
                                ← Retour à l'étape 1
                            </Button>

                            <Button type="submit" size="lg" loading={isSubmitting}>
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </DashboardShell>
    );
}