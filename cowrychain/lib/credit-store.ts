import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CreditStore {
  currentDebt: number;
  totalPaid: number;
  borrow: (amount: number) => void;
  repay: (amount: number) => void;
}

export const useCreditStore = create<CreditStore>()(
  persist(
    (set) => ({
      currentDebt: 0,
      totalPaid: 0,
      borrow: (amount) => set((state) => ({ currentDebt: state.currentDebt + amount })),
      repay: (amount) => set((state) => ({ 
        currentDebt: Math.max(0, state.currentDebt - amount),
        totalPaid: state.totalPaid + amount
      })),
    }),
    { name: 'cowrychain_credit' }
  )
);
