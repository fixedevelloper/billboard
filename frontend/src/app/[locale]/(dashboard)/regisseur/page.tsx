"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ImageUploadField } from "@/components/media/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BillboardCard } from "@/features/billboards/BillboardCard";
import { createBillboard, useMyBillboards } from "@/features/billboards/useBillboards";
import type { BillboardType } from "@/features/billboards/types";
import { captureGeolocation, submitPOP } from "@/features/proof-of-performance/usePOP";
import { useWallet } from "@/features/wallet/useWallet";
import { WalletBalance } from "@/features/wallet/WalletBalance";
import { extractErrorMessage } from "@/lib/api";

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
  imageUrl: "",
};

export default function RegisseurPage() {
  const t = useTranslations("regisseur");
  const tCommon = useTranslations("common");
  const { billboards, loading, refetch } = useMyBillboards();
  const { wallet, loading: walletLoading } = useWallet();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [popForm, setPopForm] = useState({ orderId: "", billboardId: "", photoUrl: "", latitude: "", longitude: "" });
  const [popStatus, setPopStatus] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
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
        imageUrl: form.imageUrl || undefined,
      });
      setForm(EMPTY_FORM);
      setCreateOpen(false);
      refetch();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

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
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("myInventory")}</h1>
            <Button onClick={() => setCreateOpen(true)}>{t("addBillboard")}</Button>
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
          <WalletBalance wallet={wallet} loading={walletLoading} />

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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createModalTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreate} className="flex flex-col gap-3">
          <Input
            label={t("titleField")}
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
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
          <ImageUploadField
            label={t("imageUrl")}
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={submitting}>
            {t("createBillboard")}
          </Button>
        </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
