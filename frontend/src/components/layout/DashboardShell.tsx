"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import type { Role } from "@/lib/types";
import { useCurrentUser } from "@/features/user/useCurrentUser";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { NotificationsBell } from "./NotificationsBell";
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  Users,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  Building,
  FileText,
} from "lucide-react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  ANNONCEUR: [
    { href: "/annonceur", labelKey: "annonceurOverview", icon: LayoutDashboard },
    { href: "/billboards", labelKey: "searchBillboards", icon: Building2 },
    { href: "/annonceur/orders", labelKey: "myOrders", icon: ShoppingCart },
  ],
  MEDIA_BUYER: [
    { href: "/media-buyer", labelKey: "mediaBuyerOverview", icon: LayoutDashboard },
    { href: "/billboards", labelKey: "searchBillboards", icon: Building2 },
    { href: "/media-buyer/orders", labelKey: "myOrders", icon: ShoppingCart },
  ],
  REGISSEUR: [
    { href: "/regisseur", labelKey: "regisseurOverview", icon: LayoutDashboard },
    { href: "/regisseur/billboards", labelKey: "myInventory", icon: Building },
    { href: "/regisseur/orders", labelKey: "myOrders", icon: FileText },
  ],
  ADMIN: [
    { href: "/admin", labelKey: "administration", icon: Settings },
    { href: "/admin/users", labelKey: "adminUsers", icon: Users },
    { href: "/admin/billboards", labelKey: "adminBillboards", icon: Building2 },
    { href: "/admin/orders", labelKey: "adminOrders", icon: ShoppingCart },
  ],
};

export function DashboardShell({
                                 role,
                                 children,
                               }: {
  role: Role;
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { profile } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("dashboardShell");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("roles");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{tCommon("loading")}</p>
          </div>
        </div>
    );
  }

  const navItems = NAV_ITEMS[role];

  return (
      <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
            />
        )}

        {/* Sidebar */}
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-200 bg-white/80 backdrop-blur-xl transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900/80 lg:static lg:z-auto lg:block lg:translate-x-0 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                  <Megaphone className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {tCommon("appName")}
              </span>
              </div>
              <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/25"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        }`}
                    >
                      <Icon
                          className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                              isActive ? "text-white/90" : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500"
                          }`}
                      />
                      {t(`nav.${item.labelKey}`)}
                    </Link>
                );
              })}
            </nav>

            {/* User info */}
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center gap-3 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
                <span className="text-sm font-bold">
                  {user.companyName?.charAt(0).toUpperCase() || "U"}
                </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {user.companyName}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {tRoles(user.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col lg:ml-0">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {user.companyName}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {tRoles(user.role)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <NotificationsBell />
              <LocaleSwitcher />
              <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hidden text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 sm:flex"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </Button>
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 sm:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* KYC Status Banner */}
          {profile && profile.kycStatus !== "VERIFIED" && (
              <div
                  className={`flex items-center gap-2 px-6 py-3 text-sm ${
                      profile.kycStatus === "REJECTED"
                          ? "bg-gradient-to-r from-red-50 to-red-100 text-red-800 dark:from-red-950/40 dark:to-red-900/20 dark:text-red-300"
                          : "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 dark:from-amber-950/40 dark:to-amber-900/20 dark:text-amber-300"
                  }`}
              >
                <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">
              {profile.kycStatus === "REJECTED" ? t("kycRejected") : t("kycPending")}
            </span>
              </div>
          )}

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
  );
}