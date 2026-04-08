"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpenseIcon, IncomeIcon } from "@/components/ui/pretty-icons";
import { InputNumber } from "@/components/ui/input-number";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import type { Category, DashboardTransaction } from "@/types/finance";

type TransactionFormProps = {
  categories: Category[];
  initialData?: DashboardTransaction | null;
  onCancel?: () => void;
};

type FormState = {
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  notes: string;
};

export function TransactionForm({ categories, initialData, onCancel }: TransactionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const defaultCategoryId = useMemo(() => categories[0]?.id ?? "", [categories]);

  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    type: "EXPENSE",
    amount: 0,
    description: "",
    date: new Date(),
    categoryId: defaultCategoryId,
    notes: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type,
        amount: initialData.amount,
        description: initialData.description,
        date: new Date(initialData.date),
        categoryId: initialData.category.id,
        notes: initialData.notes ?? "",
      });
    } else {
      resetForm();
    }
  }, [initialData, defaultCategoryId]);

  const isDisabled = categories.length === 0 || isPending;

  function updateField<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm({
      type: "EXPENSE",
      amount: 0,
      description: "",
      date: new Date(),
      categoryId: defaultCategoryId,
      notes: "",
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (form.amount <= 0) {
      setError("El valor debe ser mayor que cero.");
      return;
    }

    startTransition(async () => {
      try {
        const url = initialData ? `/api/transactions/${initialData.id}` : "/api/transactions";
        const method = initialData ? "PATCH" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            date: form.date.toISOString(),
          }),
        });

        if (!response.ok) {
          const payload = (await response.json()) as { message?: string };
          throw new Error(payload.message ?? "No fue posible guardar el movimiento.");
        }

        if (onCancel && initialData) {
          onCancel();
        } else {
          resetForm();
        }
        router.refresh();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "No fue posible guardar el movimiento.",
        );
      }
    });
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-950/40 p-1.5">
        <button
          type="button"
          onClick={() => updateField("type", "EXPENSE")}
          className={`rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
            form.type === "EXPENSE"
              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <ExpenseIcon className="mr-2 h-4 w-4 inline" />
          Gasto
        </button>
        <button
          type="button"
          onClick={() => updateField("type", "INCOME")}
          className={`rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
            form.type === "INCOME"
              ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <IncomeIcon className="mr-2 h-4 w-4 inline" />
          Ingreso
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Valor del movimiento</Label>
          <InputNumber
            placeholder="0"
            value={form.amount}
            onChange={(val) => updateField("amount", val)}
            disabled={isDisabled}
            className="text-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Descripción</Label>
          <Input
            placeholder="¿En qué gastaste?"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            disabled={isDisabled}
            required
            className="font-bold"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Fecha</Label>
            <DatePicker
              date={form.date}
              onChange={(date) => date && updateField("date", date)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Categoría</Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) => updateField("categoryId", value)}
              disabled={isDisabled}
            >
              <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-slate-950/45 px-4 font-bold">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 rounded-2xl">
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="rounded-xl focus:bg-white/10 focus:text-cyan-400">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Notas adicionales</Label>
          <textarea
            className="flex min-h-[100px] w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-base text-slate-100 placeholder:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 transition-all resize-none font-medium"
            placeholder="Algún detalle extra..."
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            disabled={isDisabled}
          />
        </div>
      </div>

      {error && (
        <p className="text-rose-400 text-sm bg-rose-400/10 p-4 rounded-2xl border border-rose-400/20 font-bold">
          {error}
        </p>
      )}

      <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/10 active:scale-[0.98] disabled:opacity-50" disabled={isDisabled}>
        {isPending ? "Procesando..." : "Guardar movimiento"}
      </button>
    </form>
  );
}
