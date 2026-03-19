import { ArrowLeft, Users, Trophy, Wallet, Link as LinkIcon, Download, Share, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSquadStore } from "@/lib/squad-store";

interface SquadDashboardProps {
  squad: {
    id: string;
    name: string;
    target: number;
    current: number;
    members: number;
    apy: string;
    asset: string;
    color: string;
  };
  onBack: () => void;
}

const MOCK_MEMBERS = [
  { address: "0x12..34", amount: 1200, isYou: true },
  { address: "0xAb..Cd", amount: 800, isYou: false },
  { address: "0x88..99", amount: 650, isYou: false },
  { address: "0x44..55", amount: 500, isYou: false },
];

export function SquadDashboard({ squad: initialSquad, onBack }: SquadDashboardProps) {
  const { squads, depositToSquad } = useSquadStore();
  
  // Find the fresh squad from the store to ensure it updates visually
  const squad = squads.find(s => s.id === initialSquad.id) || initialSquad;
  const progress = (squad.current / squad.target) * 100;

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStep, setDepositStep] = useState<"idle" | "depositing">("idle");

  const handleDeposit = async () => {
    const amt = Number(depositAmount);
    if (amt <= 0) return;
    setDepositStep("depositing");
    await new Promise(r => setTimeout(r, 1000));
    depositToSquad(squad.id, amt);
    setDepositStep("idle");
    setIsDepositOpen(false);
    setDepositAmount("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Squads
      </button>

      {/* Header Card */}
      <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] opacity-20"
          style={{ background: squad.color }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black text-white">{squad.name}</h1>
              <span className="px-3 py-1 bg-secondary rounded-full text-sm font-bold border border-border flex items-center gap-2">
                 <Trophy size={14} className="text-yellow-500" /> {squad.apy} APY
              </span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <Users size={16} /> {squad.members} Members saving together
            </p>
          </div>

          <div className="flex gap-3">
            <button className="bg-secondary text-foreground hover:bg-secondary/80 px-4 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors border border-border">
              <LinkIcon size={18} /> Invite Link
            </button>
            <button 
              onClick={() => setIsDepositOpen(true)}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Download size={18} /> Deposit {squad.asset}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 space-y-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-white">{squad.current} {squad.asset}</span>
            <span className="text-muted-foreground">{squad.target} {squad.asset}</span>
          </div>
          <div className="w-full h-4 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(progress, 100)}%`, background: squad.color }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>Currently saved</span>
            <span>{progress.toFixed(1)}% to goal</span>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-card border border-border rounded-3xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="text-yellow-500" /> Leaderboard
        </h3>
        
        <div className="space-y-4">
          {MOCK_MEMBERS.map((member, index) => (
            <div key={member.address} className={`flex items-center justify-between p-4 rounded-2xl ${member.isYou ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50 border border-border/50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-lg border border-border">
                  {index === 0 ? '👑' : index + 1}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {member.address} 
                    {member.isYou && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-md">YOU</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{member.isYou ? "Your contribution" : "Member"}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-white">{member.amount} {squad.asset}</div>
                <div className="text-xs text-[#6b9e7e]">{(member.amount / squad.current * 100).toFixed(1)}% of pool</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDepositOpen(false)} />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsDepositOpen(false)} className="absolute top-6 right-6 text-muted-foreground hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-white mb-2">Deposit to Squad</h2>
            <p className="text-muted-foreground text-sm mb-6">Contribute to the collective {squad.name} pool.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={e => setDepositAmount(e.target.value)}
                  placeholder="50.00"
                  className="w-full bg-secondary border border-border rounded-xl py-3 pl-8 pr-16 text-lg font-bold text-white focus:outline-none focus:border-primary transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">{squad.asset}</span>
              </div>
              <button
                onClick={handleDeposit}
                disabled={!depositAmount || Number(depositAmount) <= 0 || depositStep === "depositing"}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {depositStep === "depositing" ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : <>Save {squad.asset}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
