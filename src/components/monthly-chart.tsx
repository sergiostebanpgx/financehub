"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import type { MonthlyPoint } from "@/types/finance";

type MonthlyChartProps = {
  data: MonthlyPoint[];
};

export function MonthlyChart({ data }: MonthlyChartProps) {
  if (data.length === 0) {
    return (
      <div className="status-warning grid h-[280px] place-items-center rounded-2xl px-4 text-center text-sm">
        No hay datos suficientes para graficar el flujo mensual.
      </div>
    );
  }

  return (
    <div className="min-h-[280px] h-[280px] sm:h-[300px] lg:h-[320px] w-full min-w-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data} margin={{ left: -16, right: 10, top: 18, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#44efff" stopOpacity={0.42} />
              <stop offset="100%" stopColor="#44efff" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expenseLineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity={0.37} />
              <stop offset="100%" stopColor="#fb7185" stopOpacity={0.02} />
            </linearGradient>
            <filter id="glowIncome">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowExpense">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="#33486f" opacity={0.62} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#adbbdd", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#92a4ce", fontSize: 11 }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("es-CO", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            cursor={{ stroke: "#44efff", strokeWidth: 1.2, strokeDasharray: "4 4" }}
            formatter={(value) => formatCurrency(Number(value ?? 0))}
            contentStyle={{
              borderRadius: "0.95rem",
              border: "1px solid rgba(151, 181, 243, 0.32)",
              backgroundColor: "rgba(8, 14, 38, 0.95)",
              color: "#eaf2ff",
              boxShadow: "0 16px 38px rgba(6, 11, 31, 0.62)",
            }}
            labelStyle={{ color: "#cfdbf5", fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="income"
            name="Ingreso"
            stroke="#44efff"
            strokeWidth={3}
            dot={{ r: 4.5, strokeWidth: 2, fill: "#c4fbff", stroke: "#44efff" }}
            activeDot={{ r: 6, strokeWidth: 2.5, fill: "#defdff", stroke: "#44efff" }}
            fill="url(#incomeLineGradient)"
            filter="url(#glowIncome)"
          />
          <Line
            type="monotone"
            dataKey="expense"
            name="Gasto"
            stroke="#fb7185"
            strokeWidth={3}
            dot={{ r: 4.5, strokeWidth: 2, fill: "#ffd8df", stroke: "#fb7185" }}
            activeDot={{ r: 6, strokeWidth: 2.5, fill: "#ffe7eb", stroke: "#fb7185" }}
            fill="url(#expenseLineGradient)"
            filter="url(#glowExpense)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}