import { ArrowLeft, Users, Trophy, Wallet, Link as LinkIcon, Download, Share, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSquadStore } from "@/lib/squad-store";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { parseAbi, erc20Abi } from "viem";
import { VAULTS } from "@yo-protocol/core";
import { parseAmount } from "@/lib/utils";
import { USDC_ADDRESS_BASE, WETH_ADDRESS_BASE } from "@/lib/constants";

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

// Random deterministic string generator based on Seed
const generateAddress = (seed: number) => {
  const chars = "0123456789abcdef";
  let addr = "0x";
  for (let i = 0; i < 4; i++) addr += chars[(seed * i * 31) % 16];
  addr += "..";
  for (let i = 0; i < 4; i++) addr += chars[(seed * i * 73) % 16];
  return addr;
};

export function SquadDashboard({ squad: initialSquad, onBack }: SquadDashboardProps) {
  const { squads, depositToSquad } = useSquadStore();
  
  // Find the fresh squad from the store to ensure it updates visually
  const squad = squads.find(s => s.id === initialSquad.id) || initialSquad;
  const progress = (squad.current / squad.target) * 100;

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositStep, setDepositStep] = useState<"idle" | "depositing">("idle");

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const isUSDC = squad.asset === "USDC";
  const assetAddress = isUSDC ? USDC_ADDRESS_BASE : WETH_ADDRESS_BASE;
  const assetDecimals = isUSDC ? 6 : 18;
  const vaultAddress = isUSDC ? (VAULTS as any)["yoUSD"]?.address : (VAULTS as any)["yoETH"]?.address;

  const { data: allowance } = useReadContract({
    address: assetAddress,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, vaultAddress] : undefined,
    query: { enabled: !!address && !!vaultAddress }
  });

  const paymasterCapabilities = {
    paymasterService: {
      url: process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://api.developer.coinbase.com/rpc/v1/base/YOUR_API_KEY",
    }
  };

  const handleDeposit = async () => {
    const amt = Number(depositAmount);
    if (amt <= 0 || !address || !vaultAddress) return;
    
    try {
      setDepositStep("depositing");
      const parsedAmount = parseAmount(depositAmount, assetDecimals);

      // Execute Real Wagmi Transaction (Approval)
      if ((allowance ?? 0n) < parsedAmount) {
        await writeContractAsync({
          address: assetAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [vaultAddress, parsedAmount],
          capabilities: paymasterCapabilities
        } as any);
        await new Promise(r => setTimeout(r, 2000));
      }

      // Execute Real Wagmi Transaction (Deposit to YO Protocol)
      await writeContractAsync({
        address: vaultAddress as `0x${string}`,
        abi: parseAbi(["function deposit(uint256 assets, address receiver) returns (uint256)"]),
        functionName: "deposit",
        args: [parsedAmount, address],
        capabilities: paymasterCapabilities
      } as any);

      depositToSquad(squad.id, amt);
      setDepositStep("idle");
      setIsDepositOpen(false);
      setDepositAmount("");
    } catch (err) {
      console.error(err);
      setDepositStep("idle");
    }
  };

  // Dynamically partition the squad's current balance across the `members` count
  // Your share is roughly determined dynamically (e.g. 60% of pool or exactly input amount ideally)
  const remainingForOthers = Math.max(0, squad.current * 0.4);
  const generatorSeed = squad.name.charCodeAt(0) + squad.id.length;

  const dynamicMembers = Array.from({ length: squad.members }).map((_, i) => {
    if (i === 0) return { 
      address: address ? `${address.slice(0, 6)}..${address.slice(-4)}` : "0xYou..", 
      amount: squad.current === 0 ? 0 : squad.current - remainingForOthers, 
      isYou: true 
    };
    
    // Distribute remaining evenlyish among fake members
    const fakeFraction = remainingForOthers / (squad.members - 1);
    return {
      address: generateAddress(generatorSeed + i),
      amount: fakeFraction,
      isYou: false
    };
  }).sort((a, b) => b.amount - a.amount);

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
          {dynamicMembers.map((member, index) => (
            <div key={member.address + index} className={`flex items-center justify-between p-4 rounded-2xl ${member.isYou ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50 border border-border/50'}`}>
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
                <div className="font-bold text-lg text-white">{member.amount.toFixed(2)} {squad.asset}</div>
                <div className="text-xs text-[#6b9e7e]">{squad.current > 0 ? (member.amount / squad.current * 100).toFixed(1) : 0}% of pool</div>
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
