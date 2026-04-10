"use client";

import { FormEvent, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import {
  CreditCardIcon,
  PlusIcon,
  TrashIcon,
  WalletIcon,
} from "@/components/ui/pretty-icons";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Debt, SavingGoal } from "@/types/finance";

type GoalsDebtsPanelProps = {
  balance: number;
  monthBalance: number;
  monthIncome: number;
  monthExpense: number;
  initialGoals: SavingGoal[];
  initialDebts: Debt[];
};

export function GoalsDebtsPanel({
  initialGoals,
  initialDebts,
}: GoalsDebtsPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState(0);
  const [debtName, setDebtName] = useState("");
  const [debtAmount, setDebtAmount] = useState(0);

  const [draftContributions, setDraftContributions] = useState<
    Record<string, number>
  >({});
  const [draftPayments, setDraftPayments] = useState<Record<string, number>>(
    {},
  );

  const activeGoals = initialGoals.filter(
    (g) => g.savedAmount < g.targetAmount,
  );
  const activeDebts = initialDebts.filter((d) => d.paidAmount < d.totalAmount);

  const [isGoalsOpen, setIsGoalsOpen] = useState(activeGoals.length <= 1);
  const [isDebtsOpen, setIsDebtsOpen] = useState(activeDebts.length <= 1);
  const [deleteModal, setDeleteModal] = useState<{
    type: "goal" | "debt";
    id: string;
  } | null>(null);

  const totalGoalSaved = activeGoals.reduce(
    (sum, goal) => sum + goal.savedAmount,
    0,
  );
  const totalGoalTarget = activeGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0,
  );
  const totalGoalRemaining = activeGoals.reduce(
    (sum, goal) => sum + (goal.targetAmount - goal.savedAmount),
    0,
  );
  const totalDebtPending = activeDebts.reduce(
    (sum, debt) => sum + (debt.totalAmount - debt.paidAmount),
    0,
  );
  const totalDebtAmount = activeDebts.reduce(
    (sum, debt) => sum + debt.totalAmount,
    0,
  );

  async function handleAddGoal(e: FormEvent) {
    e.preventDefault();
    if (!goalName.trim() || goalTarget <= 0) return;
    startTransition(async () => {
      await fetch("/api/saving-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: goalName.trim(),
          targetAmount: goalTarget,
        }),
      });
      setGoalName("");
      setGoalTarget(0);
      router.refresh();
    });
  }

  async function handleAddDebt(e: FormEvent) {
    e.preventDefault();
    if (!debtName.trim() || debtAmount <= 0) return;
    startTransition(async () => {
      await fetch("/api/debts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: debtName.trim(),
          totalAmount: debtAmount,
        }),
      });
      setDebtName("");
      setDebtAmount(0);
      router.refresh();
    });
  }

  async function handleApplyContribution(goal: SavingGoal) {
    const value = draftContributions[goal.id] ?? 0;
    if (value <= 0) return;
    startTransition(async () => {
      const nextSaved = Math.min(goal.savedAmount + value, goal.targetAmount);
      await fetch(`/api/saving-goals/${goal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedAmount: nextSaved }),
      });
      setDraftContributions((prev) => ({ ...prev, [goal.id]: 0 }));
      router.refresh();
    });
  }

  async function handleApplyPayment(debt: Debt) {
    const value = draftPayments[debt.id] ?? 0;
    if (value <= 0) return;
    startTransition(async () => {
      const nextPaid = Math.min(debt.paidAmount + value, debt.totalAmount);
      await fetch(`/api/debts/${debt.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paidAmount: nextPaid }),
      });
      setDraftPayments((prev) => ({ ...prev, [debt.id]: 0 }));
      router.refresh();
    });
  }

  async function confirmDelete() {
    if (!deleteModal) return;
    startTransition(async () => {
      await fetch(
        `/api/${deleteModal.type === "goal" ? "saving-goals" : "debts"}/${deleteModal.id}`,
        { method: "DELETE" },
      );
      setDeleteModal(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-12 animate-slide-up delay-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Metas de Ahorro */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                <WalletIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  Mis Metas
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Plan de ahorro activo
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/10 px-3.5 py-2 text-right shadow-[0_0_20px_rgba(34,211,238,0.08)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Ahorrado total
              </p>
              <p className="text-sm font-black text-white tabular-nums">
                {formatCurrency(totalGoalSaved)}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl">
            <form
              onSubmit={handleAddGoal}
              className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-4"
            >
              <div className="relative">
                <Input
                  placeholder="¿Qué estás ahorrando?"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="h-14 bg-slate-950/60 border-white/5 rounded-2xl pl-12 font-bold"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600">
                  <PlusIcon className="h-full w-full" />
                </div>
              </div>
              <InputNumber
                placeholder="Objetivo"
                value={goalTarget}
                onChange={(val) => setGoalTarget(val)}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl font-black"
              />
              <button
                type="submit"
                aria-label="Agregar nueva meta"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-500/10 text-cyan-50 transition-all hover:bg-cyan-500/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50"
                disabled={isPending}
              >
                <PlusIcon className="h-5 w-5 stroke-[3px]" />
              </button>
            </form>

            <div className="rounded-4xl border border-white/5 bg-slate-950/30 p-3 sm:p-4">
              <button
                type="button"
                onClick={() => setIsGoalsOpen((prev) => !prev)}
                aria-expanded={isGoalsOpen}
                aria-controls="goals-list-panel"
                disabled={activeGoals.length === 0}
                className="flex w-full flex-col gap-3 rounded-3xl px-3 py-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-default disabled:hover:bg-transparent sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Resumen de metas
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-2xl font-black text-white tabular-nums sm:text-3xl">
                      {formatCurrency(totalGoalSaved)}
                    </span>
                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
                      {activeGoals.length} activas
                    </span>
                  </div>
                  {activeGoals.length > 0 ? (
                    <p className="text-xs text-slate-400">
                      Objetivo conjunto{" "}
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(totalGoalTarget)}
                      </span>{" "}
                      · faltan {formatCurrency(totalGoalRemaining)}
                    </p>
                  ) : null}
                </div>

                {activeGoals.length > 0 ? (
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {isGoalsOpen ? "Ocultar detalle" : "Ver detalle"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
                        isGoalsOpen && "rotate-180 text-cyan-400",
                      )}
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </button>

              {activeGoals.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-4xl text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  No hay metas en el radar
                </div>
              ) : isGoalsOpen ? (
                <div
                  id="goals-list-panel"
                  className={cn(
                    "mt-3 grid gap-3 border-t border-white/5 pt-3",
                    activeGoals.length > 3 && "max-h-112 overflow-y-auto pr-1",
                  )}
                >
                  {activeGoals.map((goal) => {
                    const progress =
                      (goal.savedAmount / goal.targetAmount) * 100;
                    const remainingAmount =
                      goal.targetAmount - goal.savedAmount;

                    return (
                      <div
                        key={goal.id}
                        className="rounded-3xl border border-white/5 bg-slate-950/50 p-4 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-100 uppercase tracking-tight">
                              {goal.name}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-cyan-300">
                                Faltan {formatCurrency(remainingAmount)}
                              </span>
                              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-slate-300">
                                {Math.round(progress)}% completado
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Eliminar meta ${goal.name}`}
                            onClick={() =>
                              setDeleteModal({ type: "goal", id: goal.id })
                            }
                            className="shrink-0 rounded-xl bg-white/5 p-2.5 text-slate-600 transition-all hover:text-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-3 flex-1 overflow-hidden rounded-full border border-white/5 bg-slate-900">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="min-w-12 text-right text-sm font-black text-cyan-300 tabular-nums">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-end">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                              Actual
                            </span>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(goal.savedAmount)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                              Objetivo
                            </span>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(goal.targetAmount)}
                            </span>
                          </div>
                          <div className="flex w-full items-center gap-2 rounded-xl border border-white/5 bg-slate-900 px-3 py-2 transition-colors focus-within:border-cyan-500/50">
                            <span className="text-xs font-black text-cyan-400">
                              $
                            </span>
                            <input
                              type="number"
                              inputMode="decimal"
                              aria-label={`Monto a aportar para ${goal.name}`}
                              placeholder="Ahorrar..."
                              className="w-full bg-transparent text-xs font-black text-white placeholder:text-slate-700 focus:outline-none"
                              value={draftContributions[goal.id] ?? ""}
                              onChange={(e) =>
                                setDraftContributions((prev) => ({
                                  ...prev,
                                  [goal.id]: Number(e.target.value),
                                }))
                              }
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyContribution(goal)}
                              className="text-[10px] font-black uppercase tracking-tighter text-cyan-400 transition-colors hover:text-white"
                              disabled={isPending}
                            >
                              Aportar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Deudas y Compromisos */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
                <CreditCardIcon className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  Mis Deudas
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Compromisos pendientes
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-rose-400/15 bg-rose-500/10 px-3.5 py-2 text-right shadow-[0_0_20px_rgba(244,63,94,0.08)]">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Pendiente total
              </p>
              <p className="text-sm font-black text-white tabular-nums">
                {formatCurrency(totalDebtPending)}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl">
            <form
              onSubmit={handleAddDebt}
              className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-4"
            >
              <div className="relative">
                <Input
                  placeholder="¿A quién le debes?"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  className="h-14 bg-slate-950/60 border-white/5 rounded-2xl pl-12 font-bold"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600">
                  <CreditCardIcon className="h-full w-full" />
                </div>
              </div>
              <InputNumber
                placeholder="Total"
                value={debtAmount}
                onChange={(val) => setDebtAmount(val)}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl font-black"
              />
              <button
                type="submit"
                aria-label="Agregar nueva deuda"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/25 bg-rose-500/10 text-rose-100 transition-all hover:bg-rose-500/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50"
                disabled={isPending}
              >
                <PlusIcon className="h-5 w-5 stroke-[3px]" />
              </button>
            </form>

            <div className="rounded-4xl border border-white/5 bg-slate-950/30 p-3 sm:p-4">
              <button
                type="button"
                onClick={() => setIsDebtsOpen((prev) => !prev)}
                aria-expanded={isDebtsOpen}
                aria-controls="debts-list-panel"
                disabled={activeDebts.length === 0}
                className="flex w-full flex-col gap-3 rounded-3xl px-3 py-3 text-left transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-default disabled:hover:bg-transparent sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    Resumen de deuda
                  </p>
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="text-2xl font-black text-white tabular-nums sm:text-3xl">
                      {formatCurrency(totalDebtPending)}
                    </span>
                    <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-300">
                      {activeDebts.length} activas
                    </span>
                  </div>
                  {activeDebts.length > 0 ? (
                    <p className="text-xs text-slate-400">
                      Has cubierto{" "}
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(totalDebtAmount - totalDebtPending)}
                      </span>{" "}
                      de {formatCurrency(totalDebtAmount)}
                    </p>
                  ) : null}
                </div>

                {activeDebts.length > 0 ? (
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {isDebtsOpen ? "Ocultar detalle" : "Ver detalle"}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform duration-200",
                        isDebtsOpen && "rotate-180 text-rose-400",
                      )}
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </button>

              {activeDebts.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-4xl text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  Cero deudas pendientes
                </div>
              ) : isDebtsOpen ? (
                <div
                  id="debts-list-panel"
                  className={cn(
                    "mt-3 grid gap-3 border-t border-white/5 pt-3",
                    activeDebts.length > 3 && "max-h-112 overflow-y-auto pr-1",
                  )}
                >
                  {activeDebts.map((debt) => {
                    const progress = (debt.paidAmount / debt.totalAmount) * 100;
                    const pendingAmount = debt.totalAmount - debt.paidAmount;

                    return (
                      <div
                        key={debt.id}
                        className="rounded-3xl border border-white/5 bg-slate-950/50 p-4 sm:p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate font-black text-slate-100 uppercase tracking-tight">
                              {debt.name}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-rose-300">
                                Pendiente {formatCurrency(pendingAmount)}
                              </span>
                              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter text-slate-300">
                                {Math.round(progress)}% abonado
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Eliminar deuda ${debt.name}`}
                            onClick={() =>
                              setDeleteModal({ type: "debt", id: debt.id })
                            }
                            className="shrink-0 rounded-xl bg-white/5 p-2.5 text-slate-600 transition-all hover:text-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-3 flex-1 overflow-hidden rounded-full border border-white/5 bg-slate-900">
                            <div
                              className="h-full rounded-full bg-linear-to-r from-rose-500 to-rose-400 transition-all duration-700"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="min-w-12 text-right text-sm font-black text-rose-300 tabular-nums">
                            {Math.round(progress)}%
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 border-t border-white/5 pt-4 sm:grid-cols-[auto_auto_minmax(0,1fr)] sm:items-end">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                              Pagado
                            </span>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(debt.paidAmount)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                              Total
                            </span>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(debt.totalAmount)}
                            </span>
                          </div>
                          <div className="flex w-full items-center gap-2 rounded-xl border border-white/5 bg-slate-900 px-3 py-2 transition-colors focus-within:border-rose-500/50">
                            <span className="text-xs font-black text-rose-400">
                              $
                            </span>
                            <input
                              type="number"
                              inputMode="decimal"
                              aria-label={`Monto a abonar para ${debt.name}`}
                              placeholder="Abonar..."
                              className="w-full bg-transparent text-xs font-black text-white placeholder:text-slate-700 focus:outline-none"
                              value={draftPayments[debt.id] ?? ""}
                              onChange={(e) =>
                                setDraftPayments((prev) => ({
                                  ...prev,
                                  [debt.id]: Number(e.target.value),
                                }))
                              }
                            />
                            <button
                              type="button"
                              onClick={() => handleApplyPayment(debt)}
                              className="text-[10px] font-black uppercase tracking-tighter text-rose-400 transition-colors hover:text-white"
                              disabled={isPending}
                            >
                              Abonar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-6">
          <p className="text-slate-400 leading-relaxed font-medium">
            ¿Estás seguro de que deseas eliminar este registro? Esta acción no
            se puede deshacer y perderás el historial de progreso acumulado.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setDeleteModal(null)}
              className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 px-6 py-4 bg-rose-500 hover:bg-rose-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-500/20"
              disabled={isPending}
            >
              {isPending ? "Eliminando..." : "Sí, eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
