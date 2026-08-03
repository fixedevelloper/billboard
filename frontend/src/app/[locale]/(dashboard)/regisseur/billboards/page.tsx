"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ImageUploadField } from "@/components/media/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { BillboardCard } from "@/features/billboards/BillboardCard";
import { useMyBillboards } from "@/features/billboards/useBillboards";
import { captureGeolocation, submitPOP } from "@/features/proof-of-performance/usePOP";
import { extractErrorMessage } from "@/lib/api";

export default function RegisseurBillboardsPage() {
  const t = useTranslations("regisseurBillboards");
  const tCommon = useTranslations("common");
  const { billboards, loading } = useMyBillboards();

  const [popForm, setPopForm] = useState({ orderId: "", billboardId: "", photoUrl: "", latitude: "", longitude: "" });
  const [popStatus, setPopStatus] = useState<string | null>(null);

  async function handleUseLocation() {
    try {
      const { latitude, longitude } = await captureGeolocation();
      setPopForm((f) => ({ ...f, latitude: String(latitude), longitude: String(longitude) }));
    } catch {
      setPopStatus(t("geolocationError"));
    }
  }

  async function handleSubmitPOP(event: FormEvent) {
    event.preventDefault();
    setPopStatus(null);
    if (!popForm.photoUrl) {
      setPopStatus(t("popPhotoRequired"));
      return;
    }
    try {
      await submitPOP({
        orderId: popForm.orderId,
        billboardId: popForm.billboardId,
        photoUrl: popForm.photoUrl,
        latitude: Number(popForm.latitude),
        longitude: Number(popForm.longitude),
      });
      setPopStatus(t("popSaved"));
      setPopForm({ orderId: "", billboardId: "", photoUrl: "", latitude: "", longitude: "" });
    } catch (err) {
      setPopStatus(extractErrorMessage(err));
    }
  }

  return (
    <DashboardShell role="REGISSEUR">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
            <Button asChild>
              <Link href="/regisseur/billboards/new">{t("addBillboard")}</Link>
            </Button>
          </div>
          {loading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}
          {!loading && billboards.length === 0 && (
            <p className="text-sm text-zinc-500">{t("noBillboards")}</p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {billboards.map((billboard) => (
              <BillboardCard key={billboard.id} billboard={billboard} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardTitle>{t("popTitle")}</CardTitle>
            <form onSubmit={handleSubmitPOP} className="mt-3 flex flex-col gap-3">
              <Input
                label={t("popOrderId")}
                required
                value={popForm.orderId}
                onChange={(e) => setPopForm((f) => ({ ...f, orderId: e.target.value }))}
              />
              <Input
                label={t("popBillboardId")}
                required
                value={popForm.billboardId}
                onChange={(e) => setPopForm((f) => ({ ...f, billboardId: e.target.value }))}
              />
              <ImageUploadField
                label={t("popPhotoUrl")}
                value={popForm.photoUrl}
                onChange={(url) => setPopForm((f) => ({ ...f, photoUrl: url }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label={t("latitude")}
                  required
                  value={popForm.latitude}
                  onChange={(e) => setPopForm((f) => ({ ...f, latitude: e.target.value }))}
                />
                <Input
                  label={t("longitude")}
                  required
                  value={popForm.longitude}
                  onChange={(e) => setPopForm((f) => ({ ...f, longitude: e.target.value }))}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleUseLocation}>
                {t("useCurrentLocation")}
              </Button>
              {popStatus && <p className="text-sm text-zinc-600 dark:text-zinc-300">{popStatus}</p>}
              <Button type="submit">{t("savePop")}</Button>
            </form>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
