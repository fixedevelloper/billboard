"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { payOrder, useDelegatedOrders } from "@/features/booking/useOrders";
import { extractErrorMessage } from "@/lib/api";

export default function MediaBuyerPage() {
  const t = useTranslations("mediaBuyer");
  const tCommon = useTranslations("common");
  const tOrderStatus = useTranslations("orderStatus");
  const { orders, loading, refetch } = useDelegatedOrders();
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePay(orderId: string) {
    setBusyOrderId(orderId);
    setError(null);
    try {
      await payOrder(orderId, "BANK_TRANSFER");
      refetch();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusyOrderId(null);
    }
  }

  return (
    <DashboardShell role="MEDIA_BUYER">
      <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
      <p className="mb-6 text-sm text-zinc-500">{t("subtitle")}</p>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}
      {!loading && orders.length === 0 && <p className="text-sm text-zinc-500">{t("noOrders")}</p>}

      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {t("orderSummary", { count: order.items.length, amount: order.totalAmount, currency: order.currency })}
              </p>
              <Badge tone="info">{tOrderStatus(order.status)}</Badge>
            </div>
            {order.status === "DELEGATED" && (
              <Button size="sm" loading={busyOrderId === order.id} onClick={() => handlePay(order.id)}>
                {t("payOnBehalf")}
              </Button>
            )}
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
