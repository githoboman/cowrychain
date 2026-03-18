"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();

  const navLinks = [
    { label: "Dashboard", href: "/" },
    { label: "Vaults", href: "/vaults" },
    { label: "Save", href: "/save" },
    { label: "Squads", href: "/squads" },
    { label: "Credit", href: "/credit" },
    { label: "Portfolio", href: "/portfolio" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 px-6 py-4 flex items-center justify-between">
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

      {/* Nav links - Only show when connected or on desktop */}
      <div className="hidden md:flex items-center gap-1 bg-secondary/50 p-1 rounded-2xl border border-border/50">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-background text-foreground shadow-sm border border-border/50" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/20"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        {address && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/80 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-primary pulse-primary" />
            <span className="text-xs font-mono font-medium text-muted-foreground">
              {shortenAddress(address)}
            </span>
          </div>
        )}
        
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="avatar"
        />

        {isConnected && (
          <button
            onClick={() => disconnect()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border border-border/50 transition-all active:scale-95"
            title="Disconnect Wallet"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </nav>
  );
}
