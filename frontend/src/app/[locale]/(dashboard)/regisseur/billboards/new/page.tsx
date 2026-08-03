"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ImagePicker } from "@/components/media/ImagePicker";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { createBillboard } from "@/features/billboards/useBillboards";
import type { BillboardType } from "@/features/billboards/types";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
  title: "",
  description: "",
  type: "OOH" as BillboardType,
  format: "",
  city: "",
  country: "",
  address: "",
  latitude: "",
  longitude: "",
  monthlyPrice: "",
  currency: "XOF",
};

const STEPS = ["information", "images"] as const;
type Step = (typeof STEPS)[number];

export default function NewRegisseurBillboardPage() {
  const t = useTranslations("regisseurNewBillboard");
  const router = useRouter();
  const [step, setStep] = useState<Step>("information");
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stepIndex = STEPS.indexOf(step);

  const informationComplete =
    form.title && form.format && form.city && form.country && form.latitude && form.longitude && form.monthlyPrice && form.currency;

  async function handleCreate() {
    setSubmitting(true);
    setError(null);
    try {
      await createBillboard({
        title: form.title,
        description: form.description || undefined,
        type: form.type,
        format: form.format,
        city: form.city,
        country: form.country,
        address: form.address || undefined,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        monthlyPrice: Number(form.monthlyPrice),
        currency: form.currency,
        imageUrl: imageUrl || undefined,
      });
      router.push("/regisseur/billboards");
    } catch (err) {
      setError(extractErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell role="REGISSEUR">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
          <p className="text-sm text-zinc-500">{t("subtitle")}</p>
        </div>

        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  i < stepIndex
                    ? "bg-emerald-600 text-white"
                    : i === stepIndex
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800",
                )}
              >
                {i + 1}
              </span>
              <span className={cn("text-sm font-medium", i === stepIndex ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500")}>
                {t(`steps.${s}`)}
              </span>
              {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />}
            </li>
          ))}
        </ol>

        {step === "information" && (
          <Card>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("images");
              }}
              className="flex flex-col gap-3"
            >
              <Input
                label={t("titleField")}
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <Input
                label={t("description")}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="billboard-type">{t("type")}</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as BillboardType }))}>
                  <SelectTrigger id="billboard-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OOH">OOH</SelectItem>
                    <SelectItem value="DOOH">DOOH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                label={t("format")}
                required
                value={form.format}
                onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label={t("city")}
                  required
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
                <Input
                  label={t("country")}
                  required
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                />
              </div>
              <Input
                label={t("address")}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
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
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label={t("monthlyPrice")}
                  required
                  value={form.monthlyPrice}
                  onChange={(e) => setForm((f) => ({ ...f, monthlyPrice: e.target.value }))}
                />
                <Input
                  label={t("currency")}
                  required
                  value={form.currency}
                  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                />
              </div>
              <Button type="submit" className="mt-2" disabled={!informationComplete}>
                {t("next")}
              </Button>
            </form>
          </Card>
        )}

        {step === "images" && (
          <Card>
            <CardTitle>{t("imageStepTitle")}</CardTitle>
            <CardDescription>{t("imageStepDescription")}</CardDescription>
            <div className="mt-3">
              <ImagePicker value={imageUrl} onChange={setImageUrl} />
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex gap-3">
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep("information")}>
                {t("back")}
              </Button>
              <Button type="button" className="w-full" loading={submitting} onClick={handleCreate}>
                {t("create")}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
