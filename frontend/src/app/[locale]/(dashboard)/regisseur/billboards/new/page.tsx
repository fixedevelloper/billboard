"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CitySelect } from "@/components/billboards/CitySelect";
import { GalleryPicker } from "@/components/media/GalleryPicker";
import { ImagePicker } from "@/components/media/ImagePicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { createBillboard } from "@/features/billboards/useBillboards";
import type { BillboardType } from "@/features/billboards/types";
import type { City } from "@/features/cities/types";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "OOH" as BillboardType,
  format: "",
  width: "",
  height: "",
  facesCount: "1",
  illuminated: false,
  digital: false,
  resolution: "",
  spotDurationSeconds: "",
  address: "",
  environmentType: "",
  orientation: "",
  latitude: "",
  longitude: "",
  dailyImpressions: "",
  dailyPrice: "",
  monthlyPrice: "",
  currency: "XOF",
  minBookingDays: "30",
};

const STEPS = ["information", "images"] as const;
type Step = (typeof STEPS)[number];

function toNumber(value: string): number | undefined {
  return value.trim() === "" ? undefined : Number(value);
}

export default function NewRegisseurBillboardPage() {
  const t = useTranslations("regisseurNewBillboard");
  const router = useRouter();
  const [step, setStep] = useState<Step>("information");
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stepIndex = STEPS.indexOf(step);

  function handleCitySelect(city: City) {
    setSelectedCity(city);
    setForm((f) => ({
      ...f,
      latitude: String(city.latitude),
      longitude: String(city.longitude),
    }));
  }

  const informationComplete =
      form.title && form.format && selectedCity && form.latitude && form.longitude && form.dailyPrice && form.currency;

  async function handleCreate() {
    if (!selectedCity) return;
    setSubmitting(true);
    setError(null);
    try {
      await createBillboard({
        title: form.title,
        description: form.description || undefined,
        type: form.type,
        format: form.format,
        width: toNumber(form.width),
        height: toNumber(form.height),
        facesCount: toNumber(form.facesCount),
        illuminated: form.illuminated,
        digital: form.digital,
        resolution: form.resolution || undefined,
        spotDurationSeconds: toNumber(form.spotDurationSeconds),
        cityId: selectedCity.id,
        address: form.address || undefined,
        environmentType: form.environmentType || undefined,
        orientation: form.orientation || undefined,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        dailyImpressions: toNumber(form.dailyImpressions),
        dailyPrice: Number(form.dailyPrice),
        monthlyPrice: toNumber(form.monthlyPrice),
        currency: form.currency,
        minBookingDays: toNumber(form.minBookingDays),
        imageUrl: imageUrl || undefined,
        galleryUrls,
      });
      router.push("/regisseur/billboards");
    } catch (err) {
      setError(extractErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
      <DashboardShell role="REGISSEUR">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 pb-12">
          {/* En-tête de la page */}
          <div className="flex flex-col gap-1 border-b border-zinc-200 pb-5 dark:border-zinc-800">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("subtitle")}</p>
          </div>

          {/* Stepper / Barre de progression */}
          <div className="relative flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            {STEPS.map((s, i) => {
              const isActive = i === stepIndex;
              const isCompleted = i < stepIndex;

              return (
                  <div key={s} className="flex flex-1 items-center gap-3">
                    <div
                        className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-all",
                            isCompleted && "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20",
                            isActive && "bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600/20",
                            !isActive && !isCompleted && "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        )}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-wider text-zinc-400">{`Étape ${i + 1}`}</span>
                      <span
                          className={cn(
                              "text-sm font-semibold",
                              isActive || isCompleted ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500"
                          )}
                      >
                    {t(`steps.${s}`)}
                  </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className="ml-auto h-0.5 flex-1 bg-zinc-200 dark:bg-zinc-800" />
                    )}
                  </div>
              );
            })}
          </div>

          {/* ÉTAPE 1 : INFORMATIONS */}
          {step === "information" && (
              <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("images");
                  }}
                  className="flex flex-col gap-6"
              >
                {/* 1. Général */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">{t("sections.general")}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Input
                        label={t("titleField")}
                        required
                        placeholder="ex: Panneau LED Carrefour PK12"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    />
                    <Input
                        label={t("description")}
                        placeholder="Décrivez l'emplacement et la visibilité..."
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="billboard-type">{t("type")}</Label>
                        <Select
                            value={form.type}
                            onValueChange={(v) => setForm((f) => ({ ...f, type: v as BillboardType }))}
                        >
                          <SelectTrigger id="billboard-type" className="bg-white dark:bg-zinc-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OOH">OOH (Classique)</SelectItem>
                            <SelectItem value="DOOH">DOOH (Numérique)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                          label={t("format")}
                          required
                          placeholder="ex: 4x3, Unipole, Abribus"
                          value={form.format}
                          onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Caractéristiques physiques */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">{t("sections.physical")}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Input
                          type="number"
                          step="0.01"
                          label={`${t("width")} (m)`}
                          placeholder="4.00"
                          value={form.width}
                          onChange={(e) => setForm((f) => ({ ...f, width: e.target.value }))}
                      />
                      <Input
                          type="number"
                          step="0.01"
                          label={`${t("height")} (m)`}
                          placeholder="3.00"
                          value={form.height}
                          onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                      />
                      <Input
                          type="number"
                          min={1}
                          label={t("facesCount")}
                          value={form.facesCount}
                          onChange={(e) => setForm((f) => ({ ...f, facesCount: e.target.value }))}
                      />
                    </div>

                    {/* Toggles sous forme de cartes d'options */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label
                          className={cn(
                              "flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all",
                              form.illuminated
                                  ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                          )}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t("illuminated")}</span>
                          <span className="text-xs text-zinc-500">Éclairage nocturne disponible</span>
                        </div>
                        <input
                            type="checkbox"
                            className="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            checked={form.illuminated}
                            onChange={(e) => setForm((f) => ({ ...f, illuminated: e.target.checked }))}
                        />
                      </label>

                      <label
                          className={cn(
                              "flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-all",
                              form.digital
                                  ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                          )}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t("digital")}</span>
                          <span className="text-xs text-zinc-500">Écran dynamique / vidéo</span>
                        </div>
                        <input
                            type="checkbox"
                            className="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                            checked={form.digital}
                            onChange={(e) => setForm((f) => ({ ...f, digital: e.target.checked }))}
                        />
                      </label>
                    </div>

                    {/* Configuration DOOH dynamique */}
                    {form.digital && (
                        <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 sm:grid-cols-2">
                          <Input
                              label={t("resolution")}
                              placeholder="1920x1080"
                              value={form.resolution}
                              onChange={(e) => setForm((f) => ({ ...f, resolution: e.target.value }))}
                          />
                          <Input
                              type="number"
                              min={1}
                              label={`${t("spotDurationSeconds")} (sec)`}
                              placeholder="10"
                              value={form.spotDurationSeconds}
                              onChange={(e) => setForm((f) => ({ ...f, spotDurationSeconds: e.target.value }))}
                          />
                        </div>
                    )}
                  </CardContent>
                </Card>

                {/* 3. Localisation & Trafic */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">{t("sections.location")}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <CitySelect label={t("city")} value={selectedCity} onSelect={handleCitySelect} />
                    <Input
                        label={t("address")}
                        placeholder="ex: Boulevard de la Liberté, face à la banque"
                        value={form.address}
                        onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                          label={t("environmentType")}
                          placeholder={t("environmentTypePlaceholder")}
                          value={form.environmentType}
                          onChange={(e) => setForm((f) => ({ ...f, environmentType: e.target.value }))}
                      />
                      <Input
                          label={t("orientation")}
                          placeholder={t("orientationPlaceholder")}
                          value={form.orientation}
                          onChange={(e) => setForm((f) => ({ ...f, orientation: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Input
                          label={t("latitude")}
                          required
                          value={form.latitude}
                          onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                      />
                      <Input
                          label={t("longitude")}
                          required
                          value={form.longitude}
                          onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                      />
                      <Input
                          type="number"
                          min={0}
                          label={t("dailyImpressions")}
                          placeholder="ex: 50000"
                          value={form.dailyImpressions}
                          onChange={(e) => setForm((f) => ({ ...f, dailyImpressions: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 4. Tarification */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold">{t("sections.pricing")}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Input
                          type="number"
                          min={0}
                          step="0.01"
                          label={t("dailyPrice")}
                          required
                          placeholder="0.00"
                          value={form.dailyPrice}
                          onChange={(e) => setForm((f) => ({ ...f, dailyPrice: e.target.value }))}
                      />
                      <p className="mt-1 text-xs text-zinc-500">{t("dailyPriceHint")}</p>
                    </div>
                    <div>
                      <Input
                          type="number"
                          min={0}
                          step="0.01"
                          label={t("monthlyPrice")}
                          placeholder="0.00"
                          value={form.monthlyPrice}
                          onChange={(e) => setForm((f) => ({ ...f, monthlyPrice: e.target.value }))}
                      />
                      <p className="mt-1 text-xs text-zinc-500">{t("monthlyPriceHint")}</p>
                    </div>
                    <Input
                        label={t("currency")}
                        required
                        value={form.currency}
                        onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                    />
                    <Input
                        type="number"
                        min={1}
                        label={t("minBookingDays")}
                        value={form.minBookingDays}
                        onChange={(e) => setForm((f) => ({ ...f, minBookingDays: e.target.value }))}
                    />
                  </CardContent>
                </Card>

                {/* Actions du formulaire */}
                <div className="flex justify-end pt-2">
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={!informationComplete}>
                    {t("next")} →
                  </Button>
                </div>
              </form>
          )}

          {/* ÉTAPE 2 : IMAGES */}
          {step === "images" && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle>{t("imageStepTitle")}</CardTitle>
                  <CardDescription>{t("imageStepDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Photo principale */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Image principale du panneau
                    </Label>
                    <ImagePicker value={imageUrl} onChange={setImageUrl} />
                  </div>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

                  {/* Galerie photos */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t("galleryTitle")}</p>
                      <p className="text-xs text-zinc-500">{t("galleryDescription")}</p>
                    </div>
                    <GalleryPicker value={galleryUrls} onChange={setGalleryUrls} />
                  </div>

                  {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                        {error}
                      </div>
                  )}

                  {/* Actions étape 2 */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => setStep("information")}>
                      ← {t("back")}
                    </Button>
                    <Button type="button" size="lg" className="w-full" loading={submitting} onClick={handleCreate}>
                      {t("create")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
          )}
        </div>
      </DashboardShell>
  );
}