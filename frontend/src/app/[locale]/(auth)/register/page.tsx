"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import { dashboardPathForRole } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REGISTERABLE_ROLES: Role[] = ["ANNONCEUR", "MEDIA_BUYER", "REGISSEUR"];

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const tRoles = useTranslations("roles");
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("ANNONCEUR");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await register({ email, password, companyName, phone, role });
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardTitle className="mb-4">{t("title")}</CardTitle>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role">{t("iAm")}</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGISTERABLE_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {tRoles(r)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input label={t("company")} required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <Input label={t("email")} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input
          label={t("password")}
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" loading={submitting} className="w-full">
          {t("submit")}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-blue-600">
          {t("login")}
        </Link>
      </p>
    </Card>
  );
}
