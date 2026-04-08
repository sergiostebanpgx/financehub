"use client";

import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  components,
  formatters,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const mergedFormatters = React.useMemo<CalendarProps["formatters"]>(
    () => ({
      ...formatters,
      formatCaption: (month, options, dateLib) => {
        const label =
          formatters?.formatCaption?.(month, options, dateLib) ??
          month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

        if (!label) {
          return "";
        }

        return `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
      },
    }),
    [formatters],
  );

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "rounded-3xl border border-white/10 bg-slate-950/95 p-3 text-slate-100",
        className,
      )}
      classNames={{
        months: "flex flex-col gap-2",
        month: "space-y-3",
        month_caption:
          "relative flex items-center justify-center border-b border-white/10 pb-3",
        caption_label: "font-black text-slate-100 tracking-[0.06em]",
        nav: "pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/80 text-slate-300 transition hover:border-cyan-300/35 hover:bg-slate-800 hover:text-cyan-200",
        button_next:
          "pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/80 text-slate-300 transition hover:border-cyan-300/35 hover:bg-slate-800 hover:text-cyan-200",
        chevron: "h-4 w-4",
        month_grid: "w-full border-collapse",
        weekdays: "grid grid-cols-7",
        weekday:
          "w-9 text-center text-[11px] font-black uppercase tracking-[0.14em] text-slate-500",
        weeks: "space-y-1",
        week: "grid grid-cols-7",
        day: "flex h-9 w-9 items-center justify-center p-0",
        day_button:
          "h-9 w-9 rounded-xl border border-transparent bg-transparent text-sm font-semibold text-slate-200 transition hover:border-cyan-300/35 hover:bg-cyan-500/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50",
        selected:
          "border-transparent bg-gradient-to-b from-cyan-300 to-sky-500 text-slate-950 shadow-[0_10px_24px_rgba(56,189,248,0.35)] hover:brightness-105",
        today: "border border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
        outside: "text-slate-600 opacity-70",
        disabled: "text-slate-600 opacity-40",
        hidden: "invisible",

        // Backward compatible aliases for any older DayPicker internals.
        head_row: "grid grid-cols-7",
        head_cell:
          "w-9 text-center text-[11px] font-black uppercase tracking-[0.14em] text-slate-500",
        row: "grid grid-cols-7",
        cell: "flex h-9 w-9 items-center justify-center p-0",
        day_selected:
          "border-transparent bg-gradient-to-b from-cyan-300 to-sky-500 text-slate-950 shadow-[0_10px_24px_rgba(56,189,248,0.35)] hover:brightness-105",
        day_today: "border border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
        day_outside: "text-slate-600 opacity-70",
        day_disabled: "text-slate-600 opacity-40",
        nav_button:
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/80 text-slate-300 transition hover:border-cyan-300/35 hover:bg-slate-800 hover:text-cyan-200",
        ...classNames,
      }}
      formatters={mergedFormatters}
      components={{
        Chevron: ({ className: chevronClassName, orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("h-4 w-4", chevronClassName)} />;
          }

          if (orientation === "right") {
            return <ChevronRight className={cn("h-4 w-4", chevronClassName)} />;
          }

          if (orientation === "up") {
            return (
              <ChevronDown className={cn("h-4 w-4 rotate-180", chevronClassName)} />
            );
          }

          return <ChevronDown className={cn("h-4 w-4", chevronClassName)} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
