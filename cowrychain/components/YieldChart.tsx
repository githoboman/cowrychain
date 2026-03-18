"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";

interface YieldChartProps {
    initialAmount: number;
    apy: number; // as a plain number, e.g. 8.64 means 8.64%
    vaultName?: string;
    months?: number; // total months to project (default 12)
}

export function YieldChart({
    initialAmount,
    apy,
    vaultName,
    months = 12,
}: YieldChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const monthlyRate = apy / 100 / 12;

    const dataPoints = useMemo(() => {
        const points: { month: number; value: number; earned: number }[] = [];
        for (let m = 0; m <= months; m++) {
            const value = initialAmount * Math.pow(1 + monthlyRate, m);
            points.push({
                month: m,
                value,
                earned: value - initialAmount,
            });
        }
        return points;
    }, [initialAmount, monthlyRate, months]);

    const maxValue = dataPoints[dataPoints.length - 1].value;
    const minValue = initialAmount;
    const range = maxValue - minValue || 1;

    const totalEarned = dataPoints[months].earned;
    const finalValue = dataPoints[months].value;

    const chartWidth = 400;
    const chartHeight = 120;
    const paddingX = 4;
    const paddingY = 8;

    const points = dataPoints.map((d, i) => {
        const x = paddingX + (i / months) * (chartWidth - paddingX * 2);
        const y =
            paddingY +
            (1 - (d.value - minValue) / range) * (chartHeight - paddingY * 2);
        return { x, y, ...d };
    });

    const pathD = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    const fillPath = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

    const hovered = hoveredIdx !== null ? points[hoveredIdx] : null;

    return (
        <div className="rounded-2xl border border-[#1a4a2e] bg-[#0f2d1e] p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <TrendingUp size={16} className="text-[#22c55e]" />
                    {vaultName ? `${vaultName} Growth` : "Projected Growth"}
                </h3>
                <span className="text-xs text-[#6b9e7e] bg-[#1a4a2e]/50 px-2 py-1 rounded-full border border-[#1a4a2e]">
                    {apy.toFixed(2)}% APY
                </span>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl bg-[#0a1f14] border border-[#1a4a2e] p-3">
                    <div className="text-xs text-[#6b9e7e] mb-1">Start</div>
                    <div className="font-bold text-white">
                        ${initialAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                </div>
                <div className="rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 p-3">
                    <div className="text-xs text-[#6b9e7e] mb-1">Earned ({months}mo)</div>
                    <div className="font-bold text-[#22c55e]">
                        +${totalEarned.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="rounded-xl bg-[#0a1f14] border border-[#1a4a2e] p-3">
                    <div className="text-xs text-[#6b9e7e] mb-1">Total</div>
                    <div className="font-bold text-white">
                        ${finalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                </div>
            </div>

            {/* SVG Chart */}
            <div className="relative">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full rounded-xl overflow-visible"
                    style={{ height: 120 }}
                    onMouseLeave={() => setHoveredIdx(null)}
                >
                    <defs>
                        <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* Fill */}
                    <path d={fillPath} fill="url(#yieldGradient)" />

                    {/* Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Hover interaction zones */}
                    {points.map((p, i) => (
                        <rect
                            key={i}
                            x={p.x - (chartWidth / months) / 2}
                            y={0}
                            width={chartWidth / months}
                            height={chartHeight}
                            fill="transparent"
                            onMouseEnter={() => setHoveredIdx(i)}
                        />
                    ))}

                    {/* Hover indicator */}
                    {hovered && (
                        <>
                            <line
                                x1={hovered.x}
                                y1={paddingY}
                                x2={hovered.x}
                                y2={chartHeight - paddingY}
                                stroke="#22c55e"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                                opacity="0.5"
                            />
                            <circle
                                cx={hovered.x}
                                cy={hovered.y}
                                r="4"
                                fill="#22c55e"
                                stroke="#0f2d1e"
                                strokeWidth="2"
                            />
                        </>
                    )}
                </svg>

                {/* Tooltip */}
                {hovered && (
                    <div
                        className="absolute bottom-full mb-2 pointer-events-none bg-[#0a1f14] border border-[#1a4a2e] rounded-lg px-3 py-2 text-xs shadow-xl"
                        style={{
                            left: `${(hovered.x / chartWidth) * 100}%`,
                            transform: "translateX(-50%)",
                        }}
                    >
                        <div className="text-[#6b9e7e] mb-0.5">Month {hovered.month}</div>
                        <div className="font-bold text-white">
                            ${hovered.value.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[#22c55e]">
                            +${hovered.earned.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </div>
                    </div>
                )}
            </div>

            {/* Month labels */}
            <div className="flex justify-between mt-2 text-xs text-[#6b9e7e]">
                <span>Now</span>
                <span>{Math.floor(months / 2)}mo</span>
                <span>{months}mo</span>
            </div>
        </div>
    );
}
