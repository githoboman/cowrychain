"use client";

import { useState, useEffect } from "react";

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

export function useSquadStore() {
  const [squads, setSquads] = useState<Squad[]>([]);
  
  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cowrychain_squads");
      if (stored) {
        setSquads(JSON.parse(stored));
      } else {
        setSquads(DEFAULT_SQUADS);
      }
    } catch {
      setSquads(DEFAULT_SQUADS);
    }
  }, []);

  const saveSquads = (newSquads: Squad[]) => {
    setSquads(newSquads);
    localStorage.setItem("cowrychain_squads", JSON.stringify(newSquads));
  };

  const createSquad = (squad: Omit<Squad, "id" | "current" | "members">) => {
    const newSquads = [
      ...squads,
      {
        ...squad,
        id: `sq-${Date.now()}`,
        current: 0,
        members: 1, // You are the first member
      }
    ];
    saveSquads(newSquads);
  };

  const depositToSquad = (id: string, amount: number) => {
    const newSquads = squads.map(sq => {
      if (sq.id === id) {
        return { ...sq, current: sq.current + amount, members: Math.max(sq.members, 2) }; // Simulate another member
      }
      return sq;
    });
    saveSquads(newSquads);
  };

  return {
    squads,
    createSquad,
    depositToSquad
  };
}
