"use client";

import { signOut } from "next-auth/react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { PowerIcon } from "@/components/ui/pretty-icons";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className }: SignOutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-slate-900/45 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/60 hover:bg-cyan-500/10 hover:text-cyan-100",
        isPending && "cursor-not-allowed opacity-60",
        className,
      )}
      onClick={() => startTransition(() => signOut({ callbackUrl: "/login" }))}
      disabled={isPending}
    >
      <PowerIcon className="h-3.5 w-3.5" />
      {isPending ? "Saliendo..." : "Salir"}
    </button>
  );
}
