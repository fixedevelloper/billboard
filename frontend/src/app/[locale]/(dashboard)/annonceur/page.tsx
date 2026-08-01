"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BillboardCard } from "@/features/billboards/BillboardCard";
import { useBillboards } from "@/features/billboards/useBillboards";
import { useCart } from "@/features/booking/CartProvider";
import { cancelOrder, checkoutOrder, createOrder, delegateOrder, payOrder, useMyOrders } from "@/features/booking/useOrders";
import { extractErrorMessage } from "@/lib/api";

const CURRENCY = "XOF";

function defaultPeriod() {
  const start = new Date();
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}

export default function AnnonceurPage() {
  const t = useTranslations("annonceur");
  const tCommon = useTranslations("common");
  const tOrderStatus = useTranslations("orderStatus");
  const [city, setCity] = useState("");
  const { billboards, loading } = useBillboards({ city: city || undefined, status: "AVAILABLE" });
  const { lines, addLine, removeLine, clear, totalAmount } = useCart();
  const { orders, loading: ordersLoading, refetch } = useMyOrders();
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [delegateTarget, setDelegateTarget] = useState<string | null>(null);
  const [mediaBuyerId, setMediaBuyerId] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleCreateOrder() {
    if (lines.length === 0) return;
    setError(null);
    try {
      await createOrder(CURRENCY, lines);
      clear();
      refetch();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }

  async function handleAction(action: () => Promise<unknown>, orderId: string) {
    setBusyOrderId(orderId);
    setError(null);
    try {
      await action();
      refetch();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusyOrderId(null);
    }
  }

  return (
    <DashboardShell role="ANNONCEUR">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("composeCampaign")}</h1>
          <Input
            placeholder={t("filterByCity")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mb-4 w-64"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {loading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}
            {billboards.map((billboard) => {
              const period = defaultPeriod();
              const inCart = lines.some((l) => l.billboardId === billboard.id);
              return (
                <BillboardCard
                  key={billboard.id}
                  billboard={billboard}
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
                            ...period,
                          });
                        }
                      }}
                    >
                      {inCart ? t("remove") : t("add")}
                    </Button>
                  }
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardTitle>{t("cart")}</CardTitle>
            <CardDescription>{t("cartCount", { count: lines.length })}</CardDescription>
            <ul className="mt-3 flex flex-col gap-2">
              {lines.map((line) => (
                <li key={line.billboardId} className="flex justify-between text-sm">
                  <span>{line.title}</span>
                  <span>
                    {line.monthlyPrice} {line.currency}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-sm font-semibold dark:border-zinc-800">
              <span>{t("total")}</span>
              <span>
                {totalAmount} {CURRENCY}
              </span>
            </div>
            <Button className="mt-4 w-full" disabled={lines.length === 0} onClick={handleCreateOrder}>
              {t("createOrder")}
            </Button>
          </Card>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t("myOrders")}</h2>
        {ordersLoading && <p className="text-sm text-zinc-500">{tCommon("loading")}</p>}
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Card key={order.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {t("orderSummary", { count: order.items.length, amount: order.totalAmount, currency: order.currency })}
                </p>
                <Badge tone="info">{tOrderStatus(order.status)}</Badge>
              </div>
              <div className="flex gap-2">
                {order.status === "DRAFT" && (
                  <Button
                    size="sm"
                    loading={busyOrderId === order.id}
                    onClick={() => handleAction(() => checkoutOrder(order.id), order.id)}
                  >
                    {t("validateOrder")}
                  </Button>
                )}
                {order.status === "PENDING_PAYMENT" && (
                  <>
                    <Button
                      size="sm"
                      loading={busyOrderId === order.id}
                      onClick={() => handleAction(() => payOrder(order.id, "CARD"), order.id)}
                    >
                      {t("pay")}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setDelegateTarget(order.id)}>
                      {t("delegate")}
                    </Button>
                  </>
                )}
                {(order.status === "DRAFT" || order.status === "PENDING_PAYMENT") && (
                  <Button
                    size="sm"
                    variant="danger"
                    loading={busyOrderId === order.id}
                    onClick={() => handleAction(() => cancelOrder(order.id), order.id)}
                  >
                    {t("cancel")}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={delegateTarget !== null} onOpenChange={(open) => !open && setDelegateTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delegateModalTitle")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              label={t("mediaBuyerId")}
              value={mediaBuyerId}
              onChange={(e) => setMediaBuyerId(e.target.value)}
              placeholder={t("mediaBuyerIdPlaceholder")}
            />
            <Button
              onClick={async () => {
                if (!delegateTarget) return;
                await handleAction(() => delegateOrder(delegateTarget, mediaBuyerId), delegateTarget);
                setDelegateTarget(null);
                setMediaBuyerId("");
              }}
            >
              {t("confirmDelegation")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
