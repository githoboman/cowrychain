"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useT } from "@/lib/i18n/LanguageProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { LogOut, Menu, X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useT();

  const navLinks = [
    { label: t("nav.dashboard"), href: "/" },
    { label: t("nav.vaults"), href: "/vaults" },
    { label: t("nav.save"), href: "/save" },
    { label: t("nav.achievements"), href: "/achievements" },
    { label: t("nav.roadmap"), href: "/coming-soon" },
    { label: t("nav.portfolio"), href: "/portfolio" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 premium-glass">
      {/*
        3-column grid: [logo | centered nav | actions].
        The center column is genuinely centered in the space between the two side
        columns (both 1fr), so the links never collide with a wide, wallet-connected
        actions cluster — the failure mode of the old absolute-centering approach.
      */}
      <div className="mx-auto max-w-[1600px] grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 h-16">

        {/* ── Left: logo (+ contextual back button) ── */}
        <div className="flex items-center gap-2 min-w-0">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 group-hover:scale-105 transition-all">
              <span className="text-white font-bold text-lg leading-none">🐚</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-lg tracking-tight text-foreground">
                CowryChain
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold mt-0.5">
                Base L2
              </span>
            </div>
          </Link>

          {pathname !== "/" && (
            <button
              onClick={() => router.back()}
              aria-label={t("nav.back")}
              className="hidden md:flex items-center gap-1.5 ml-1 px-2.5 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all"
            >
              <ArrowLeft size={16} />
              <span className="hidden lg:inline text-sm font-semibold">{t("nav.back")}</span>
            </button>
          )}
        </div>

        {/* ── Center: primary nav (desktop) ── */}
        <div className="hidden lg:flex items-center gap-1 bg-secondary/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "relative px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors duration-300 whitespace-nowrap",
                  isActive ? "text-black" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-xl bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ── Right: actions (right-aligned, single baseline) ── */}
        <div className="flex items-center justify-end gap-2 min-w-0">
          <LanguageToggle className="hidden md:flex" />

          <ThemeToggle />

          {address && (
            <div className="hidden xl:flex items-center gap-2 px-3 h-9 rounded-xl bg-secondary/70 border border-border/50">
              <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-primary" />
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {shortenAddress(address)}
              </span>
            </div>
          )}

          <div className="hidden sm:block w-px h-5 bg-border/60 mx-0.5" />

          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="avatar"
          />

          {isConnected && (
            <button
              onClick={() => disconnect()}
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/70 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border border-border/50 transition-all active:scale-95"
              title={t("nav.disconnectWallet")}
            >
              <LogOut size={17} />
            </button>
          )}


          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-secondary/70 text-foreground border border-border/50 hover:bg-secondary transition-colors"
          >
            {isMobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-2xl p-4 flex flex-col gap-2 lg:hidden"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "px-4 py-3 rounded-xl text-md font-bold transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="flex items-center justify-between gap-3 pt-3 mt-1 border-t border-border/50 sm:hidden">
              <span className="text-sm font-bold text-muted-foreground px-1">
                {t("nav.language")}
              </span>
              <LanguageToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
