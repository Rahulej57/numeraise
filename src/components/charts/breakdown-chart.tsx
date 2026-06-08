"use client";

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BreakdownChartProps {
  data: { name: string; value: number; color: string }[];
}

import { memo } from "react";
import { useCurrency } from "@/context/CurrencyContext";

export const BreakdownChart = memo(function BreakdownChart({ data }: BreakdownChartProps) {
  const { format } = useCurrency();
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => format(Number(value))} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
});
