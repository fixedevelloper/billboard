"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface NavItem {
  href: string;
  labelKey: string;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  ANNONCEUR: [
    { href: "/annonceur", labelKey: "annonceurOverview" },
    { href: "/billboards", labelKey: "searchBillboards" },
  ],
  MEDIA_BUYER: [{ href: "/media-buyer", labelKey: "delegatedCampaigns" }],
  REGISSEUR: [{ href: "/regisseur", labelKey: "myInventory" }],
  ADMIN: [{ href: "/admin", labelKey: "administration" }],
};

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("dashboardShell");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("roles");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace("/login");
    }
  }, [loading, user, role, router]);

  if (loading || !user || user.role !== role) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        {tCommon("loading")}
      </div>
    );
  }

  const navItems = NAV_ITEMS[role];

  return (
    <div className="flex flex-1">
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950 sm:block">
        <p className="mb-6 px-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{tCommon("appName")}</p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              {t(`nav.${item.labelKey}`)}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.companyName}</p>
            <p className="text-xs text-zinc-500">{tRoles(user.role)}</p>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Button variant="outline" size="sm" onClick={logout}>
              {t("logout")}
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
