"use client";

import { BalanceIcon, ExpenseIcon, IncomeIcon } from "@/components/ui/pretty-icons";
import { formatCurrency } from "@/lib/format";
import type { DashboardSummary } from "@/types/finance";
import { cn } from "@/lib/utils";

type KpiGridProps = {
  summary: DashboardSummary;
  className?: string;
};

export function KpiGrid({ summary, className }: KpiGridProps) {
  const stats = [
    {
      label: "Balance Total",
      value: formatCurrency(summary.balance),
      icon: BalanceIcon,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
    },
    {
      label: "Ingresos Mes",
      value: formatCurrency(summary.monthIncome),
      icon: IncomeIcon,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Gastos Mes",
      value: formatCurrency(summary.monthExpense),
      icon: ExpenseIcon,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
  ];

  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="surface-panel p-5 flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl", stat.bg, stat.color)}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
              <p className="text-xl font-black text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
