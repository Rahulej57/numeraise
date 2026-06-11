"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface CircularStatisticsProps {
  data: ChartData[];
  title?: string;
}

export function CircularStatistics({ data, title }: CircularStatisticsProps) {
  if (!data || data.length === 0) return null;

  // Format currency/number for tooltip
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 print:hidden">
      {title && <h4 className="text-sm font-semibold text-muted-foreground mb-4">{title}</h4>}
      <div className="h-[250px] w-full max-w-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatTooltipValue(value as number), ""]}
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                color: "var(--card-foreground)",
                fontSize: "14px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
