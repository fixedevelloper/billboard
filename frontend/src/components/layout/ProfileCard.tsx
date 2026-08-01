"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useCurrentUser } from "@/features/user/useCurrentUser";
import type { KycStatus } from "@/lib/types";

const KYC_TONE: Record<KycStatus, "success" | "warning" | "danger"> = {
  VERIFIED: "success",
  PENDING: "warning",
  REJECTED: "danger",
};

export function ProfileCard() {
  const t = useTranslations("profile");
  const tRoles = useTranslations("roles");
  const { profile, loading } = useCurrentUser();

  if (loading || !profile) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{profile.companyName}</CardTitle>
          <CardDescription>{tRoles(profile.role)}</CardDescription>
        </div>
        <Badge tone={KYC_TONE[profile.kycStatus]}>{t(`kycStatus.${profile.kycStatus}`)}</Badge>
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">{t("email")}</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{profile.email}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{t("phone")}</dt>
          <dd className="text-zinc-900 dark:text-zinc-50">{profile.phone || "—"}</dd>
        </div>
      </dl>
    </Card>
  );
}
