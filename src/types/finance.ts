export type TransactionType = "INCOME" | "EXPENSE";

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string | null;
};

export type DashboardTransaction = {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  notes: string | null;
  category: Category;
};

export type MonthlyPoint = {
  month: string;
  income: number;
  expense: number;
  balance: number;
};

export type DashboardSummary = {
  balance: number;
  monthIncome: number;
  monthExpense: number;
};

export type ExpenseByCategory = {
  categoryName: string;
  color: string;
  icon: string | null;
  amount: number;
  share: number;
};

export type DashboardData = {
  summary: DashboardSummary;
  monthly: MonthlyPoint[];
  expenseByCategory: ExpenseByCategory[];
  categories: Category[];
  recentTransactions: DashboardTransaction[];
  savingGoals: SavingGoal[];
  debts: Debt[];
  isDemoMode: boolean;
};

export type SavingGoal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type Debt = {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string;
};
