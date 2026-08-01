"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { cancelOrder, delegateOrder, payOrder, useMyOrders } from "@/features/booking/useOrders";
import { useAuth } from "@/lib/AuthProvider";
import { extractErrorMessage } from "@/lib/api";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  ShoppingCart,
  XCircle,
  CreditCard,
  UserPlus,
  AlertCircle,
  Package,
  Calendar,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function AnnonceurOrdersPage() {
  const t = useTranslations("orders");
  const tCommon = useTranslations("common");
  const tOrderStatus = useTranslations("orderStatus");
  const { user, loading: authLoading } = useAuth();
  const { orders = [], loading, refetch } = useMyOrders();

  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [delegateTarget, setDelegateTarget] = useState<string | null>(null);
  const [mediaBuyerId, setMediaBuyerId] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleAction(action: () => Promise<unknown>, orderId: string): Promise<boolean> {
    setBusyOrderId(orderId);
    setError(null);
    try {
      await action();
      await refetch();
      return true;
    } catch (err) {
      setError(extractErrorMessage(err));
      return false;
    } finally {
      setBusyOrderId(null);
    }
  }

  const handleDelegateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegateTarget || !mediaBuyerId.trim()) return;

    const success = await handleAction(
        () => delegateOrder(delegateTarget, mediaBuyerId.trim()),
        delegateTarget
    );

    if (success) {
      setDelegateTarget(null);
      setMediaBuyerId("");
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setDelegateTarget(null);
      setMediaBuyerId("");
    }
  };

  const getStatusTone = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "secondary";
      case "PENDING_PAYMENT":
        return "warning";
      case "PAID":
        return "success";
      case "CANCELLED":
        return "danger";
      case "DELEGATED":
        return "info";
      default:
        return "secondary";
    }
  };

  if (authLoading) {
    return (
        <DashboardShell role="ANNONCEUR">
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{tCommon("loading")}</p>
            </div>
          </div>
        </DashboardShell>
    );
  }

  if (!user) {
    return (
        <DashboardShell role="ANNONCEUR">
          <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10">
            <Card className="max-w-md border-zinc-200 shadow-lg dark:border-zinc-800">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">{t("loginRequired")}</CardTitle>
                <CardDescription className="text-zinc-500 dark:text-zinc-400">
                  {t("loginRequiredDescription") || "Veuillez vous connecter pour accéder à vos commandes"}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" asChild>
                  <Link href="/login">
                    {t("login")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardShell>
    );
  }

  return (
      <DashboardShell role="ANNONCEUR">
        <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("title")}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("subtitle")}</p>
            </div>
            <Badge variant="outline" className="w-fit border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900">
              <Package className="mr-2 h-4 w-4" />
              {orders.length} {t("ordersCount", { count: orders.length })}
            </Badge>
          </div>

          {/* Error Banner */}
          {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="flex-1 text-sm font-medium">{error}</div>
                <button
                    onClick={() => setError(null)}
                    className="rounded-lg p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
          )}

          {/* Loading State */}
          {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{tCommon("loading")}</p>
                </div>
              </div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <ShoppingCart className="h-8 w-8 text-zinc-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{t("noOrders")}</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {t("noOrdersDescription") || "Commencez par créer une nouvelle commande"}
                  </p>
                </CardContent>
              </Card>
          )}

          {/* Orders List */}
          <div className="space-y-3">
            {orders.map((order) => {
              const isBusy = busyOrderId === order.id;

              return (
                  <Card
                      key={order.id}
                      className="group relative overflow-hidden border-zinc-200 transition-all hover:shadow-md dark:border-zinc-800"
                  >
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      {/* Order Info */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                              {t("orderSummary", {
                                count: order.items?.length ?? 0,
                                amount: order.totalAmount,
                                currency: order.currency,
                              })}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {t("orderId", { id: order.id.slice(0, 8) })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge tone={getStatusTone(order.status)} className="text-xs">
                            {tOrderStatus(order.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {order.status === "DRAFT" && (
                            <Button
                                size="sm"
                                loading={isBusy}
                                disabled={busyOrderId !== null}
                                onClick={() => handleAction(() => cancelOrder(order.id), order.id)}
                                variant="danger"
                                className="shadow-sm"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {t("cancel")}
                            </Button>
                        )}

                        {order.status === "PENDING_PAYMENT" && (
                            <>
                              <Button
                                  size="sm"
                                  loading={isBusy}
                                  disabled={busyOrderId !== null}
                                  onClick={() => handleAction(() => payOrder(order.id, "CARD"), order.id)}
                                  className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 shadow-sm"
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                {t("pay")}
                              </Button>
                              {user.role === "ANNONCEUR" && (
                                  <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={busyOrderId !== null}
                                      onClick={() => setDelegateTarget(order.id)}
                                      className="border-zinc-300 dark:border-zinc-700"
                                  >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    {t("delegate")}
                                  </Button>
                              )}
                              <Button
                                  size="sm"
                                  variant="danger"
                                  loading={isBusy}
                                  disabled={busyOrderId !== null}
                                  onClick={() => handleAction(() => cancelOrder(order.id), order.id)}
                                  className="shadow-sm"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                {t("cancel")}
                              </Button>
                            </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>

          {/* Delegate Dialog */}
          <Dialog open={delegateTarget !== null} onOpenChange={handleDialogChange}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle>{t("delegateModalTitle")}</DialogTitle>
                    <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                      {t("delegateModalDescription") || "Entrez l'ID du media buyer pour lui déléguer cette commande"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={handleDelegateSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("mediaBuyerId")}
                  </label>
                  <Input
                      value={mediaBuyerId}
                      onChange={(e) => setMediaBuyerId(e.target.value)}
                      placeholder={t("mediaBuyerIdPlaceholder") || "MB-XXXXXXXX"}
                      disabled={busyOrderId === delegateTarget}
                      required
                      className="h-11"
                  />
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogChange(false)}
                      disabled={busyOrderId === delegateTarget}
                      className="border-zinc-300 dark:border-zinc-700"
                  >
                    {tCommon("cancel") || "Annuler"}
                  </Button>
                  <Button
                      type="submit"
                      loading={busyOrderId === delegateTarget}
                      disabled={!mediaBuyerId.trim() || busyOrderId !== null}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("confirmDelegation")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardShell>
  );
}