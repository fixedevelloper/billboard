import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    Building2,
    ShieldCheck,
    MapPin,
    CheckCircle2,
    Sparkles
} from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations("common");

    return (
        <div className="relative min-h-screen w-full lg:grid lg:grid-cols-12 bg-zinc-50 dark:bg-zinc-950">

            {/* ------------------------------------------------------------------ */}
            {/* 1. PANNEAU DE GAUCHE : Showcase Marque & Confiance B2B (Desktop)    */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative hidden lg:col-span-7 lg:flex lg:flex-col lg:justify-between overflow-hidden border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900 p-10 text-white">

                {/* Image de fond avec overlay sombre */}
                <Image
                    src="/images/hero-billboard.jpg"
                    alt="AdSpace Market Infrastructure"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover object-center opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />

                {/* Effet de halo lumineux */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

                {/* A. En-tête de Marque */}
                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">
              {t("appName")}
            </span>
                    </Link>
                </div>

                {/* B. Proposition de Valeur & Témoignage B2B */}
                <div className="relative z-10 my-auto space-y-6 max-w-md">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                        <span>Marketplace OOH & DOOH N°1</span>
                    </div>

                    <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-zinc-100">
                        Digitalisez la gestion et l'achat de vos espaces publicitaires.
                    </h2>

                    {/* Liste de garanties */}
                    <ul className="space-y-3.5 text-sm text-zinc-300">
                        <li className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                            <span>Cartographie interactive et géolocalisation PostGIS</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 shrink-0 text-amber-400" />
                            <span>Validation Proof-of-Performance (P.O.P) certifiée</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 shrink-0 text-blue-400" />
                            <span>Gestion transparente des commissions et comptes tiers</span>
                        </li>
                    </ul>
                </div>

                {/* C. Pied du Panneau Gauche */}
                <div className="relative z-10 pt-6 border-t border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between">
                    <p>© {new Date().getFullYear()} {t("appName")}. Tous droits réservés.</p>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Plateforme opérationnelle
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------------------------ */}
            {/* 2. PANNEAU DE DROITE : Formulaire (Login / Register / Auth)        */}
            {/* ------------------------------------------------------------------ */}
            <div className="relative flex lg:col-span-5 flex-col justify-between min-h-screen p-6 sm:p-10">

                {/* A. Bar de navigation supérieure (Bouton retour & Logo Mobile) */}
                <div className="flex items-center justify-between w-full max-w-xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Retour au site</span>
                    </Link>

                    {/* Logo visible uniquement sur Mobile/Tablette */}
                    <Link href="/" className="lg:hidden flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Building2 className="h-4 w-4" />
                        </div>
                        <span>{t("appName")}</span>
                    </Link>
                </div>

                {/* B. Conteneur principal du formulaire (`children`) */}
                <main className="my-auto w-full max-w-md mx-auto py-8">
                    {children}
                </main>

                {/* C. Pied de page légal */}
                <footer className="w-full max-w-xl mx-auto pt-6 text-center text-xs text-zinc-500 dark:text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p>Besoin d'aide ? <a href="mailto:support@adspace.com" className="underline hover:text-zinc-800 dark:hover:text-zinc-300">Contacter le support</a></p>
                    <div className="flex items-center gap-4">
                        <Link href="/terms" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Conditions d'utilisation</Link>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Confidentialité</Link>
                    </div>
                </footer>

            </div>

        </div>
    );
}