import { format } from "date-fns";
import { es } from "date-fns/locale";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatShortDate(value: Date | string) {
  return format(new Date(value), "dd MMM yyyy", { locale: es });
}

export function formatMonthTag(value: Date) {
  const shortMonth = format(value, "MMM", { locale: es });
  return shortMonth[0]?.toUpperCase() + shortMonth.slice(1);
}
