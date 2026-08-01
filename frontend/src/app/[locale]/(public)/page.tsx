import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  MapPin,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  TrendingUp
} from "lucide-react";

const FEATURE_CONFIG = [
  { key: "map", icon: MapPin, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400" },
  { key: "booking", icon: CalendarCheck, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400" },
  { key: "payment", icon: CreditCard, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400" },
  { key: "pop", icon: ShieldCheck, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400" },
] as const;

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
      <div className="relative isolate min-h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">

        {/* SECTION HERO AVEC IMAGE LOCALE */}
        <section className="relative isolate min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-zinc-200/80 dark:border-zinc-800/80">

          {/* Image locale depuis public/images/hero-billboard.jpg */}
          <Image
              src="/images/hero-billboard.jpg"
              alt="Panneaux d'affichage publicitaires AdSpace Market"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-55 dark:opacity-30"
          />

          {/* Overlay de gradient pour préserver la lisibilité */}
          <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-zinc-50/90 via-zinc-50/80 to-zinc-50 dark:from-zinc-950/90 dark:via-zinc-950/85 dark:to-zinc-950"
          />

          {/* Halo lumineux */}
          <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none"
          >
            <div
                style={{
                  clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-indigo-500 opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>

          {/* Contenu du Hero */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8 flex flex-col items-center text-center gap-8">

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-md dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t("badge")}</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl lg:text-7xl lg:leading-[1.1]">
              {t("title")}
            </h1>

            <p className="max-w-2xl text-lg text-zinc-700 dark:text-zinc-300 sm:text-xl leading-relaxed font-medium">
              {t("subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base font-semibold shadow-xl shadow-blue-500/25 transition-all hover:shadow-blue-500/35 hover:scale-[1.02]">
                  {t("createAccount")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/billboards" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-semibold border-zinc-300 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  {t("exploreBillboards")}
                </Button>
              </Link>
            </div>

            {/* Statistiques */}
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-zinc-300/60 dark:border-zinc-800/80 pt-8 sm:grid-cols-3 lg:gap-12 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                  <Building2 className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">+10 000</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Panneaux référencés</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">100% Vérifié</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Preuves de pose P.O.P</p>
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Multi-Pays</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Couverture régionale</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION FONCTIONNALITÉS */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-24 px-6 py-20 lg:px-8">
          <section className="flex flex-col gap-10">
            <div className="text-center flex flex-col items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                Une plateforme tout-en-un pour l'affichage OOH & DOOH
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 max-w-xl text-sm sm:text-base">
                Simplifiez chaque étape de vos campagnes publicitaires, du repérage géographique jusqu'à la validation sur le terrain.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURE_CONFIG.map(({ key, icon: Icon, color }) => (
                  <Card
                      key={key}
                      className="group relative border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 dark:bg-zinc-900/50"
                  >
                    <CardHeader className="flex flex-col gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {t(`features.${key}.title`)}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                          {t(`features.${key}.description`)}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
              ))}
            </div>
          </section>

          {/* Banner CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-12 dark:bg-zinc-900 text-white sm:px-12 sm:py-16 shadow-2xl">
            <div className="relative z-10 flex flex-col items-start gap-6 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-50">
                Prêt à digitaliser vos campagnes publicitaires ?
              </h2>
              <p className="text-zinc-300 text-base">
                Rejoignez les annonceurs, régisseurs et media buyers qui optimisent déjà leurs investissements d'affichage.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100 font-semibold gap-2">
                  Démarrer maintenant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          </section>
        </div>

      </div>
  );
}