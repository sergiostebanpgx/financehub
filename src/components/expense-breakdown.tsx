import { Gauge, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { getCategoryIcon } from "@/lib/category-icons";
import type { ExpenseByCategory } from "@/types/finance";

type ExpenseBreakdownProps = {
  data: ExpenseByCategory[];
};

export function ExpenseBreakdown({ data }: ExpenseBreakdownProps) {
  if (data.length === 0) {
    return (
      <article className="surface-panel p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
          <Gauge className="h-4.5 w-4.5 text-cyan-300" />
          Gasto por categoria
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Aun no hay gastos este mes para mostrar distribucion.
        </p>
      </article>
    );
  }

  return (
    <article className="surface-panel p-5 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
          <Gauge className="h-4.5 w-4.5 text-cyan-300" />
          Gasto por categoria
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
          <Sparkles className="h-3 w-3 text-fuchsia-300" />
          Mes actual
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item, index) => {
          const Icon = getCategoryIcon(item.icon);
          return (
            <div key={item.categoryName} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Icon className="h-3.5 w-3.5 text-slate-200" />
                  </span>
                  <p className="text-sm font-medium text-slate-200">{item.categoryName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-100">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-[11px] text-slate-400">{item.share}%</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full animate-scale-in"
                  style={{
                    width: `${Math.max(item.share, 4)}%`,
                    backgroundColor: item.color,
                    animationDelay: `${index * 100 + 200}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
