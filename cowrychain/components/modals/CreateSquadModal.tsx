import { X, Target, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export function CreateSquadModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [asset, setAsset] = useState("USDC");

  const isComplete = name.trim().length > 0 && Number(target) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-white">
          <X size={20} />
        </button>

        <div className="mb-8">
          <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-4 border border-primary/30">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-black text-white">Create a Squad</h2>
          <p className="text-muted-foreground text-sm">Deploy a new shared vault contract on Base.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Squad Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Summer Trip ✈️" 
              className="w-full bg-secondary border border-border p-4 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white">Target Goal</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={target}
                onChange={e => setTarget(e.target.value)}
                placeholder="10000" 
                className="w-full bg-secondary border border-border p-4 rounded-xl text-white focus:outline-none focus:border-primary transition-colors"
              />
              <select 
                value={asset}
                onChange={e => setAsset(e.target.value)}
                className="bg-secondary border border-border px-4 rounded-xl text-white font-bold focus:outline-none"
              >
                <option value="USDC">USDC</option>
                <option value="WETH">WETH</option>
              </select>
            </div>
          </div>

          <button 
            disabled={!isComplete}
            onClick={() => {
              // Simulate contract deployment
              setTimeout(onClose, 1000);
            }}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Deploy Squad Vault <ArrowRight size={18} />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
          Creation deploys a minimal proxy ERC-4626 vault utilizing YO Protocol underlying strategies. Gas fees apply.
        </p>
      </div>
    </div>
  );
}
