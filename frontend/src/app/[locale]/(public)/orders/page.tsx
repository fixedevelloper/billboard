"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { cancelOrder, delegateOrder, payOrder, useMyOrders } from "@/features/booking/useOrders";
import { useAuth } from "@/lib/AuthProvider";
import { extractErrorMessage } from "@/lib/api";

export default function OrdersPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const tOrderStatus = useTranslations("orderStatus");
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, refetch } = useMyOrders();
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [delegateTarget, setDelegateTarget] = useState<string | null>(null);
  const [mediaBuyerId, setMediaBuyerId] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  if (authLoading) {
    return <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">{tCommon("loading")}</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10">
        <Card className="max-w-md text-center">
          <p className="text-sm text-zinc-500">{t("loginRequired")}</p>
          <Button className="mx-auto mt-4 w-fit" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
        <p className="text-sm text-zinc-500">{t("subtitle")}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
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
            <div className="flex gap-2">
              {order.status === "DRAFT" && (
                <Button
                  size="sm"
                  loading={busyOrderId === order.id}
                  onClick={() => handleAction(() => cancelOrder(order.id), order.id)}
                  variant="danger"
                >
                  {t("cancel")}
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
                  {user.role === "ANNONCEUR" && (
                    <Button size="sm" variant="outline" onClick={() => setDelegateTarget(order.id)}>
                      {t("delegate")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="danger"
                    loading={busyOrderId === order.id}
                    onClick={() => handleAction(() => cancelOrder(order.id), order.id)}
                  >
                    {t("cancel")}
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
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
    </div>
  );
}
