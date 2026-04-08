import {
  addMonths,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { formatMonthTag } from "@/lib/format";
import { serializeTransaction, serializeSavingGoal, serializeDebt } from "@/lib/serializers";
import type { Category, DashboardData, DashboardTransaction, SavingGoal, Debt } from "@/types/finance";

function buildMonthlyRange() {
  const startDate = startOfMonth(subMonths(new Date(), 5));
  return Array.from({ length: 6 }).map((_, index) => {
    const date = addMonths(startDate, index);
    const key = format(date, "yyyy-MM");
    return {
      key,
      month: formatMonthTag(date),
      income: 0,
      expense: 0,
      balance: 0,
    };
  });
}

function buildDashboardPayload(
  categories: Category[],
  transactions: DashboardTransaction[],
  savingGoals: SavingGoal[],
  debts: Debt[],
  isDemoMode: boolean,
): DashboardData {
  const monthlyRange = buildMonthlyRange();
  const monthlyMap = new Map(monthlyRange.map((entry) => [entry.key, entry]));

  for (const transaction of transactions) {
    const key = format(new Date(transaction.date), "yyyy-MM");
    const month = monthlyMap.get(key);
    if (!month) continue;

    if (transaction.type === "INCOME") {
      month.income += transaction.amount;
    } else {
      month.expense += transaction.amount;
    }
    month.balance = month.income - month.expense;
  }

  const income = transactions
    .filter((tx) => tx.type === "INCOME")
    .reduce((acc, tx) => acc + tx.amount, 0);
  const expense = transactions
    .filter((tx) => tx.type === "EXPENSE")
    .reduce((acc, tx) => acc + tx.amount, 0);
  const balance = income - expense;

  const currentMonth = monthlyRange.find((item) =>
    isSameMonth(new Date(`${item.key}-01`), new Date()),
  );

  const currentMonthExpenses = transactions.filter(
    (tx) => tx.type === "EXPENSE" && isSameMonth(new Date(tx.date), new Date()),
  );

  const categoryTotals = new Map<string, {
    categoryName: string;
    color: string;
    icon: string | null;
    amount: number;
  }>();
  for (const tx of currentMonthExpenses) {
    const prev = categoryTotals.get(tx.category.id);
    categoryTotals.set(tx.category.id, {
      categoryName: tx.category.name,
      color: tx.category.color,
      icon: tx.category.icon,
      amount: (prev?.amount ?? 0) + tx.amount,
    });
  }

  const monthExpenseTotal = currentMonthExpenses.reduce((acc, tx) => acc + tx.amount, 0);

  const expenseByCategory = Array.from(categoryTotals.values())
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((item) => ({
      ...item,
      share: monthExpenseTotal === 0 ? 0 : Math.round((item.amount / monthExpenseTotal) * 100),
    }));

  return {
    summary: {
      balance,
      monthIncome: currentMonth?.income ?? 0,
      monthExpense: currentMonth?.expense ?? 0,
    },
    monthly: monthlyRange.map((item) => ({
      month: item.month,
      income: item.income,
      expense: item.expense,
      balance: item.balance,
    })),
    expenseByCategory,
    categories,
    recentTransactions: transactions
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 12),
    savingGoals,
    debts,
    isDemoMode,
  };
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  try {
    const [categories, transactions, savingGoals, debts] = await Promise.all([
      prisma.category.findMany({ where: { userId }, orderBy: { name: "asc" } }),
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        include: { category: true },
        take: 80,
      }),
      prisma.savingGoal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
      prisma.debt.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    ]);

    const normalizedCategories: Category[] = categories.map((c: Category) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      icon: c.icon,
    }));

    return buildDashboardPayload(
      normalizedCategories,
      transactions.map(serializeTransaction),
      savingGoals.map(serializeSavingGoal),
      debts.map(serializeDebt),
      false,
    );
  } catch {
    // Fallback simple para desarrollo/demo
    return buildDashboardPayload([], [], [], [], true);
  }
}
