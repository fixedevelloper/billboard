"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import MapView from "@/components/map/MapViewLoader";
import { BillboardCard } from "@/features/billboards/BillboardCard";
import { useBillboards } from "@/features/billboards/useBillboards";
import type { Billboard } from "@/features/billboards/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PublicBillboardsPage() {
  const t = useTranslations("billboardsSearch");
  const tCommon = useTranslations("common");
  const [city, setCity] = useState("");
  const [type, setType] = useState<"ALL" | "OOH" | "DOOH">("ALL");
  const [selected, setSelected] = useState<Billboard | null>(null);

  const { billboards, loading, error } = useBillboards({
    city: city || undefined,
    type: type === "ALL" ? undefined : type,
    status: "AVAILABLE",
  });

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

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-[520px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <MapView billboards={billboards} selectedId={selected?.id} onSelect={setSelected} />
        </div>
        <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto pr-1">
          {loading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}
          {!loading && billboards.length === 0 && (
            <p className="text-sm text-zinc-500">{t("noResults")}</p>
          )}
          {billboards.map((billboard) => (
            <BillboardCard
              key={billboard.id}
              billboard={billboard}
              selected={selected?.id === billboard.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
