"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    ArrowLeft,
    Building2,
    UserCheck,
    Mail,
    Phone,
    Info,
    Send,
    CheckCircle2,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { delegateOrder } from "@/features/booking/useOrders";
import { extractErrorMessage } from "@/lib/api";

export default function DelegateOrderPage() {
    const t = useTranslations("orders");
    const params = useParams();
    const router = useRouter();

    const orderId = params.id as string;

    // États pour Tab 1 (Agence existante)
    const [mediaBuyerId, setMediaBuyerId] = useState("");

    // États pour Tab 2 (Nouvelle agence)
    const [agencyName, setAgencyName] = useState("");
    const [agencyEmail, setAgencyEmail] = useState("");
    const [agencyPhone, setAgencyPhone] = useState("");

    // États globaux UI
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Soumission Onglet 1 : Agence existante
    async function handleExistingAgencySubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!mediaBuyerId.trim()) return;

        setLoading(true);
        setError(null);
        try {
            await delegateOrder(orderId, mediaBuyerId.trim());
            setSuccessMessage("La commande a été déléguée avec succès à l'agence.");
            setTimeout(() => {
                router.push("/orders");
            }, 2000);
        } catch (err) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    // Soumission Onglet 2 : Invitation Nouvelle Agence
    async function handleNewAgencySubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!agencyName.trim() || !agencyEmail.trim() || !agencyPhone.trim()) return;

        setLoading(true);
        setError(null);

        try {
            // TODO: Appeler votre endpoint API d'invitation (ex: inviteAgencyAndDelegate({ orderId, agencyName, agencyEmail, agencyPhone }))
            // Simulation pour le moment :
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSuccessMessage(
                "Demande transmise avec succès ! Nos équipes vont contacter l'agence pour finaliser l'achat."
            );
            setTimeout(() => {
                router.push("/orders");
            }, 2500);
        } catch (err) {
            setError(extractErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
            {/* BOUTON RETOUR */}
            <div>
                <Button variant="ghost" size="sm" asChild className="-ml-2 gap-2 text-zinc-600 dark:text-zinc-400">
                    <Link href="/orders">
                        <ArrowLeft className="h-4 w-4" />
                        Retour aux commandes
                    </Link>
                </Button>
            </div>

            {/* TITRE & INTRODUCTION */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                    Déléguer le paiement de la commande
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Commande <span className="font-mono font-medium text-zinc-700 dark:text-zinc-300">#{orderId.slice(0, 8)}</span>
                </p>
            </div>

            {/* MESSAGES D'ALLERTE / SUCCÈS */}
            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="font-medium">{successMessage}</p>
                </div>
            )}

            {/* CARTE PRINCIPALE AVEC TABS */}
            <Card className="border-zinc-200 shadow-sm dark:border-zinc-800">
                <Tabs defaultValue="existing" className="w-full">
                    <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 pb-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="existing" className="gap-2">
                                <UserCheck className="h-4 w-4" />
                                Agence Partenaire
                            </TabsTrigger>
                            <TabsTrigger value="new" className="gap-2">
                                <Building2 className="h-4 w-4" />
                                Nouvelle Agence
                            </TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent className="p-6">
                        {/* ONGLET 1 : AGENCE EXISTANTE */}
                        <TabsContent value="existing" className="mt-0 space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    Transférer à un Media Buyer inscrit
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Si votre agence ou Media Buyer possède déjà un compte sur la plateforme, saisissez son identifiant unique.
                                </p>
                            </div>

                            <form onSubmit={handleExistingAgencySubmit} className="space-y-4 pt-2">
                                <div className="space-y-1.5">
                                    <Input
                                        label="Identifiant Media Buyer (ID)"
                                        value={mediaBuyerId}
                                        onChange={(e) => setMediaBuyerId(e.target.value)}
                                        placeholder="ex: usr_89f2a41b-..."
                                        required
                                        className="w-full font-mono text-sm"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!mediaBuyerId.trim() || loading}
                                    loading={loading}
                                    className="w-full gap-2 shadow-sm"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Confirmer la délégation
                                </Button>
                            </form>
                        </TabsContent>

                        {/* ONGLET 2 : NOUVELLE AGENCE */}
                        <TabsContent value="new" className="mt-0 space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                    Proposer une nouvelle agence
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Votre agence n'est pas encore enregistrée ? Renseignez ses coordonnées ci-dessous.
                                </p>
                            </div>

                            {/* NOTICE INFORMATIVE */}
                            <div className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                <div className="space-y-1 text-xs text-amber-800 dark:text-amber-300">
                                    <p className="font-semibold">Procédure de prise en charge</p>
                                    <p className="leading-relaxed">
                                        Dès la soumission de ce formulaire, notre équipe support prendra directement contact avec cette agence pour valider son compte et finaliser le règlement de cette commande.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleNewAgencySubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Input
                                        label="Nom de l'agence / Société"
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
                                        placeholder="ex: Havas Media, Publicis..."
                                        required
                                    />
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <Input
                                            type="email"
                                            label="Adresse Email de contact"
                                            value={agencyEmail}
                                            onChange={(e) => setAgencyEmail(e.target.value)}
                                            placeholder="contact@agence.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Input
                                            type="tel"
                                            label="Numéro de téléphone"
                                            value={agencyPhone}
                                            onChange={(e) => setAgencyPhone(e.target.value)}
                                            placeholder="+237 6XX XX XX XX"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={!agencyName.trim() || !agencyEmail.trim() || !agencyPhone.trim() || loading}
                                    loading={loading}
                                    className="w-full gap-2 shadow-sm"
                                >
                                    <Send className="h-4 w-4" />
                                    Envoyer la demande de délégation
                                </Button>
                            </form>
                        </TabsContent>
                    </CardContent>
            </Card>
        </Card>
</div>
);
}