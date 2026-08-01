"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

function MapLoadingPlaceholder() {
  const t = useTranslations("billboardsSearch");
  return (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900">
      {t("mapLoading")}
    </div>
  );
}

// Leaflet touches `window` at import time, so it must never be evaluated during SSR.
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: MapLoadingPlaceholder,
});

export default MapView;
