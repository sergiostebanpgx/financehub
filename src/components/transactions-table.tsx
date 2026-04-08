"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { EditIcon, ExpenseIcon, IncomeIcon, TrashIcon } from "@/components/ui/pretty-icons";
import { formatCurrency, formatShortDate } from "@/lib/format";
import { getCategoryIcon } from "@/lib/category-icons";
import type { DashboardTransaction } from "@/types/finance";

const fullDateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

type TransactionsTableProps = {
  transactions: DashboardTransaction[];
  onEdit?: (transaction: DashboardTransaction) => void;
};

export function TransactionsTable({ transactions, onEdit }: TransactionsTableProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este movimiento?")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("No se pudo eliminar el movimiento.");
        }
        router.refresh();
      } catch {
        setError("No se pudo eliminar el movimiento. Intenta nuevamente.");
      }
    });
  }

  if (transactions.length === 0) {
    return (
      <div className="text-(--text-secondary) rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-5 py-8 text-center text-sm">
        Aún no hay movimientos. Registra el primero para comenzar.
      </div>
    );
  }

  const rows = transactions.slice(0, 10);

  return (
    <div className="space-y-3">
      {error && <p className="status-error rounded-xl px-3 py-2 text-sm">{error}</p>}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/8 bg-slate-950/35 lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-sm" style={{ background: "rgba(255,255,255,0.02)", color: "var(--text-secondary)" }}>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium min-w-[200px]">Descripción</th>
              <th className="px-4 py-3 text-right font-medium">Monto</th>
              <th className="w-14 px-4 py-3 text-right font-medium">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category.icon);
              const isIncome = transaction.type === "INCOME";

              return (
                <tr
                  key={transaction.id}
                  className="border-b border-white/5 transition hover:bg-cyan-400/3"
                  style={{ color: "var(--text-primary)" }}
                >
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {fullDateFormatter.format(new Date(transaction.date))}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                      <span
                        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5"
                        style={{ boxShadow: `0 0 0 1px ${transaction.category.color}36 inset` }}
                      >
                        <span style={{ color: "var(--text-primary)" }}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      </span>
                      {transaction.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    <p>{transaction.description}</p>
                    {transaction.notes && (
                      <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>{transaction.notes}</p>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-right text-base font-semibold"
                    style={{ color: isIncome ? "var(--accent-cyan)" : "var(--text-primary)" }}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(transaction)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
                        style={{ color: "var(--text-secondary)" }}
                        aria-label="Editar movimiento"
                      >
                        <EditIcon className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(transaction.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition hover:border-rose-400/50 hover:bg-rose-500/10 disabled:opacity-50"
                        style={{ color: "var(--text-secondary)" }}
                        disabled={isPending}
                        aria-label="Eliminar movimiento"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {rows.map((transaction) => {
          const Icon = getCategoryIcon(transaction.category.icon);
          const isIncome = transaction.type === "INCOME";

          return (
            <article
              key={transaction.id}
              className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5"
                    style={{ boxShadow: `0 0 0 1px ${transaction.category.color}32 inset` }}
                  >
                    <span style={{ color: "var(--text-primary)" }}>
                      <Icon className="h-4 w-4" />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{transaction.description}</p>
                    <p className="mt-1 text-xs truncate" style={{ color: "var(--text-muted)" }}>
                      {transaction.category.name} · {formatShortDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(transaction)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 transition hover:border-cyan-400/50 hover:bg-cyan-500/10"
                    style={{ color: "var(--text-secondary)" }}
                    aria-label="Editar movimiento"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(transaction.id)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 transition hover:border-rose-400/50 hover:bg-rose-500/10 disabled:opacity-50"
                    style={{ color: "var(--text-secondary)" }}
                    disabled={isPending}
                    aria-label="Eliminar movimiento"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {transaction.notes && (
                <p className="mt-2 text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>{transaction.notes}</p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{fullDateFormatter.format(new Date(transaction.date))}</span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{
                    background: isIncome ? "rgba(0, 229, 255, 0.1)" : "rgba(255, 60, 172, 0.1)",
                    color: isIncome ? "var(--accent-cyan)" : "var(--accent-magenta)"
                  }}
                >
                  {isIncome ? <IncomeIcon className="h-3 w-3" /> : <ExpenseIcon className="h-3 w-3" />}
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
