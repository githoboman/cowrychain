// @ts-nocheck
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface YieldChartProps {
  initialAmount?: number;
  apy?: number;
  months?: number;
  vaultName?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function YieldChart({ initialAmount = 1000, apy = 8.64, months = 12, vaultName = "yoUSD" }: YieldChartProps) {
  const data = useMemo(() => {
    const monthlyRate = apy / 100 / 12;
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const value = initialAmount * Math.pow(1 + monthlyRate, i);
      const monthIdx = (now.getMonth() + i) % 12;
      return {
        month: MONTHS[monthIdx],
        value: parseFloat(value.toFixed(2)),
        yield: parseFloat((value - initialAmount).toFixed(2)),
      };
    });
  }, [initialAmount, apy, months]);

  const totalYield = data[data.length - 1].yield;
  const totalValue = data[data.length - 1].value;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111714] border border-[#1e2920] rounded-xl p-3 shadow-xl">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-sm font-bold text-white">${payload[0]?.value?.toLocaleString()}</p>
          <p className="text-xs text-green-400">+${payload[1]?.value?.toFixed(2)} yield</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cowry-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-white mb-1">Projected Growth</h3>
          <p className="text-xs text-gray-400">${initialAmount.toLocaleString()} in {vaultName} at {apy}% APY</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-white">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-green-400">+${totalYield.toFixed(2)} in {months}mo</div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2920" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#valueGradient)"
            />
            <Area
              type="monotone"
              dataKey="yield"
              stroke="#14b8a6"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              fill="url(#yieldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-green-400 rounded" />
          <span className="text-xs text-gray-400">Total value</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-teal-400 rounded" style={{ backgroundImage: "repeating-linear-gradient(to right, #14b8a6 0, #14b8a6 4px, transparent 4px, transparent 6px)" }} />
          <span className="text-xs text-gray-400">Yield earned</span>
        </div>
      </div>
    </div>
  );
}
