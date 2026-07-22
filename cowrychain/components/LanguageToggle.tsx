"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Languages } from "lucide-react";

/**
 * Compact EN/ES switch. Renders both labels so the alternative language is
 * discoverable at a glance — judges should not have to hunt for it.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={`flex items-center gap-1 rounded-xl bg-secondary/50 border border-border p-1 ${className}`}
      role="group"
      aria-label={t("nav.language")}
    >
      <Languages size={14} className="text-muted-foreground ml-1.5 shrink-0" aria-hidden="true" />
      {(["en", "es"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
            locale === code
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
