"use client";

import { useState } from "react";
import { TransactionForm } from "./transaction-form";
import { TransactionsTable } from "./transactions-table";
import type { Category, DashboardTransaction } from "@/types/finance";

type TransactionsManagerProps = {
  categories: Category[];
  recentTransactions: DashboardTransaction[];
};

export function TransactionsManager({
  categories,
  recentTransactions,
}: TransactionsManagerProps) {
  const [editingTransaction, setEditingTransaction] = useState<DashboardTransaction | null>(null);

  function handleEdit(transaction: DashboardTransaction) {
    setEditingTransaction(transaction);
    // Hacer scroll suave hasta el formulario
    const formElement = document.getElementById("registro");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleCancel() {
    setEditingTransaction(null);
  }

  return (
    <>
      <section id="registro" className="surface-panel animate-slide-up p-4 delay-300 sm:p-5 lg:p-6">
        <h2 className="panel-title text-lg font-semibold leading-tight tracking-tight sm:text-xl lg:text-2xl">
          {editingTransaction ? "Editar movimiento" : "Registrar movimiento"}
        </h2>
        <p className="panel-subtitle mt-1 text-xs sm:mt-2 sm:text-sm">
          {editingTransaction 
            ? "Actualiza los detalles de tu registro." 
            : "Agrega un ingreso o gasto en segundos."}
        </p>
        <div className="mt-4 sm:mt-5">
          <TransactionForm 
            categories={categories} 
            initialData={editingTransaction}
            onCancel={handleCancel}
          />
          {editingTransaction && (
            <button
              onClick={handleCancel}
              className="mt-3 w-full px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition text-sm font-semibold"
            >
              Cancelar Edición
            </button>
          )}
        </div>
      </section>

      <section id="movimientos" className="surface-panel animate-slide-up p-4 delay-400 sm:p-5 lg:p-6">
        <h2 className="panel-title text-lg font-semibold leading-tight tracking-tight sm:text-xl lg:text-2xl">
          Movimientos recientes
        </h2>
        <p className="panel-subtitle mt-1 text-xs sm:mt-2 sm:text-sm">
          Últimos 10 registros para control diario.
        </p>
        <div className="mt-4 sm:mt-5">
          <TransactionsTable 
            transactions={recentTransactions} 
            onEdit={handleEdit}
          />
        </div>
      </section>
    </>
  );
}
