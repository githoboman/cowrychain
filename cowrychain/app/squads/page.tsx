"use client";

import { Users, Plus, Target, Trophy, Flame } from "lucide-react";
import { useState } from "react";
import { CreateSquadModal } from "@/components/modals/CreateSquadModal";
import { SquadDashboard } from "@/components/SquadDashboard";

import { useSquadStore } from "@/lib/squad-store";

export default function SquadsPage() {
  const { squads } = useSquadStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState<any | null>(null);

  if (selectedSquad) {
    return (
      <SquadDashboard 
        squad={selectedSquad} 
        onBack={() => setSelectedSquad(null)} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Users size={20} />
            <h2 className="font-semibold uppercase tracking-wider text-sm">Multiplayer DeFi</h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Squad <span className="text-primary">Savings</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Pool funds with friends, family, or your DAO. Hit collective goals faster while earning optimized APY together.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-primary text-primary-foreground flex items-center gap-2 px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Create a Squad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {squads.map(squad => {
          const progress = (squad.current / squad.target) * 100;
          return (
            <div 
              key={squad.id}
              onClick={() => setSelectedSquad(squad)}
              className="bg-card w-full border border-border rounded-3xl p-6 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              {/* Background Accent */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ background: squad.color }}
              />

              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary rounded-xl text-primary">
                  <Target size={24} />
                </div>
                <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                  <Flame size={14} className="text-orange-500" />
                  {squad.apy} APY
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                {squad.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Users size={14} /> {squad.members} Members
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-foreground">{squad.current} {squad.asset}</span>
                  <span className="text-muted-foreground">{squad.target} {squad.asset}</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary relative"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isCreateOpen && (
        <CreateSquadModal onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
}
