"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { TrashIcon, PlusIcon, WalletIcon, CreditCardIcon } from "@/components/ui/pretty-icons";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { InputNumber } from "@/components/ui/input-number";
import type { SavingGoal, Debt } from "@/types/finance";

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
  
  const [draftContributions, setDraftContributions] = useState<Record<string, number>>({});
  const [draftPayments, setDraftPayments] = useState<Record<string, number>>({});
  
  const [deleteModal, setDeleteModal] = useState<{ type: 'goal' | 'debt', id: string } | null>(null);

  const activeGoals = initialGoals.filter(g => g.savedAmount < g.targetAmount);
  const activeDebts = initialDebts.filter(d => d.paidAmount < d.totalAmount);

  async function handleAddGoal(e: FormEvent) {
    e.preventDefault();
    if (!goalName.trim() || goalTarget <= 0) return;
    startTransition(async () => {
      await fetch("/api/saving-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: goalName.trim(), targetAmount: goalTarget }),
      });
      setGoalName(""); setGoalTarget(0);
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
        body: JSON.stringify({ name: debtName.trim(), totalAmount: debtAmount }),
      });
      setDebtName(""); setDebtAmount(0);
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
      setDraftContributions(prev => ({ ...prev, [goal.id]: 0 }));
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
      setDraftPayments(prev => ({ ...prev, [debt.id]: 0 }));
      router.refresh();
    });
  }

  async function confirmDelete() {
    if (!deleteModal) return;
    startTransition(async () => {
      await fetch(`/api/${deleteModal.type === 'goal' ? 'saving-goals' : 'debts'}/${deleteModal.id}`, { method: "DELETE" });
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
                <h3 className="text-2xl font-black tracking-tight text-white">Mis Metas</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Plan de ahorro activo</p>
              </div>
            </div>
            <div className="h-8 px-3 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{activeGoals.length} activas</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl">
            <form onSubmit={handleAddGoal} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-4">
              <div className="relative">
                <Input 
                  placeholder="¿Qué estás ahorrando?"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="h-14 bg-slate-950/60 border-white/5 rounded-2xl pl-12 font-bold"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600">
                  <PlusIcon className="h-full w-full" />
                </div>
              </div>
              <InputNumber 
                placeholder="Objetivo"
                value={goalTarget}
                onChange={val => setGoalTarget(val)}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl font-black"
              />
              <button type="submit" className="h-14 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-2xl transition-all shadow-lg shadow-cyan-500/20 px-6 disabled:opacity-50" disabled={isPending}>
                <PlusIcon className="h-6 w-6 stroke-[3px]" />
              </button>
            </form>

            <div className="grid gap-4">
              {activeGoals.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  No hay metas en el radar
                </div>
              ) : (
                activeGoals.map(goal => {
                  const progress = (goal.savedAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id} className="group relative bg-slate-950/40 border border-white/5 rounded-3xl p-5 transition-all hover:border-cyan-500/30">
                      <div className="flex justify-between items-start mb-5 px-1">
                        <div>
                          <p className="font-black text-slate-100 uppercase tracking-tight">{goal.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              Faltan {formatCurrency(goal.targetAmount - goal.savedAmount)}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setDeleteModal({ type: 'goal', id: goal.id })} 
                          className="sm:opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-400 transition-all bg-white/5 rounded-xl"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex-1 h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex flex-col items-end min-w-[60px]">
                          <span className="text-xl font-black text-cyan-400 leading-none">{Math.round(progress)}%</span>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Status</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Actual</span>
                          <span className="text-sm font-bold text-white">{formatCurrency(goal.savedAmount)}</span>
                        </div>
                        <div className="flex-1 max-w-[180px] flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-1.5 border border-white/5 focus-within:border-cyan-500/50 transition-colors">
                          <span className="text-cyan-400 text-xs font-black">$</span>
                          <input 
                            type="number"
                            placeholder="Ahorrar..."
                            className="w-full bg-transparent text-xs font-black text-white focus:outline-none placeholder:text-slate-700"
                            value={draftContributions[goal.id] ?? ""}
                            onChange={e => setDraftContributions(prev => ({ ...prev, [goal.id]: Number(e.target.value) }))}
                          />
                          <button 
                            onClick={() => handleApplyContribution(goal)}
                            className="text-[10px] font-black text-cyan-400 uppercase tracking-tighter hover:text-white transition-colors"
                            disabled={isPending}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
                <h3 className="text-2xl font-black tracking-tight text-white">Mis Deudas</h3>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Compromisos pendientes</p>
              </div>
            </div>
            <div className="h-8 px-3 flex items-center justify-center bg-white/5 border border-white/10 rounded-full">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{activeDebts.length} activas</span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-xl">
            <form onSubmit={handleAddDebt} className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto] gap-4">
              <div className="relative">
                <Input 
                  placeholder="¿A quién le debes?"
                  value={debtName}
                  onChange={e => setDebtName(e.target.value)}
                  className="h-14 bg-slate-950/60 border-white/5 rounded-2xl pl-12 font-bold"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600">
                  <CreditCardIcon className="h-full w-full" />
                </div>
              </div>
              <InputNumber 
                placeholder="Total"
                value={debtAmount}
                onChange={val => setDebtAmount(val)}
                className="h-14 bg-slate-950/60 border-white/5 rounded-2xl font-black"
              />
              <button type="submit" className="h-14 flex items-center justify-center bg-rose-500 hover:bg-rose-400 text-white rounded-2xl transition-all shadow-lg shadow-rose-500/20 px-6 disabled:opacity-50" disabled={isPending}>
                <PlusIcon className="h-6 w-6 stroke-[3px]" />
              </button>
            </form>

            <div className="grid gap-4">
              {activeDebts.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  Cero deudas pendientes
                </div>
              ) : (
                activeDebts.map(debt => {
                  const progress = (debt.paidAmount / debt.totalAmount) * 100;
                  return (
                    <div key={debt.id} className="group relative bg-slate-950/40 border border-white/5 rounded-3xl p-5 transition-all hover:border-rose-500/30">
                      <div className="flex justify-between items-start mb-5 px-1">
                        <div>
                          <p className="font-black text-slate-100 uppercase tracking-tight">{debt.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                              Pendiente {formatCurrency(debt.totalAmount - debt.paidAmount)}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setDeleteModal({ type: 'debt', id: debt.id })} 
                          className="sm:opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-rose-400 transition-all bg-white/5 rounded-xl"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex-1 h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="flex flex-col items-end min-w-[60px]">
                          <span className="text-xl font-black text-rose-400 leading-none">{Math.round(progress)}%</span>
                          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Status</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">Pagado</span>
                          <span className="text-sm font-bold text-white">{formatCurrency(debt.paidAmount)}</span>
                        </div>
                        <div className="flex-1 max-w-[180px] flex items-center gap-2 bg-slate-900 rounded-xl px-3 py-1.5 border border-white/5 focus-within:border-rose-500/50 transition-colors">
                          <span className="text-rose-400 text-xs font-black">$</span>
                          <input 
                            type="number"
                            placeholder="Abonar..."
                            className="w-full bg-transparent text-xs font-black text-white focus:outline-none placeholder:text-slate-700"
                            value={draftPayments[debt.id] ?? ""}
                            onChange={e => setDraftPayments(prev => ({ ...prev, [debt.id]: Number(e.target.value) }))}
                          />
                          <button 
                            onClick={() => handleApplyPayment(debt)}
                            className="text-[10px] font-black text-rose-400 uppercase tracking-tighter hover:text-white transition-colors"
                            disabled={isPending}
                          >
                            Pay
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
            ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer y perderás el historial de progreso acumulado.
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
