"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Languages, X } from "lucide-react";

const HINT_DISMISSED_KEY = "cowrychain-lang-hint-dismissed";

/**
 * Compact EN/ES switch. Renders both labels so the alternative language is
 * discoverable at a glance — judges should not have to hunt for it.
 *
 * On first visit it also shows a one-time popup pointing at the control, so users
 * who land on the (currently Spanish) default know they can switch. The popup is
 * bilingual by design: whichever language the visitor reads, the flags + labels
 * make it unmistakable. Dismissal is remembered in localStorage.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.localStorage.getItem(HINT_DISMISSED_KEY) === "1") return;
    // Small delay so the popup reads as a gentle nudge after the page settles,
    // rather than flashing during load.
    const timer = setTimeout(() => setShowHint(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    window.localStorage.setItem(HINT_DISMISSED_KEY, "1");
  };

  // Dismiss when clicking outside the control.
  useEffect(() => {
    if (!showHint) return;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dismissHint();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showHint]);

  const handleSelect = (code: "en" | "es") => {
    setLocale(code);
    if (showHint) dismissHint();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className="flex items-center gap-1 rounded-xl bg-secondary/50 border border-border p-1"
        role="group"
        aria-label={t("nav.language")}
      >
        <Languages size={14} className="text-muted-foreground ml-1.5 shrink-0" aria-hidden="true" />
        {(["en", "es"] as const).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => handleSelect(code)}
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

      <AnimatePresence>
        {showHint && (
          <motion.div
            role="dialog"
            aria-label={t("nav.language.hintTitle")}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute right-0 top-full mt-2 w-64 z-[60] rounded-2xl border border-primary/30 bg-card shadow-2xl shadow-black/40 p-3.5"
          >
            {/* Pointer arrow toward the button */}
            <div className="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-primary/30 bg-card" />

            <button
              type="button"
              onClick={dismissHint}
              aria-label={t("nav.language.hintDismiss")}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base leading-none" aria-hidden="true">🇬🇧🇪🇸</span>
              <p className="font-bold text-sm text-foreground">{t("nav.language.hintTitle")}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              {t("nav.language.hintBody")}
            </p>
            <button
              type="button"
              onClick={dismissHint}
              className="w-full py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
            >
              {t("nav.language.hintDismiss")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
