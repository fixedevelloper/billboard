"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {BillboardDetailsModal} from "@/features/billboards/BillboardDetailsModal";
import {CountrySelect} from "@/features/billboards/country-select";

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
  const lines = useCartStore((s) => s.lines);
  const addLine = useCartStore((s) => s.addLine);
  const removeLine = useCartStore((s) => s.removeLine);
  const cartTotal = useCartTotal();
  const [selected, setSelected] = useState<Billboard | null>(null);
  const [open, setOpen] = useState(false);
  const { billboards, loading, error } = useBillboards({
    city: city || undefined,
    type: type === "ALL" ? undefined : type,
    status: "AVAILABLE",
  });

  if (authLoading) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-zinc-500">
          {tCommon("loading")}
        </div>
    );
  }

  if (!user) {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-10">
          <Card className="w-full max-w-md text-center shadow-sm">
            <div className="space-y-4 p-6">
              <CardTitle>{t("loginRequiredTitle")}</CardTitle>
              <CardDescription>{t("loginRequiredDescription")}</CardDescription>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link href="/login">{tNav("login")}</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/register">{tNav("register")}</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
    );
  }

  function selectedCountry(code: string) {

  }

  return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("title")}
              </h1>
              <Badge className="rounded-full">
                {billboards.length} résultats
              </Badge>
            </div>
            <p className="text-sm text-zinc-500">{t("subtitle")}</p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1.4fr_0.8fr_auto]">

                        <CountrySelect
                            value={selected?.country}
                            onChange={(iso2) =>selectedCountry(iso2)}
                        />


{/*            <PickLocationAutocomplete
                icon={<Building2 className="size-4 text-primary" />}
                label={t("locationLabel")}
                placeholder={t("locationPlaceholder")}
                searchPlaceholder={t("locationPlaceholder")}
                hintLabel={t("locationHint")}
                noResultsLabel={t("locationNoResults")}
                initialLabel=""
                fetchOptions={searchCitySuggestions}
                onSelect={(option) => selectedCountry(option.code)}
            />*/}
            <Input
                placeholder={t("cityPlaceholder")}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11"
            />
            <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={t("allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t("allTypes")}</SelectItem>
                <SelectItem value="OOH">OOH</SelectItem>
                <SelectItem value="DOOH">DOOH</SelectItem>
              </SelectContent>
            </Select>
            <Button
                variant="outline"
                className="h-11"
                onClick={() => {
                  setCity("");
                  setType("ALL");
                }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
        )}

        {lines.length > 0 && (
            <Card className="mt-4 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
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

        <div className="mt-6">
          {loading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}

          {!loading && billboards.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                {t("noResults")}
              </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {billboards.map((billboard) => {
              const inCart = lines.some((l) => l.billboardId === billboard.id);

              return (
                  <BillboardCard
                      key={billboard.id}
                      billboard={billboard}
                      selected={false}
                      onSelect={(b) => {
                        setSelected(b);
                        setOpen(true);
                      }}
                      onViewMap={(b) => {
                        setSelected(b);
                        setOpen(true);
                      }}
                      action={
                        <Button
                            size="sm"
                            variant={inCart ? "outline" : "default"}
                            onClick={() => {
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
        <BillboardDetailsModal
            billboard={selected}
            open={open}
            onOpenChange={setOpen}
            onAddToCart={(b) => {
              addLine({
                billboardId: b.id,
                title: b.title,
                monthlyPrice: b.monthlyPrice,
                currency: b.currency,
                ...defaultPeriod(),
              });
            }}
        />
      </div>
  );
}