"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/AuthProvider";
import { dashboardPathForRole } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2
} from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const user = await login(email, password);
      router.push(dashboardPathForRole(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
      <div className="w-full">
        {/* Carte principale adaptée aux contraintes de AuthLayout */}
        <Card className="border-zinc-200/80 dark:border-zinc-800/80 shadow-xl backdrop-blur-md bg-white/95 dark:bg-zinc-900/95">

          <CardHeader className="space-y-2 text-center pb-6 pt-8">
            {/* Badge d'en-tête */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 mb-1 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Connectez-vous à votre espace professionnel
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            {/* Alerte d'erreur */}
            {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/80 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in-50 duration-200">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <p className="flex-1 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Champ Email Conforme */}
              <div className="flex flex-col gap-2">
                <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                >
                  {t("email")}
                </Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none z-10" />
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="nom@entreprise.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50"
                  />
                </div>
              </div>

              {/* Champ Mot de Passe Conforme */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label
                      htmlFor="password"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400"
                  >
                    {t("password")}
                  </Label>
                  <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-zinc-400 pointer-events-none z-10" />
                  <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-zinc-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-zinc-950/50"
                  />

                  {/* Bouton d'affichage du mot de passe */}
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 focus:outline-none transition-colors rounded-md"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
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
                  Connexion en cours...
                </span>
                ) : (
                    <>
                      {t("submit")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                )}
              </Button>
            </form>

            {/* Redirection Inscription */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("noAccount")}{" "}
                <Link
                    href="/register"
                    className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 underline-offset-4 hover:underline transition-all"
                >
                  {t("createAccount")}
                </Link>
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
  );
}