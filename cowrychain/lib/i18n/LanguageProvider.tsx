"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { en } from "./en";
import { es } from "./es";

export type Locale = "en" | "es";

const DICTIONARIES = { en, es } as const;

/** Translation keys are derived from the English dictionary, so a missing Spanish key is a type error. */
export type TranslationKey = keyof typeof en;

const STORAGE_KEY = "cowrychain-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Translate a key, optionally interpolating {placeholders}. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start at "en" so the server and first client render agree; the stored
  // preference is applied in an effect to avoid a hydration mismatch.
  // TEMPORARY: Spanish is forced as the default for everyone on first load, for the
  // Uruguay (ETH Uruguay) audience. To restore normal behaviour later:
  //   1. change this initial value back to "en"
  //   2. re-enable the stored-preference restore in the effect below.
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    // TEMPORARY: intentionally NOT restoring the saved preference so that even
    // visitors who previously chose "en" see Spanish first for now. The manual
    // toggle still works for the current session. Re-enable this block to honour
    // the visitor's saved choice again:
    // const stored = window.localStorage.getItem(STORAGE_KEY);
    // if (stored === "en" || stored === "es") {
    //   setLocaleState(stored);
    // }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => {
      const next = current === "en" ? "es" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      const dict = DICTIONARIES[locale] as Record<string, string>;
      // Fall back to English rather than rendering a raw key at demo time.
      return interpolate(dict[key] ?? en[key] ?? key, vars);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return ctx;
}

/** Convenience hook for components that only need the translate function. */
export function useT() {
  return useLanguage().t;
}
