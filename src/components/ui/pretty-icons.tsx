import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

function BaseIcon({
  className,
  children,
  viewBox = "0 0 24 24",
}: IconProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function BrandSparkIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <defs>
        <linearGradient id="brandGlow" x1="3" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#56F2FF" />
          <stop offset="1" stopColor="#9B5CFF" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.8C12.6 5.6 14.5 7.6 17.3 8.2C14.5 8.8 12.6 10.8 12 13.6C11.4 10.8 9.5 8.8 6.7 8.2C9.5 7.6 11.4 5.6 12 2.8Z"
        fill="url(#brandGlow)"
      />
      <circle cx="18.2" cy="16.8" r="2.3" fill="#4BE5FF" fillOpacity="0.9" />
      <circle cx="6.2" cy="16.5" r="1.7" fill="#AF7BFF" fillOpacity="0.82" />
    </BaseIcon>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13.5" y="3.5" width="7" height="5.3" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="13.5" y="11.8" width="7" height="8.7" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function TransactionsIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M4 8.2H18.7L15.4 4.9" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 15.8H5.3L8.6 19.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function ReportsIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="4" width="16" height="16" rx="2.7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 15.5V12.5M12 15.5V9.8M16 15.5V7.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function BudgetIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3.5" y="6.3" width="17" height="11.4" rx="3.4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.6 9.4H20.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.4" cy="12.2" r="1.3" fill="currentColor" />
    </BaseIcon>
  );
}

export function GoalsIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </BaseIcon>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path
        d="M12 5.6L13.6 4.4L16.1 5.2L16.5 7.1L18.4 7.9L19.1 10.4L17.9 12L19.1 13.6L18.4 16.1L16.5 16.9L16.1 18.8L13.6 19.6L12 18.4L10.4 19.6L7.9 18.8L7.5 16.9L5.6 16.1L4.9 13.6L6.1 12L4.9 10.4L5.6 7.9L7.5 7.1L7.9 5.2L10.4 4.4L12 5.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    </BaseIcon>
  );
}

export function PowerIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 4.1V11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M16.8 6.2A7.3 7.3 0 1 1 7.2 6.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function BalanceIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3.7" y="6.8" width="16.6" height="10.4" rx="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.8 10.2H20.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.3" cy="12" r="1.2" fill="currentColor" />
      <path d="M8.3 6.8L10 4.8H14L15.7 6.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function FlowIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M4.2 14.5L8.5 10.8L11.4 13.3L15.2 8.8L19.8 12.1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="10.8" r="1.2" fill="currentColor" />
      <circle cx="15.2" cy="8.8" r="1.2" fill="currentColor" />
    </BaseIcon>
  );
}

export function SavingsIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M6 11.6C6 8.4 8.6 6 12 6C15.4 6 18 8.4 18 11.6V14.6C18 16.7 16.3 18.4 14.2 18.4H9.8C7.7 18.4 6 16.7 6 14.6V11.6Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.1 10.8H13.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="13.7" r="1.2" fill="currentColor" />
      <path d="M9 6.1C9.6 4.8 10.7 4 12 4C13.3 4 14.4 4.8 15 6.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function IncomeIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 19V5.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.8 10.2L12 5L17.2 10.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function ExpenseIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 5V18.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17.2 13.8L12 19L6.8 13.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M5.7 7.2H18.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M9 7.2V5.6C9 4.7 9.7 4 10.6 4H13.4C14.3 4 15 4.7 15 5.6V7.2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M7.4 7.2L8.1 18.1C8.2 19.2 9.1 20 10.2 20H13.8C14.9 20 15.8 19.2 15.9 18.1L16.6 7.2" stroke="currentColor" strokeWidth="1.9" />
      <path d="M10.2 10.1V16.3M13.8 10.1V16.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function EditIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </BaseIcon>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
      <path d="M16 14H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function CreditCardIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
      <path d="M7 15H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function CategoryWalletIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3.8" y="6.3" width="16.4" height="11.4" rx="3.1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.8 9.6H20.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.1" cy="12.2" r="1.3" fill="currentColor" />
    </BaseIcon>
  );
}

export function CategoryFoodIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M7.2 4.5V11.8M10 4.5V11.8M8.6 4.5V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M15 4.5C17.5 7.5 17.5 10.7 15 13.8V20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function CategoryBusIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="4.2" y="5.1" width="15.6" height="11.2" rx="2.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 10.4H19.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="8.3" cy="17.5" r="1.5" fill="currentColor" />
      <circle cx="15.7" cy="17.5" r="1.5" fill="currentColor" />
    </BaseIcon>
  );
}

export function CategoryHouseIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M4.8 10.8L12 4.8L19.2 10.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.7 10.5V19.2H17.3V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 19.2V14.3H14V19.2" stroke="currentColor" strokeWidth="1.8" />
    </BaseIcon>
  );
}

export function CategoryEntertainmentIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="3.7" y="6" width="16.6" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.7 6V18M15.3 6V18" stroke="currentColor" strokeWidth="1.7" />
      <path d="M11 10L14 12L11 14V10Z" fill="currentColor" />
    </BaseIcon>
  );
}

export function CategoryShoppingIcon({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M5.2 8.1H18.5L17.3 15.8H6.3L5.2 8.1Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.2 8.1V6.7C8.2 4.9 9.6 3.5 11.4 3.5H12.6C14.4 3.5 15.8 4.9 15.8 6.7V8.1" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10.1" cy="18.8" r="1.2" fill="currentColor" />
      <circle cx="14.9" cy="18.8" r="1.2" fill="currentColor" />
    </BaseIcon>
  );
}
