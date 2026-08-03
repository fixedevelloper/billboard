"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import { useCartStore, useCartTotal } from "@/features/booking/useCartStore";
import { checkoutOrder, createOrder } from "@/features/booking/useOrders";
import { useAuth } from "@/lib/AuthProvider";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const CURRENCY = "XOF";
const STEPS = ["billboards", "summary", "confirmation"] as const;
type Step = (typeof STEPS)[number];

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const { user, loading: authLoading } = useAuth();
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateLineDates = useCartStore((s) => s.updateLineDates);
  const clear = useCartStore((s) => s.clear);
  const totalAmount = useCartTotal();
  const [step, setStep] = useState<Step>("billboards");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const invalidLine = lines.find((l) => !l.startDate || !l.endDate || l.startDate >= l.endDate);
  const stepIndex = STEPS.indexOf(step);

  async function handleConfirm() {
    if (lines.length === 0 || invalidLine) return;
    setSubmitting(true);
    setError(null);
    try {
      const order = await createOrder(CURRENCY, lines);
      await checkoutOrder(order.id);
      clear();
      setConfirmedOrderId(order.id);
      setStep("confirmation");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading) {
    return <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">{tCommon("loading")}</div>;
  }

  if (!user) {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10">
          <Card className="max-w-md text-center">
            <CardTitle>{t("loginRequiredTitle")}</CardTitle>
            <CardDescription>{t("loginRequiredDescription")}</CardDescription>
            <Button className="mx-auto mt-4 w-fit" asChild>
              <Link href="/login">{tNav("login")}</Link>
            </Button>
          </Card>
        </div>
    );
  }

  if (lines.length === 0 && step !== "confirmation") {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-10">
          <Card className="max-w-md text-center">
            <CardTitle>{t("emptyTitle")}</CardTitle>
            <CardDescription>{t("emptyDescription")}</CardDescription>
            <Button className="mx-auto mt-4 w-fit" asChild>
              <Link href="/billboards">{t("browseBillboards")}</Link>
            </Button>
          </Card>
        </div>
    );
  }

  return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
          <p className="text-sm text-zinc-500">{t("subtitle")}</p>
        </div>

        {/* Stepper */}
        <ol className="flex items-center gap-2">
          {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                        <span
                            className={cn(
                                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                i < stepIndex
                                    ? "bg-emerald-600 text-white"
                                    : i === stepIndex
                                        ? "bg-blue-600 text-white"
                                        : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800"
                            )}
                        >
                            {i + 1}
                        </span>
                <span className={cn("text-sm font-medium", i === stepIndex ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-500")}>
                            {t(`steps.${s}`)}
                        </span>
                {i < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />}
              </li>
          ))}
        </ol>

        {/* Étape 1 : Liste des panneaux & sélection des dates */}
        {step === "billboards" && (
            <div className="flex flex-col gap-4">
              {lines.map((line) => {
                const imageUrl = line.imageUrl || (line as any).image;

                return (
                    <Card key={line.billboardId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-1 items-start gap-4">
                        {/* Vignette de l'image du panneau */}
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                          {imageUrl ? (
                              <img
                                  src={imageUrl}
                                  alt={line.title}
                                  className="size-full object-cover"
                              />
                          ) : (
                              <div className="flex size-full items-center justify-center text-xl text-zinc-400">
                                🪧
                              </div>
                          )}
                        </div>

                        {/* Détails du panneau */}
                        <div className="flex flex-1 flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-zinc-900 dark:text-zinc-50">{line.title}</p>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                              {line.monthlyPrice} {line.currency}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                                label={t("startDate")}
                                type="date"
                                value={line.startDate}
                                onChange={(e) => updateLineDates(line.billboardId, e.target.value, line.endDate)}
                            />
                            <Input
                                label={t("endDate")}
                                type="date"
                                value={line.endDate}
                                onChange={(e) => updateLineDates(line.billboardId, line.startDate, e.target.value)}
                            />
                          </div>
                          {line.startDate >= line.endDate && <p className="text-xs text-red-600">{t("invalidPeriod")}</p>}
                        </div>
                      </div>

                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeLine(line.billboardId)}
                          className="self-end sm:self-start"
                      >
                        {t("remove")}
                      </Button>
                    </Card>
                );
              })}
              <Button className="w-full" disabled={lines.length === 0 || !!invalidLine} onClick={() => setStep("summary")}>
                {t("next")}
              </Button>
            </div>
        )}

        {/* Étape 2 : Récapitulatif de la commande */}
        {step === "summary" && (
            <div className="flex flex-col gap-4">
              <Card>
                <CardTitle>{t("summaryTitle")}</CardTitle>
                <ul className="mt-4 flex flex-col gap-3">
                  {lines.map((line) => {
                    const imageUrl = line.imageUrl || (line as any).image;

                    return (
                        <li key={line.billboardId} className="flex items-center gap-3">
                          {/* Image miniature dans le récapitulatif */}
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={line.title}
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-sm text-zinc-400">
                                  🪧
                                </div>
                            )}
                          </div>

                          <div className="flex flex-1 items-center justify-between text-sm">
                            <div>
                              <p className="font-medium text-zinc-900 dark:text-zinc-50">{line.title}</p>
                              <p className="text-xs text-zinc-500">
                                {line.startDate} → {line.endDate}
                              </p>
                            </div>
                            <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                {line.monthlyPrice} {line.currency}
                                            </span>
                          </div>
                        </li>
                    );
                  })}
                </ul>

                <div className="mt-4 flex justify-between border-t border-zinc-200 pt-3 text-sm font-semibold dark:border-zinc-800">
                  <span>{t("total")}</span>
                  <span>
                                {totalAmount} {CURRENCY}
                            </span>
                </div>
              </Card>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button variant="outline" className="w-full" onClick={() => setStep("billboards")}>
                  {t("back")}
                </Button>
                <Button className="w-full" loading={submitting} onClick={handleConfirm}>
                  {t("confirm")}
                </Button>
              </div>
            </div>
        )}

        {/* Étape 3 : Confirmation */}
        {step === "confirmation" && confirmedOrderId && (
            <Card className="text-center">
              <Badge tone="success" className="mx-auto">
                {t("confirmationBadge")}
              </Badge>
              <CardTitle className="mt-2">{t("confirmationTitle")}</CardTitle>
              <CardDescription>{t("confirmationDescription")}</CardDescription>
              <div className="mx-auto mt-4 flex w-fit gap-3">
                <Button variant="outline" asChild>
                  <Link href="/billboards">{t("browseBillboards")}</Link>
                </Button>
                <Button asChild>
                  <Link href="/orders">{t("viewOrders")}</Link>
                </Button>
              </div>
            </Card>
        )}
      </div>
  );
}