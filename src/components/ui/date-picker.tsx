"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({
  date,
  onChange,
  className,
  placeholder = "Seleccionar fecha",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (selected?: Date) => {
      onChange?.(selected);

      if (selected) {
        setOpen(false);
      }
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "group relative h-12 w-full justify-start rounded-2xl border border-white/10 bg-slate-950/45 px-4 text-left font-semibold transition-all hover:border-cyan-400/35 hover:bg-slate-950/65",
            !date && "text-slate-500",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 transition-colors group-hover:text-cyan-300" />
          {date ? format(date, "PPP", { locale: es }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-white/10 bg-slate-950/98 p-0 shadow-2xl" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
