"use client";

import { Navbar } from "./Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowRight, Shield, Zap, TrendingUp, Globe, Smartphone, PiggyBank, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useTotalTvl, useVaults } from "@yo-protocol/react";
import { formatUnits } from "viem";
import { formatAmount, formatCompactAmount } from "@/lib/utils";
import { useT } from "@/lib/i18n/LanguageProvider";
import { IS_GASLESS_ENABLED } from "@/lib/constants";
import { YieldCalculatorWidget } from "./YieldCalculatorWidget";

export function LandingPage() {
  const { tvl } = useTotalTvl();
  const { vaults } = useVaults();
  const t = useT();

  const protocolTvl = (tvl as any)?.totalTvl ?? 0n;
  const activeVaults = vaults?.length ?? 0;

  const features = [
    {
      icon: <Zap className="text-primary" />,
      // Only promise gasless when a paymaster is actually funded and configured.
      // Otherwise users pay their own (very small) Base gas, and the copy says so.
      title: IS_GASLESS_ENABLED
        ? t("landing.features.gasless.title")
        : t("landing.features.gasless.titleSelfPay"),
      description: IS_GASLESS_ENABLED
        ? t("landing.features.gasless.desc")
        : t("landing.features.gasless.descSelfPay")
    },
    {
      icon: <Shield className="text-primary" />,
      title: t("landing.features.gamified.title"),
      description: t("landing.features.gamified.desc")
    },
    {
      icon: <TrendingUp className="text-primary" />,
      title: t("landing.features.zapping.title"),
      description: t("landing.features.zapping.desc")
    }
  ];

  const journeyItems = [
    {
      title: t("landing.journey.gamification.title"),
      desc: t("landing.journey.gamification.desc"),
      tag: t("landing.journey.gamification.tag")
    },
    {
      title: t("landing.journey.gas.title"),
      desc: t("landing.journey.gas.desc"),
      tag: t("landing.journey.gas.tag")
    },
    {
      title: t("landing.journey.zapping.title"),
      desc: t("landing.journey.zapping.desc"),
      tag: t("landing.journey.zapping.tag")
    },
    {
      title: t("landing.journey.telemetry.title"),
      desc: t("landing.journey.telemetry.desc"),
      tag: t("landing.journey.telemetry.tag")
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-10 lg:px-20 overflow-hidden">
        {/* Background glow items */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 opacity-30" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/4 opacity-20" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t("landing.badge")}
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              {t("landing.headline.line1")} <br />
              {t("landing.headline.line2")}{" "}
              <span className="text-gradient">
                {t("landing.headline.highlight")}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              {t("landing.subheadline")}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full sm:w-auto px-8 py-5 rounded-2xl font-bold bg-primary text-white shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] transition-all flex items-center justify-center gap-2 text-lg"
                  >
                    {t("landing.cta.startSaving")} <ArrowRight size={20} />
                  </button>
                )}
              </ConnectButton.Custom>
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Globe size={18} />
                <span>{t("landing.savers", { amount: formatCompactAmount(protocolTvl, 6) })}</span>
              </div>
            </div>
          </motion.div>

          {/* Visual / Interactive Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
            style={{ perspective: 1000 }}
            className="relative z-10"
          >
            <YieldCalculatorWidget defaultApy={18.5} />
            
            {/* Floating badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 premium-glass px-5 py-3 rounded-2xl flex items-center gap-3 z-20"
            >
              <RefreshCcw className="text-primary animate-spin-slow" />
              <div className="text-xs">
                <p className="font-bold">{t("landing.card.autoCompounding")}</p>
                <p className="text-muted-foreground">{t("landing.card.everyBlock")}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">{t("landing.features.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t("landing.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] glass-card group hover:border-primary/50 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Showcase - Explaining "What we did" */}
      <section className="py-24 px-6 border-y border-border/50 bg-secondary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">{t("landing.journey.title")}</h2>
              <p className="text-muted-foreground text-lg">
                {t("landing.journey.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-xs font-bold uppercase tracking-widest text-primary">
              <Smartphone size={14} />
              {t("landing.journey.version")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeyItems.map((item, i) => (
              <div key={i} className="p-6 rounded-[2.5rem] bg-background border border-border/60 hover:border-primary/40 transition-all group">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 px-2 py-1 rounded-lg bg-primary/5 inline-block">
                  {item.tag}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust area - Infinite Marquee */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="flex animate-marquee gap-24 w-max opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {[1, 2].map((idx) => (
            <div key={idx} className="flex items-center gap-24">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-600" />
                 <span className="font-bold text-2xl tracking-tighter">BASE</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                 <span className="font-bold text-2xl tracking-tighter uppercase text-emerald-400">YO Protocol</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-orange-500" />
                 <span className="font-bold text-2xl tracking-tighter">UNISWAP</span>
               </div>
               <div className="flex items-center gap-2 text-2xl font-black">
                 <span>AERODROME</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-purple-600" />
                 <span className="font-bold text-2xl tracking-tighter">INITIA</span>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto rounded-[48px] bg-primary p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 relative">{t("landing.finalCta.title")}</h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto relative">
            {t("landing.finalCta.subtitle")}
          </p>
          <div className="flex justify-center relative">
            <ConnectButton.Custom>
               {({ openConnectModal }) => (
                 <button 
                  onClick={openConnectModal}
                  className="px-10 py-5 rounded-2xl bg-white text-primary font-bold text-xl hover:scale-[1.05] transition-all shadow-xl"
                 >
                   {t("landing.cta.connectWallet")}
                 </button>
               )}
            </ConnectButton.Custom>
          </div>
        </div>
      </section>
    </div>
  );
}
