import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavingsGoal {
  id: string;
  name: string;
  emoji: string;
  targetAmount: number;
  currentAmount: number;
  vaultId: string;
  deadline?: string;
  createdAt: string;
  color: string;
}

interface GoalsState {
  goals: SavingsGoal[];
  addGoal: (goal: Omit<SavingsGoal, "id" | "createdAt">) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  removeGoal: (id: string) => void;
}

const GOAL_COLORS = [
  "from-green-400 to-teal-400",
  "from-indigo-400 to-purple-400",
  "from-amber-400 to-orange-400",
  "from-pink-400 to-rose-400",
  "from-sky-400 to-blue-400",
];

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [
        {
          id: "1",
          name: "Emergency Fund",
          emoji: "🛡️",
          targetAmount: 5000,
          currentAmount: 1250,
          vaultId: "yoUSD",
          deadline: "2025-12-31",
          createdAt: new Date().toISOString(),
          color: GOAL_COLORS[0],
        },
        {
          id: "2",
          name: "MacBook Pro",
          emoji: "💻",
          targetAmount: 2500,
          currentAmount: 800,
          vaultId: "yoUSD",
          deadline: "2025-09-01",
          createdAt: new Date().toISOString(),
          color: GOAL_COLORS[4],
        },
      ],
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: Math.random().toString(36).slice(2),
              createdAt: new Date().toISOString(),
              color: GOAL_COLORS[state.goals.length % GOAL_COLORS.length],
            },
          ],
        })),
      updateGoalProgress: (id, amount) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
          ),
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
    }),
    { name: "cowrychain-goals" }
  )
);
