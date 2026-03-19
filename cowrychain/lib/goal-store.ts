import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Goal {
  id: number;
  name: string;
  target: number;
  color: string;
  duration?: string;
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [
        { id: 1, name: "New Laptop", target: 2000, color: "#10b981", duration: "3 Months" },
        { id: 2, name: "Summer Trip", target: 5000, color: "#3b82f6", duration: "6 Months" },
      ],
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
    }),
    {
      name: "cowrychain-goals-storage",
    }
  )
);
