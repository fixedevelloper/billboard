import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const FEATURE_KEYS = ["map", "booking", "payment", "pop"] as const;

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-6 py-16">
      <section className="flex flex-col items-start gap-6">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          {t("badge")}
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>
        <div className="flex gap-3">
          <Link href="/register">
            <Button size="lg">{t("createAccount")}</Button>
          </Link>
          <Link href="/billboards">
            <Button size="lg" variant="outline">
              {t("exploreBillboards")}
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_KEYS.map((key) => (
          <Card key={key}>
            <CardTitle>{t(`features.${key}.title`)}</CardTitle>
            <CardDescription className="mt-2">{t(`features.${key}.description`)}</CardDescription>
          </Card>
        ))}
      </section>
    </div>
  );
}
