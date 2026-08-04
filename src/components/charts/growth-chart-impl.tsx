"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";

interface GrowthChartProps {
  data: any[];
  xAxisKey: string;
  areas: { key: string; color: string; name: string }[];
}

import { memo } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export const GrowthChart = memo(function GrowthChart({ data, xAxisKey, areas }: GrowthChartProps) {
  const { format } = useCurrency();
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          {areas.map((area) => (
            <linearGradient key={`color${area.key}`} id={`color${area.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={area.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
        <XAxis 
          dataKey={xAxisKey} 
          className="text-xs text-muted-foreground" 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tickFormatter={(value: any) => format(Number(value))} 
          className="text-xs text-muted-foreground"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          formatter={(value: any) => format(Number(value))}
          contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
        />
        <Legend />
        {areas.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.name}
            stroke={area.color}
            fillOpacity={1}
            fill={`url(#color${area.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
});
