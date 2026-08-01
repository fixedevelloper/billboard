"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import { Button } from "@/components/ui/button";
import { dashboardPathForRole } from "@/lib/roles";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function PublicHeader() {
  const { user } = useAuth();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {tCommon("appName")}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <Link href="/billboards" className="hover:text-zinc-900 dark:hover:text-zinc-50">
            {t("billboards")}
          </Link>
          {user ? (
            <Link href={dashboardPathForRole(user.role)}>
              <Button size="sm">{t("mySpace")}</Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                {t("login")}
              </Link>
              <Link href="/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </>
          )}
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
