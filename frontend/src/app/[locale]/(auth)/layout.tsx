import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 block text-center text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("appName")}
        </Link>
        {children}
      </div>
    </div>
  );
}
