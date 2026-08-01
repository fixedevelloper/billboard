"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Billboard } from "./types";

const STATUS_TONE = {
  AVAILABLE: "success",
  RESERVED: "warning",
  MAINTENANCE: "neutral",
  INACTIVE: "danger",
} as const;

export function BillboardCard({
  billboard,
  selected,
  onSelect,
  action,
}: {
  billboard: Billboard;
  selected?: boolean;
  onSelect?: (billboard: Billboard) => void;
  action?: React.ReactNode;
}) {
  const tStatus = useTranslations("billboardStatus");
  const tCommon = useTranslations("common");

  return (
    <Card
      onClick={() => onSelect?.(billboard)}
      className={`cursor-pointer transition-shadow hover:shadow-md ${selected ? "ring-2 ring-blue-500" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <CardTitle>{billboard.title}</CardTitle>
          <CardDescription>
            {billboard.city}, {billboard.country} · {billboard.format}
          </CardDescription>
        </div>
        <Badge tone={STATUS_TONE[billboard.status]}>{tStatus(billboard.status)}</Badge>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge tone="info">{billboard.type}</Badge>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {billboard.monthlyPrice} {billboard.currency}
            <span className="font-normal text-zinc-500"> {tCommon("perMonth")}</span>
          </span>
        </div>
        {action}
      </div>
    </Card>
  );
}
