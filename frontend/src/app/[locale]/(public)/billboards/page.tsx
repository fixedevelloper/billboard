"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import MapView from "@/components/map/MapViewLoader";
import { BillboardCard } from "@/features/billboards/BillboardCard";
import { useBillboards } from "@/features/billboards/useBillboards";
import type { Billboard } from "@/features/billboards/types";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCartStore, useCartTotal } from "@/features/booking/useCartStore";
import { useAuth } from "@/lib/AuthProvider";

const CURRENCY = "XOF";

function defaultPeriod() {
  const start = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}

export default function PublicBillboardsPage() {
  const t = useTranslations("billboardsSearch");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const { user, loading: authLoading } = useAuth();
  const [city, setCity] = useState("");
  const [type, setType] = useState<"ALL" | "OOH" | "DOOH">("ALL");
  const [selected, setSelected] = useState<Billboard | null>(null);
  const lines = useCartStore((s) => s.lines);
  const addLine = useCartStore((s) => s.addLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const cartTotal = useCartTotal();

  const { billboards, loading, error } = useBillboards({
    city: city || undefined,
    type: type === "ALL" ? undefined : type,
    status: "AVAILABLE",
  });

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">{tCommon("loading")}</div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10">
        <Card className="max-w-md text-center">
          <CardTitle>{t("loginRequiredTitle")}</CardTitle>
          <CardDescription>{t("loginRequiredDescription")}</CardDescription>
          <div className="mt-4 flex justify-center gap-3">
            <Button asChild>
              <Link href="/login">{tNav("login")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">{tNav("register")}</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
        <p className="text-sm text-zinc-500">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input placeholder={t("cityPlaceholder")} value={city} onChange={(e) => setCity(e.target.value)} className="w-56" />
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("allTypes")}</SelectItem>
            <SelectItem value="OOH">OOH</SelectItem>
            <SelectItem value="DOOH">DOOH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {lines.length > 0 && (
        <Card className="flex flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {t("cartCount", { count: lines.length })}
            </p>
            <p className="text-sm text-zinc-500">
              {t("cartTotal")}: {cartTotal} {CURRENCY}
            </p>
          </div>
          <Button asChild>
            <Link href="/checkout">{t("goToCheckout")}</Link>
          </Button>
        </Card>
      )}

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[520px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <MapView billboards={billboards} selectedId={selected?.id} onSelect={setSelected} />
        </div>
        <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto pr-1">
          {loading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}
          {!loading && billboards.length === 0 && (
            <p className="text-sm text-zinc-500">{t("noResults")}</p>
          )}
          {billboards.map((billboard) => {
            const inCart = lines.some((l) => l.billboardId === billboard.id);
            return (
              <BillboardCard
                key={billboard.id}
                billboard={billboard}
                selected={selected?.id === billboard.id}
                onSelect={setSelected}
                action={
                  <Button
                    size="sm"
                    variant={inCart ? "outline" : "primary"}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inCart) {
                        removeLine(billboard.id);
                      } else {
                        addLine({
                          billboardId: billboard.id,
                          title: billboard.title,
                          monthlyPrice: billboard.monthlyPrice,
                          currency: billboard.currency,
                          ...defaultPeriod(),
                        });
                      }
                    }}
                  >
                    {inCart ? t("removeFromCart") : t("addToCart")}
                  </Button>
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
