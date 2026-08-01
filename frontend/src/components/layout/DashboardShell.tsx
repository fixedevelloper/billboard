"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Monitor,
  ShieldCheck,
  Users,
  MapPin,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Building2,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
}

// Configuration des éléments de navigation avec icônes associées
const NAV_ITEMS: Record<Role, NavItem[]> = {
  ANNONCEUR: [
    { href: "/annonceur", labelKey: "annonceurOverview", icon: LayoutDashboard },
    { href: "/billboards", labelKey: "searchBillboards", icon: Search },
  ],
  MEDIA_BUYER: [
    { href: "/media-buyer", labelKey: "delegatedCampaigns", icon: Briefcase },
  ],
  REGISSEUR: [
    { href: "/regisseur", labelKey: "myInventory", icon: Monitor },
  ],
  ADMIN: [
    { href: "/admin", labelKey: "administration", icon: ShieldCheck },
    { href: "/admin/users", labelKey: "adminUsers", icon: Users },
    { href: "/admin/billboards", labelKey: "adminBillboards", icon: MapPin },
    { href: "/admin/orders", labelKey: "adminOrders", icon: ShoppingBag },
  ],
};

// Couleurs de badges par rôle
const ROLE_BADGE_STYLES: Record<Role, string> = {
  ANNONCEUR: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-900",
  MEDIA_BUYER: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-900",
  REGISSEUR: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900",
  ADMIN: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900",
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

  // État du menu mobile (sidebar slide-over)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Contrôle des accès
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== role) {
      router.replace("/login");
    }
  }, [loading, user, role, router]);

  // Écran de chargement élégant
  if (loading || !user || user.role !== role) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 animate-pulse">
            {tCommon("loading")}
          </p>
        </div>
    );
  }

  const navItems = NAV_ITEMS[role] || [];
  const companyInitials = user.companyName ? user.companyName.substring(0, 2).toUpperCase() : "CS";

  return (
      <div className="flex min-h-screen w-full bg-zinc-100/60 dark:bg-zinc-950">

        {/* 1. OVERLAY MOBILE POUR FERMER LE MENU */}
        {mobileMenuOpen && (
            <div
                className="fixed inset-0 z-40 bg-zinc-900/60 backdrop-blur-sm lg:hidden transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
            />
        )}

        {/* 2. SIDEBAR (DESKTOP ET MOBILE SLIDE-OVER) */}
        <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-zinc-200/80 bg-white shadow-xl transition-transform duration-300 ease-in-out dark:border-zinc-800/80 dark:bg-zinc-900 lg:static lg:w-64 lg:shadow-none lg:translate-x-0 ${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* En-tête Sidebar avec Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 dark:border-zinc-800/60">
            <Link href="/" className="flex items-center gap-2.5 font-extrabold text-zinc-900 dark:text-zinc-50 text-lg tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>{tCommon("appName")}</span>
            </Link>
            <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Section Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Menu principal
            </p>
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                            isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500"}`} />
                        <span>{t(`nav.${item.labelKey}`)}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 text-white/80" />}
                    </Link>
                );
              })}
            </nav>
          </div>

          {/* Pied de Sidebar (Informations Utilisateur) */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                {companyInitials}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {user.companyName}
                </p>
                <span className={`mt-0.5 inline-self-start text-[10px] font-semibold border rounded-full px-2 py-0.2 ${ROLE_BADGE_STYLES[user.role]}`}>
                {tRoles(user.role)}
              </span>
              </div>
            </div>
          </div>
        </aside>

        {/* 3. CONTENU PRINCIPAL (HEADER + MAIN) */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* Header Supérieur */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white/80 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/80">

            {/* Bouton Burger Mobile + Titre contextuel */}
            <div className="flex items-center gap-3">
              <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
                  aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-sm text-zinc-500">
                <Building2 className="h-4 w-4 text-zinc-400" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{user.companyName}</span>
              </div>
            </div>

            {/* Actions Droite (Sélecteur de langue + Déconnexion) */}
            <div className="flex items-center gap-3">
              <LocaleSwitcher />

              <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="h-9 gap-2 text-xs font-medium text-zinc-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 dark:text-zinc-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:border-red-900 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </Button>
            </div>
          </header>

          {/* Zone de contenu principale avec défilement fluide */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>

      </div>
  );
}