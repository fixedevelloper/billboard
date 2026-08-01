"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, extractErrorMessage } from "@/lib/api";

export default function AdminPage() {
  const t = useTranslations("admin");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("VERIFIED");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await api.patch(`/api/users/${userId}/kyc`, { status });
      setMessage(t("updated"));
    } catch (err) {
      setMessage(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardShell role="ADMIN">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</h1>
      <Card className="max-w-md">
        <CardTitle>{t("kycValidationTitle")}</CardTitle>
        <CardDescription className="mb-4">{t("kycValidationDescription")}</CardDescription>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label={t("userId")} required value={userId} onChange={(e) => setUserId(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">{t("status")}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VERIFIED">{t("statusVerified")}</SelectItem>
                <SelectItem value="REJECTED">{t("statusRejected")}</SelectItem>
                <SelectItem value="PENDING">{t("statusPending")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {message && <p className="text-sm text-zinc-600 dark:text-zinc-300">{message}</p>}
          <Button type="submit" loading={submitting}>
            {t("submit")}
          </Button>
        </form>
      </Card>
    </DashboardShell>
  );
}
