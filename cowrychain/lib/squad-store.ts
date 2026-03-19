import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Squad {
  id: string;
  name: string;
  target: number;
  current: number;
  members: number;
  apy: string;
  asset: string;
  color: string;
}

const DEFAULT_SQUADS: Squad[] = [
  {
    id: "sq-1",
    name: "Vacation to Bali 🌴",
    target: 5000,
    current: 3150,
    members: 4,
    apy: "12.4%",
    asset: "USDC",
    color: "#22c55e",
  },
  {
    id: "sq-2",
    name: "ETH Accumulation DAO 🔷",
    target: 10,
    current: 6.2,
    members: 12,
    apy: "5.8%",
    asset: "WETH",
    color: "#3b82f6",
  }
];

interface SquadStore {
  squads: Squad[];
  createSquad: (squad: Omit<Squad, "id" | "current" | "members">) => void;
  depositToSquad: (id: string, amount: number) => void;
}

export const useSquadStore = create<SquadStore>()(
  persist(
    (set) => ({
      squads: DEFAULT_SQUADS,
      createSquad: (squad) => set((state) => ({
        squads: [
          ...state.squads,
          {
            ...squad,
            id: `sq-${Date.now()}`,
            current: 0,
            members: 1,
          }
        ]
      })),
      depositToSquad: (id, amount) => set((state) => ({
        squads: state.squads.map(sq => sq.id === id ? { ...sq, current: sq.current + amount, members: Math.max(sq.members, 2) } : sq)
      }))
    }),
    {
      name: 'cowrychain_squads',
    }
  )
);
