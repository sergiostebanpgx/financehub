import { Prisma } from "@prisma/client";
import { DashboardTransaction, SavingGoal, Debt } from "@/types/finance";

type TransactionWithCategory = Prisma.TransactionGetPayload<{
  include: { category: true };
}>;

export function serializeTransaction(
  transaction: TransactionWithCategory,
): DashboardTransaction {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount.toString()),
    description: transaction.description,
    date: transaction.date.toISOString(),
    notes: transaction.notes,
    category: {
      id: transaction.category.id,
      name: transaction.category.name,
      color: transaction.category.color,
      icon: transaction.category.icon,
    },
  };
}

export function serializeSavingGoal(goal: Prisma.SavingGoalGetPayload<{}>): SavingGoal {
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: Number(goal.targetAmount.toString()),
    savedAmount: Number(goal.savedAmount.toString()),
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}

export function serializeDebt(debt: Prisma.DebtGetPayload<{}>): Debt {
  return {
    id: debt.id,
    name: debt.name,
    totalAmount: Number(debt.totalAmount.toString()),
    paidAmount: Number(debt.paidAmount.toString()),
    createdAt: debt.createdAt.toISOString(),
    updatedAt: debt.updatedAt.toISOString(),
  };
}
