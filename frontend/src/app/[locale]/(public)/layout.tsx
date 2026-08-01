import { useTranslations } from "next-intl";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <PublicHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} {tCommon("appName")} — {t("tagline")}
      </footer>
    </div>
  );
}
