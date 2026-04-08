"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputNumberProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number | string;
  onChange?: (value: number) => void;
  prefix?: string;
}

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  ({ className, value, onChange, prefix = "$ ", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("");

    const formatNumber = (num: number | string) => {
      if (num === "" || num === undefined || num === null) return "";
      const val = typeof num === "string" ? parseFloat(num.replace(/[^\d.-]/g, "")) : num;
      if (isNaN(val)) return "";
      return val.toLocaleString("de-DE"); // Using German locale for dot separator
    };

    React.useEffect(() => {
      if (value !== undefined) {
        const formatted = formatNumber(value);
        setDisplayValue(formatted);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\./g, "");
      const numericValue = parseFloat(rawValue);

      if (rawValue === "") {
        setDisplayValue("");
        onChange?.(0);
        return;
      }

      if (!isNaN(numericValue)) {
        setDisplayValue(formatNumber(numericValue));
        onChange?.(numericValue);
      }
    };

    return (
      <div className="relative group">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold pointer-events-none transition-colors group-focus-within:text-cyan-400">
            {prefix}
          </span>
        )}
        <input
          type="text"
          className={cn(
            "flex h-12 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-2 text-base text-slate-100 ring-offset-slate-950 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 focus-visible:border-cyan-400/50 transition-all disabled:cursor-not-allowed disabled:opacity-50",
            prefix && "pl-10",
            "font-bold",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          ref={ref}
          inputMode="numeric"
          {...props}
        />
      </div>
    );
  }
);
InputNumber.displayName = "InputNumber";

export { InputNumber };
