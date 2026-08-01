"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import { dashboardPathForRole } from "@/lib/roles";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  UserPlus,
  Loader2,
  Megaphone,
  Briefcase,
  MonitorPlay,
  Check
} from "lucide-react";

const REGISTERABLE_ROLES: Role[] = ["ANNONCEUR", "MEDIA_BUYER", "REGISSEUR"];

// Configuration visuelle et explicative pour chaque profil B2B
const ROLE_CONFIG: Record<Role, { icon: typeof Megaphone; description: string }> = {
  ANNONCEUR: {
    icon: Megaphone,
    description: "Réservez et gérez vos campagnes d'affichage OOH/DOOH"
  },
  MEDIA_BUYER: {
    icon: Briefcase,
    description: "Achetez en volume et gérez des mandats d'annonceurs"
  },
  REGISSEUR: {
    icon: MonitorPlay,
    description: "Monétisez et gérez votre parc de panneaux publicitaires"
  },
  ADMIN: {
    icon: Building2,
    description: "Administration système"
  }
};

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
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="relative flex min-h-[85vh] w-full items-center justify-center p-2 sm:p-4">
        {/* 1. Halo lumineux en arrière-plan (Glow Effect) */}
        <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none"
        >
          <div className="h-[450px] w-[550px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-emerald-500/10 blur-3xl opacity-60 dark:opacity-30" />
        </div>

        <div className="w-full max-w-lg">
          {/* 2. Carte principale en verre dépoli (Glassmorphism) */}
          <Card className="border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl backdrop-blur-md bg-white/95 dark:bg-zinc-900/95">

            <CardHeader className="space-y-2 text-center pb-6 pt-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 mb-1 shadow-sm">
                <UserPlus className="h-6 w-6" />
              </div>

              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                Créez votre compte professionnel en quelques clics
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              {/* Banner d'erreur stylisé */}
              {error && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in-50 duration-200">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                    <p className="flex-1 font-medium">{error}</p>
                  </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* 3. Sélection ergonomique du rôle sous forme de cartes d'option */}
                <div className="flex flex-col gap-2.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    {t("iAm")}
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {REGISTERABLE_ROLES.map((r) => {
                      const RoleIcon = ROLE_CONFIG[r].icon;
                      const isSelected = role === r;
                      return (
                          <button
                              key={r}
                              type="button"
                              onClick={() => setRole(r)}
                              className={`relative flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition-all duration-200 focus:outline-none ${
                                  isSelected
                                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-600/20 shadow-sm"
                                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/50"
                              }`}
                          >
                            {isSelected && (
                                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                            )}
                            <RoleIcon className={`h-5 w-5 mb-2 ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`} />
                            <span className="text-xs font-bold leading-tight">
                          {tRoles(r)}
                        </span>
                          </button>
                      );
                    })}
                  </div>
                  {/* Description contextuelle du rôle actif */}
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 italic">
                    * {ROLE_CONFIG[role].description}
                  </p>
                </div>

                {/* Champ Nom de l'Entreprise */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    {t("company")}
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                        required
                        placeholder="Nom de votre structure ou régie"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 h-11 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50"
                    />
                  </div>
                </div>

                {/* Ligne Téléphone & Email sur 2 colonnes en Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Champ Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      {t("email")}
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                          type="email"
                          required
                          placeholder="nom@entreprise.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Champ Téléphone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      {t("phone")}
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                          type="tel"
                          placeholder="+237 6XX XX XX XX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 h-11 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Champ Mot de Passe */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    {t("password")}
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        placeholder="Minimum 8 caractères"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors"
                        aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 text-base font-semibold gap-2 mt-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.01]"
                >
                  {submitting ? (
                      <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    Création du compte...
                  </span>
                  ) : (
                      <>
                        {t("submit")}
                        <ArrowRight className="h-4 w-4" />
                      </>
                  )}
                </Button>
              </form>

              {/* Pied de carte avec lien de redirection vers la connexion */}
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t("hasAccount")}{" "}
                  <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline transition-all"
                  >
                    {t("login")}
                  </Link>
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
  );
}