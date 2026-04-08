import { DashboardTransaction, SavingGoal, Debt } from "@/types/finance";

type DecimalLike = {
  toString(): string;
};

type TransactionWithCategory = {
  id: string;
  type: DashboardTransaction["type"];
  amount: DecimalLike;
  description: string;
  date: Date;
  notes: string | null;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string | null;
  };
};

type SavingGoalRecord = {
  id: string;
  name: string;
  targetAmount: DecimalLike;
  savedAmount: DecimalLike;
  createdAt: Date;
  updatedAt: Date;
};

type DebtRecord = {
  id: string;
  name: string;
  totalAmount: DecimalLike;
  paidAmount: DecimalLike;
  createdAt: Date;
  updatedAt: Date;
};

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

export function serializeSavingGoal(goal: SavingGoalRecord): SavingGoal {
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: Number(goal.targetAmount.toString()),
    savedAmount: Number(goal.savedAmount.toString()),
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}

export function serializeDebt(debt: DebtRecord): Debt {
  return {
    id: debt.id,
    name: debt.name,
    totalAmount: Number(debt.totalAmount.toString()),
    paidAmount: Number(debt.paidAmount.toString()),
    createdAt: debt.createdAt.toISOString(),
    updatedAt: debt.updatedAt.toISOString(),
  };
}
