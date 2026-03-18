// @ts-nocheck
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PiggyBank,
  BarChart3,
  Settings,
  Layers,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/save", label: "Save", icon: PiggyBank },
  { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
  { href: "/vaults", label: "Vaults", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-[#1e2920] bg-[#0a0f0d]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">🐚</span>
          </div>
          <span className="font-bold text-lg text-white">
            Cowry<span className="gradient-text">Chain</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "nav-item flex items-center gap-2 px-3 py-2 text-sm font-medium",
                  isActive ? "active text-green-400" : "text-gray-400 hover:text-gray-200"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet */}
        <div className="flex items-center gap-3">
          {isConnected && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Live on Base</span>
            </div>
          )}
          <ConnectButton
            label="Connect Wallet"
            showBalance={false}
            chainStatus="icon"
          />
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden flex border-t border-[#1e2920]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
                isActive ? "text-green-400" : "text-gray-500"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
