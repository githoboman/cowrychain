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
    <nav className="fixed top-0 left-0 right-0 z-50 premium-glass px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-[1.02]">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
          <span className="text-white font-bold text-xl">🐚</span>
        </div>
        <div className="hidden sm:block">
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            CowryChain
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
              Base L2
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {/* Dynamic Back Button */}
        {pathname !== "/" && (
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline text-sm font-bold">{t("nav.back")}</span>
          </button>
        )}
      </div>

      {/* Desktop Nav links */}
      <div className="hidden lg:flex items-center gap-2 bg-secondary/30 p-1.5 rounded-[20px] border border-white/5 absolute left-1/2 -translate-x-1/2 backdrop-blur-xl">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "relative px-4 py-2 rounded-2xl text-sm font-semibold transition-colors duration-300",
                isActive 
                  ? "text-black" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 rounded-2xl bg-primary shadow-[0_0_15px_rgba(0,255,148,0.4)]"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <LanguageToggle className="hidden sm:flex" />

        <ThemeToggle />

        {address && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-primary pulse-primary" />
            <span className="text-xs font-mono font-medium text-muted-foreground">
              {shortenAddress(address)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-border/50" />
        
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />

        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border border-border/50 transition-all active:scale-95"
            title={t("nav.disconnectWallet")}
          >
            <LogOut size={18} />
          </button>
        )}


        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-secondary text-foreground border border-border/50 hover:bg-secondary/80 transition-colors"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[73px] left-0 right-0 bg-card border-b border-border shadow-2xl p-4 flex flex-col gap-2 lg:hidden"
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
