"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useCitySearch } from "@/features/cities/useCities";
import type { City } from "@/features/cities/types";
import { cn } from "@/lib/utils";

/** Search-as-you-type city picker backed by GET /api/cities (active cities only). */
export function CitySelect({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: City | null;
  onSelect: (city: City) => void;
}) {
  const t = useTranslations("citySelect");
  const tCommon = useTranslations("common");
  const [query, setQuery] = useState(value ? `${value.name} (${value.countryCode})` : "");
  const [open, setOpen] = useState(false);
  const { cities, loading } = useCitySearch(open ? query : "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(city: City) {
    onSelect(city);
    setQuery(`${city.name} (${city.countryCode})`);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <Input
        label={label}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={t("placeholder")}
        autoComplete="off"
      />
      {open && (
        <div className="absolute top-full z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
          {loading && <p className="px-3 py-2 text-sm text-zinc-500">{tCommon("loading")}</p>}
          {!loading && cities.length === 0 && <p className="px-3 py-2 text-sm text-zinc-500">{t("noResults")}</p>}
          {cities.map((city) => (
            <button
              type="button"
              key={city.id}
              onClick={() => handleSelect(city)}
              className={cn(
                "block w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                value?.id === city.id && "bg-accent text-accent-foreground",
              )}
            >
              {city.name} <span className="text-zinc-500">({city.countryCode})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
