"use client";

import { useState, useRef, KeyboardEvent } from "react";

type OtpInputProps = {
  length?: number;
  onComplete: (otp: string) => void;
};

export function OtpInput({ length = 6, onComplete }: OtpInputProps) {
  const [digits, setDigits] = useState(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    const otp = newDigits.join("");
    if (otp.length === length) onComplete(otp);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-16 text-center text-2xl font-black bg-slate-950/60 border border-white/10 rounded-2xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none"
        />
      ))}
    </div>
  );
}
